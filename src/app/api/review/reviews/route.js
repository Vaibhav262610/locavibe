import { connectDb } from "@/db/db";
import Review from "@/models/Review";
import { getDataFromToken } from "@/helpers/getDataFromToken"; // Helper to verify JWT
import { NextResponse } from "next/server";


connectDb();

export async function POST(request,) {
    try {



        const { profileId, username, content, title, when, who, category, rating } = await request.json();
        const newReview = new Review({
            profileId,
            username,
            title,
            content,
            when,
            who,
            category,
            rating,
            createdAt: new Date(),
        });

        await newReview.save();
        const response = new NextResponse(
            JSON.stringify({
                message: 'REVIEW SUBMITTED SUCCESSFULLY',
                success: true,
                // token: newToken, // Send token in response (for localStorage)
                redirectTo: '/write-review',
            }),
            {
                status: 200,
            }
        );
        return response;
    } catch (error) {
        console.error('Error during login process:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
