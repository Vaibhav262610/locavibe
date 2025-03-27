import { connectDb } from "@/db/db"; // Assuming you have a utility function to connect to DB
import Saved from "@/models/Saved"; // Import the Saved model

export async function POST(request) {
    try {

        connectDb();

        const { profileId, reviewId } = await request.json();

        if (!profileId || !reviewId) {
            return res.status(400).json({ error: "Profile ID and Review ID are not Found." });
        }
        const saved = new Saved({
            profileId,
            reviewId
        })

        await saved.save()

        return res.status(200).json({ success: true, message: "Saved successfully!" });
    } catch (error) {
        console.error("Error saving review:", error);
        return res.status(500).json({ error: "Error saving review." });

    }
}