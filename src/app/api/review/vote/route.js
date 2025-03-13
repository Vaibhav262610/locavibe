import { NextResponse } from "next/server";
import { connectDb } from "@/db/db";
import Review from "@/models/Review";

// Handle POST request
export async function POST(req) {
    try {
        await connectDb();
        const { reviewId, type } = await req.json();

        if (!reviewId || !type) {
            return NextResponse.json({ message: "Missing reviewId or type" }, { status: 400 });
        }

        const review = await Review.findById(reviewId);
        if (!review) {
            return NextResponse.json({ message: "Review not found" }, { status: 404 });
        }

        if (type === "like") {
            review.likes += 1;
        } else if (type === "dislike") {
            review.dislikes += 1;
        } else {
            return NextResponse.json({ message: "Invalid vote type" }, { status: 400 });
        }

        await review.save();
        return NextResponse.json({ message: "Vote updated", likes: review.likes, dislikes: review.dislikes });
    } catch (error) {
        console.error("Error updating vote:", error);
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
}
