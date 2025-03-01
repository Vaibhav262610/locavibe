import { connectDb } from "@/db/db";
import Review from "@/models/Review";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connectDb();
        const body = await req.json();
        console.log("Received body:", body);

        // Convert profileId to ObjectId
        if (!mongoose.Types.ObjectId.isValid(body.profileId)) {
            return NextResponse.json({ message: "Invalid profileId format" }, { status: 400 });
        }
        const profileId = new mongoose.Types.ObjectId(body.profileId);

        const { category, group, reviewText, titleText, rating } = body;

        if (!category || !reviewText || !titleText || !rating) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const newReview = new Review({ profileId, category, group, reviewText, titleText, rating });
        await newReview.save();

        return NextResponse.json({ message: "Review submitted successfully!", review: newReview }, { status: 201 });
    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
    }
}
