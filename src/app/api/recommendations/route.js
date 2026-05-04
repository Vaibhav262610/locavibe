import { NextResponse } from "next/server";
import { connectDb } from "@/db/db";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import Review from "@/models/Review";
import Restaurant from "@/models/Restaurant";
import { groqClient } from "@/lib/groqClient";

export async function GET(request) {
    try {
        await connectDb();

        const userId = await getDataFromToken(request);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get user's review history
        const userReviews = await Review.find({ userId }).populate('restaurantId');

        // Get all restaurants
        const allRestaurants = await Restaurant.find({});

        // Analyze user preferences
        const userPreferences = analyzeUserPreferences(userReviews);

        // Generate AI recommendations using Groq
        let aiRecommendations = [];
        try {
            if (process.env.GROQ_API_KEY) {
                aiRecommendations = await groqClient.generateRecommendations(
                    userPreferences,
                    allRestaurants.slice(0, 20) // Limit for API efficiency
                );
            }
        } catch (error) {
            console.error("Groq API error:", error);
        }

        // Fallback to algorithmic recommendations
        const algorithmicRecommendations = generateAlgorithmicRecommendations(
            userReviews,
            allRestaurants,
            userPreferences
        );

        // Combine and rank recommendations
        const finalRecommendations = combineRecommendations(
            aiRecommendations,
            algorithmicRecommendations
        );

        return NextResponse.json({
            success: true,
            recommendations: finalRecommendations,
            userPreferences,
            totalRestaurants: allRestaurants.length,
            userReviewCount: userReviews.length
        });

    } catch (error) {
        console.error("Recommendations API error:", error);
        return NextResponse.json(
            { error: "Failed to generate recommendations" },
            { status: 500 }
        );
    }
}

function analyzeUserPreferences(userReviews) {
    if (userReviews.length === 0) {
        return {
            favoriteCuisines: [],
            averageRating: 0,
            preferredPriceRange: 2,
            reviewCount: 0
        };
    }

    // Analyze cuisine preferences
    const cuisineCount = {};
    let totalRating = 0;
    let priceRangeSum = 0;
    let priceRangeCount = 0;

    userReviews.forEach(review => {
        if (review.restaurantId) {
            const cuisine = review.restaurantId.cuisine;
            cuisineCount[cuisine] = (cuisineCount[cuisine] || 0) + 1;

            totalRating += review.rating;

            if (review.restaurantId.priceRange) {
                priceRangeSum += review.restaurantId.priceRange;
                priceRangeCount++;
            }
        }
    });

    // Get top cuisines
    const favoriteCuisines = Object.entries(cuisineCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([cuisine]) => cuisine);

    return {
        favoriteCuisines,
        averageRating: totalRating / userReviews.length,
        preferredPriceRange: priceRangeCount > 0 ? Math.round(priceRangeSum / priceRangeCount) : 2,
        reviewCount: userReviews.length
    };
}

function generateAlgorithmicRecommendations(userReviews, allRestaurants, userPreferences) {
    const reviewedRestaurantIds = new Set(
        userReviews.map(review => review.restaurantId?._id?.toString()).filter(Boolean)
    );

    // Filter out already reviewed restaurants
    const candidateRestaurants = allRestaurants.filter(
        restaurant => !reviewedRestaurantIds.has(restaurant._id.toString())
    );

    // Score restaurants based on user preferences
    const scoredRestaurants = candidateRestaurants.map(restaurant => {
        let score = 0;
        let reasons = [];

        // Cuisine preference scoring
        if (userPreferences.favoriteCuisines.includes(restaurant.cuisine)) {
            score += 40;
            reasons.push(`You love ${restaurant.cuisine} cuisine`);
        }

        // Rating scoring
        if (restaurant.rating >= 4.0) {
            score += 30;
            reasons.push("Highly rated by community");
        }

        // Price range preference
        const priceDiff = Math.abs(restaurant.priceRange - userPreferences.preferredPriceRange);
        if (priceDiff <= 1) {
            score += 20;
            reasons.push("Matches your price preference");
        }

        // Popularity boost
        if (restaurant.reviewCount > 50) {
            score += 10;
            reasons.push("Popular choice");
        }

        // New restaurant boost
        const restaurantAge = Date.now() - new Date(restaurant.createdAt).getTime();
        const monthsOld = restaurantAge / (1000 * 60 * 60 * 24 * 30);
        if (monthsOld < 6) {
            score += 15;
            reasons.push("Recently opened");
        }

        return {
            ...restaurant.toObject(),
            recommendationScore: score,
            matchPercentage: Math.min(Math.round((score / 100) * 100), 95),
            reasons: reasons.slice(0, 3)
        };
    });

    // Sort by score and return top recommendations
    return scoredRestaurants
        .sort((a, b) => b.recommendationScore - a.recommendationScore)
        .slice(0, 10);
}

function combineRecommendations(aiRecommendations, algorithmicRecommendations) {
    // If AI recommendations are available, use them as primary
    if (aiRecommendations && aiRecommendations.length > 0) {
        return aiRecommendations.slice(0, 8);
    }

    // Otherwise use algorithmic recommendations
    return algorithmicRecommendations.slice(0, 8);
}