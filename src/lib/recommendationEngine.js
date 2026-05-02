class RecommendationEngine {
    constructor() {
        this.userPreferences = new Map();
        this.restaurantFeatures = new Map();
        this.userSimilarity = new Map();
        this.weights = {
            cuisine: 0.3,
            priceRange: 0.2,
            rating: 0.25,
            distance: 0.15,
            reviewHistory: 0.1
        };
    }

    // Collaborative Filtering
    calculateUserSimilarity(user1Reviews, user2Reviews) {
        const commonRestaurants = user1Reviews.filter(r1 =>
            user2Reviews.some(r2 => r2.restaurantId === r1.restaurantId)
        );

        if (commonRestaurants.length === 0) return 0;

        // Pearson correlation coefficient
        const sum1 = commonRestaurants.reduce((sum, r) => sum + r.rating, 0);
        const sum2 = commonRestaurants.reduce((sum, r) => {
            const r2 = user2Reviews.find(r2 => r2.restaurantId === r.restaurantId);
            return sum + r2.rating;
        }, 0);

        const sum1Sq = commonRestaurants.reduce((sum, r) => sum + r.rating * r.rating, 0);
        const sum2Sq = commonRestaurants.reduce((sum, r) => {
            const r2 = user2Reviews.find(r2 => r2.restaurantId === r.restaurantId);
            return sum + r2.rating * r2.rating;
        }, 0);

        const pSum = commonRestaurants.reduce((sum, r) => {
            const r2 = user2Reviews.find(r2 => r2.restaurantId === r.restaurantId);
            return sum + r.rating * r2.rating;
        }, 0);

        const n = commonRestaurants.length;
        const num = pSum - (sum1 * sum2 / n);
        const den = Math.sqrt((sum1Sq - sum1 * sum1 / n) * (sum2Sq - sum2 * sum2 / n));

        return den === 0 ? 0 : num / den;
    }

    // Content-Based Filtering
    calculateRestaurantSimilarity(restaurant1, restaurant2) {
        let similarity = 0;

        // Cuisine similarity
        const cuisineSimilarity = restaurant1.cuisine === restaurant2.cuisine ? 1 : 0;
        similarity += cuisineSimilarity * this.weights.cuisine;

        // Price range similarity
        const priceDiff = Math.abs(restaurant1.priceRange - restaurant2.priceRange);
        const priceSimilarity = Math.max(0, 1 - priceDiff / 4); // Assuming 1-5 price scale
        similarity += priceSimilarity * this.weights.priceRange;

        // Rating similarity
        const ratingDiff = Math.abs(restaurant1.rating - restaurant2.rating);
        const ratingSimilarity = Math.max(0, 1 - ratingDiff / 5); // 1-5 rating scale
        similarity += ratingSimilarity * this.weights.rating;

        // Feature similarity (tags, amenities)
        const commonFeatures = restaurant1.features?.filter(f =>
            restaurant2.features?.includes(f)
        ).length || 0;
        const totalFeatures = new Set([
            ...(restaurant1.features || []),
            ...(restaurant2.features || [])
        ]).size;
        const featureSimilarity = totalFeatures > 0 ? commonFeatures / totalFeatures : 0;
        similarity += featureSimilarity * 0.1;

        return similarity;
    }

    // Hybrid Recommendation System
    async generateRecommendations(userId, userLocation, options = {}) {
        const {
            limit = 10,
            includeVisited = false,
            maxDistance = 25,
            minRating = 3.0
        } = options;

        try {
            // Get user data
            const [userReviews, userPrefs, allRestaurants, allUserReviews] = await Promise.all([
                this.getUserReviews(userId),
                this.getUserPreferences(userId),
                this.getAllRestaurants(),
                this.getAllUserReviews()
            ]);

            // Filter restaurants by basic criteria
            let candidateRestaurants = allRestaurants.filter(restaurant => {
                const distance = this.calculateDistance(userLocation, restaurant.location);
                return (
                    restaurant.rating >= minRating &&
                    distance <= maxDistance &&
                    (includeVisited || !userReviews.some(r => r.restaurantId === restaurant.id))
                );
            });

            // Calculate scores for each restaurant
            const scoredRestaurants = candidateRestaurants.map(restaurant => {
                const contentScore = this.calculateContentBasedScore(restaurant, userPrefs, userReviews);
                const collaborativeScore = this.calculateCollaborativeScore(restaurant, userId, allUserReviews);
                const popularityScore = this.calculatePopularityScore(restaurant);
                const diversityScore = this.calculateDiversityScore(restaurant, userReviews);
                const locationScore = this.calculateLocationScore(restaurant, userLocation);

                const finalScore = (
                    contentScore * 0.35 +
                    collaborativeScore * 0.25 +
                    popularityScore * 0.15 +
                    diversityScore * 0.15 +
                    locationScore * 0.1
                );

                return {
                    ...restaurant,
                    recommendationScore: finalScore,
                    reasons: this.generateRecommendationReasons(restaurant, userPrefs, contentScore, collaborativeScore)
                };
            });

            // Sort by score and apply diversity filter
            const recommendations = this.applyDiversityFilter(
                scoredRestaurants.sort((a, b) => b.recommendationScore - a.recommendationScore),
                limit
            );

            return {
                recommendations: recommendations.slice(0, limit),
                metadata: {
                    totalCandidates: candidateRestaurants.length,
                    userPreferences: userPrefs,
                    generatedAt: new Date().toISOString()
                }
            };

        } catch (error) {
            console.error('Error generating recommendations:', error);
            return { recommendations: [], error: error.message };
        }
    }

    calculateContentBasedScore(restaurant, userPrefs, userReviews) {
        let score = 0;

        // Cuisine preference
        if (userPrefs.favoriteCuisines?.includes(restaurant.cuisine)) {
            score += 0.4;
        }

        // Price preference
        if (userPrefs.preferredPriceRange) {
            const priceDiff = Math.abs(restaurant.priceRange - userPrefs.preferredPriceRange);
            score += Math.max(0, 0.3 - priceDiff * 0.1);
        }

        // Feature preferences
        const matchingFeatures = restaurant.features?.filter(f =>
            userPrefs.preferredFeatures?.includes(f)
        ).length || 0;
        score += matchingFeatures * 0.05;

        // Historical rating pattern
        const avgUserRating = userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length;
        if (avgUserRating && restaurant.rating >= avgUserRating - 0.5) {
            score += 0.2;
        }

        return Math.min(score, 1);
    }

    calculateCollaborativeScore(restaurant, userId, allUserReviews) {
        const similarUsers = this.findSimilarUsers(userId, allUserReviews);

        if (similarUsers.length === 0) return 0;

        let weightedSum = 0;
        let similaritySum = 0;

        similarUsers.forEach(({ userId: similarUserId, similarity }) => {
            const userReviews = allUserReviews.filter(r => r.userId === similarUserId);
            const restaurantReview = userReviews.find(r => r.restaurantId === restaurant.id);

            if (restaurantReview) {
                weightedSum += similarity * (restaurantReview.rating / 5); // Normalize to 0-1
                similaritySum += Math.abs(similarity);
            }
        });

        return similaritySum > 0 ? weightedSum / similaritySum : 0;
    }

    calculatePopularityScore(restaurant) {
        // Combine rating and review count with diminishing returns
        const normalizedRating = restaurant.rating / 5;
        const normalizedReviewCount = Math.min(restaurant.reviewCount / 100, 1);

        return (normalizedRating * 0.7) + (normalizedReviewCount * 0.3);
    }

    calculateDiversityScore(restaurant, userReviews) {
        // Encourage diversity in cuisine types
        const userCuisines = [...new Set(userReviews.map(r => r.restaurant?.cuisine))];
        const cuisineDiversity = userCuisines.includes(restaurant.cuisine) ? 0.3 : 1.0;

        // Encourage trying different price ranges
        const userPriceRanges = [...new Set(userReviews.map(r => r.restaurant?.priceRange))];
        const priceDiversity = userPriceRanges.includes(restaurant.priceRange) ? 0.5 : 1.0;

        return (cuisineDiversity + priceDiversity) / 2;
    }

    calculateLocationScore(restaurant, userLocation) {
        const distance = this.calculateDistance(userLocation, restaurant.location);
        // Prefer closer restaurants with exponential decay
        return Math.exp(-distance / 10); // 10km half-life
    }

    calculateDistance(loc1, loc2) {
        const R = 6371; // Earth's radius in km
        const dLat = this.toRad(loc2.lat - loc1.lat);
        const dLon = this.toRad(loc2.lng - loc1.lng);
        const lat1 = this.toRad(loc1.lat);
        const lat2 = this.toRad(loc2.lat);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

    toRad(value) {
        return value * Math.PI / 180;
    }

    findSimilarUsers(userId, allUserReviews, limit = 10) {
        const userReviews = allUserReviews.filter(r => r.userId === userId);
        const otherUsers = [...new Set(allUserReviews.filter(r => r.userId !== userId).map(r => r.userId))];

        const similarities = otherUsers.map(otherUserId => {
            const otherUserReviews = allUserReviews.filter(r => r.userId === otherUserId);
            const similarity = this.calculateUserSimilarity(userReviews, otherUserReviews);

            return { userId: otherUserId, similarity };
        });

        return similarities
            .filter(s => s.similarity > 0.1) // Minimum similarity threshold
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, limit);
    }

    applyDiversityFilter(restaurants, limit) {
        const selected = [];
        const cuisineCount = {};
        const priceRangeCount = {};

        for (const restaurant of restaurants) {
            if (selected.length >= limit) break;

            const cuisine = restaurant.cuisine;
            const priceRange = restaurant.priceRange;

            // Limit restaurants per cuisine and price range for diversity
            const cuisineLimit = Math.ceil(limit / 4);
            const priceLimit = Math.ceil(limit / 3);

            if ((cuisineCount[cuisine] || 0) < cuisineLimit &&
                (priceRangeCount[priceRange] || 0) < priceLimit) {
                selected.push(restaurant);
                cuisineCount[cuisine] = (cuisineCount[cuisine] || 0) + 1;
                priceRangeCount[priceRange] = (priceRangeCount[priceRange] || 0) + 1;
            }
        }

        // Fill remaining slots if we haven't reached the limit
        if (selected.length < limit) {
            const remaining = restaurants.filter(r => !selected.includes(r));
            selected.push(...remaining.slice(0, limit - selected.length));
        }

        return selected;
    }

    generateRecommendationReasons(restaurant, userPrefs, contentScore, collaborativeScore) {
        const reasons = [];

        if (userPrefs.favoriteCuisines?.includes(restaurant.cuisine)) {
            reasons.push(`You love ${restaurant.cuisine} cuisine`);
        }

        if (restaurant.rating >= 4.5) {
            reasons.push('Highly rated by the community');
        }

        if (collaborativeScore > 0.7) {
            reasons.push('People with similar taste loved this place');
        }

        if (restaurant.features?.includes('outdoor_seating') && userPrefs.preferredFeatures?.includes('outdoor_seating')) {
            reasons.push('Has outdoor seating that you prefer');
        }

        if (reasons.length === 0) {
            reasons.push('Recommended based on your activity');
        }

        return reasons;
    }

    // Mock data methods - replace with actual API calls
    async getUserReviews(userId) {
        // Mock implementation
        return [];
    }

    async getUserPreferences(userId) {
        // Mock implementation
        return {
            favoriteCuisines: ['Italian', 'Asian'],
            preferredPriceRange: 3,
            preferredFeatures: ['outdoor_seating', 'parking']
        };
    }

    async getAllRestaurants() {
        // Mock implementation
        return [];
    }

    async getAllUserReviews() {
        // Mock implementation
        return [];
    }
}

export const recommendationEngine = new RecommendationEngine();