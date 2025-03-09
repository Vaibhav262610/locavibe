import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI; // Ensure this is correct
const client = new MongoClient(uri);

export async function GET() {
    try {
        console.log("Connecting to MongoDB...");

        await client.connect();
        const database = client.db("locavibe");  // Make sure this matches your DB
        const collection = database.collection("reviews");  // Ensure this is the correct collection name

        // Fetch all documents in the events collection
        const events = await collection.find({}).toArray();
        console.log("Fetched events:", events);  // Log the fetched data

        return new Response(JSON.stringify(events), { status: 200 });
    } catch (error) {
        console.error("Error fetching events:", error);
        return new Response("Failed to fetch events", { status: 500 });
    } finally {
        await client.close(); // Close the connection to the database
    }
}
