import dbConnect from "../../utils/dbConnect"; // Assuming you have a utility function to connect to DB
import Saved from "../../models/Saved"; // Import the Saved model

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            await dbConnect(); // Connect to the database

            const { profileId, reviewId } = req.body;

            if (!profileId || !reviewId) {
                return res.status(400).json({ error: "Profile ID and Review ID are required." });
            }

            // Create a new Saved document
            const saved = new Saved({
                profileId,
                ReviewId: reviewId,
            });

            // Save to the database
            await saved.save();

            return res.status(200).json({ success: true, message: "Saved successfully!" });
        } catch (error) {
            console.error("Error saving review:", error);
            return res.status(500).json({ error: "Error saving review." });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
