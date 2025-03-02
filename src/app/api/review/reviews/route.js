import { connectDb } from "@/db/db";
import Review from "@/models/Review";
import { getDataFromToken } from "@/helpers/getDataFromToken"; // Helper to verify JWT

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    try {
        await connectDb();

        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Unauthorized" });

        const user = getDataFromToken(token);
        if (!user) return res.status(401).json({ error: "Invalid token" });

        const { category, group, reviewText, titleText, rating } = req.body;
        const newReview = new Review({
            profileId: user.profileId,
            category,
            group,
            reviewText,
            titleText,
            rating,
            createdAt: new Date(),
        });

        await newReview.save();
        res.status(201).json({ message: "Review submitted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
}
