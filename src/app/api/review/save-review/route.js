import { connectDb } from "@/db/db";
import Saved from "@/models/Saved";



export async function POST(request) {
    try {
        // Ensure the DB connection is established before continuing
        await connectDb();
        
        
        const { profileId, reviewId } = await request.json();
        console.log(profileId,reviewId);

        if (!profileId || !reviewId) {
            return new Response(
                JSON.stringify({ error: "Profile ID and Review ID are not Found." }),
                { status: 400 }
            );
        }

        // Save the data to the database
        const saved = new Saved({ profileId, reviewId });
        await saved.save();  // Ensure that save is awaited

        return new Response(
            JSON.stringify({ success: true, message: "Saved successfully!" }),
            { status: 200 }
        );

    } catch (error) {
        console.error("Error saving review:", error);
        return new Response(
            JSON.stringify({ error: "Error saving review." }),
            { status: 500 }
        );
    }
}
