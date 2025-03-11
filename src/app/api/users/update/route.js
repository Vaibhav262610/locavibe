import { NextResponse } from "next/server";
import { connectDb } from "@/db/db";
import User from "@/models/user.models";
import jwt from "jsonwebtoken";

export async function PUT(req) {
    try {
        await connectDb();

        // Get the new username from the request body
        const { username } = await req.json();
        if (!username) return NextResponse.json({ error: "Username is required" }, { status: 400 });

        // Get the token from the Authorization header
        const authHeader = req.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Authorization token is missing" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];  // Extract token from "Bearer <token>"

        // Log token to debug
        console.log("Received token:", token);

        // Verify the token using the JWT_SECRET
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Log decoded token to verify its content
        console.log("JWT_SECRET:", process.env.JWT_SECRET);
        console.log("Decoded token:", decoded);

        // Find the user and update the username
        const user = await User.findByIdAndUpdate(decoded.userId, { username }, { new: true });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ username: user.username }, { status: 200 });
    } catch (error) {
        console.error("Error updating username:", error);

        // Handle specific JWT error
        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
        }

        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
