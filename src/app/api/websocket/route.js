import { NextResponse } from "next/server";
import { Server } from "socket.io";

let io;

export async function GET(request) {
    if (!global.io) {
        console.log("Initializing WebSocket server...");

        // Create Socket.IO server
        global.io = new Server({
            cors: {
                origin: process.env.DOMAIN_URI || "http://localhost:3000",
                methods: ["GET", "POST"]
            }
        });

        global.io.on("connection", (socket) => {
            console.log("User connected:", socket.id);

            // Join user to their personal room
            socket.on("join_user_room", (userId) => {
                socket.join(`user_${userId}`);
                console.log(`User ${userId} joined their room`);
            });

            // Handle new review notifications
            socket.on("new_review", (data) => {
                // Broadcast to all users except sender
                socket.broadcast.emit("review_notification", {
                    type: "new_review",
                    message: `New review for ${data.restaurantName}`,
                    data: data,
                    timestamp: new Date().toISOString()
                });
            });

            // Handle like notifications
            socket.on("review_liked", (data) => {
                // Send to review author
                global.io.to(`user_${data.reviewAuthorId}`).emit("like_notification", {
                    type: "review_liked",
                    message: `Someone liked your review of ${data.restaurantName}`,
                    data: data,
                    timestamp: new Date().toISOString()
                });
            });

            // Handle user follow notifications
            socket.on("user_followed", (data) => {
                global.io.to(`user_${data.followedUserId}`).emit("follow_notification", {
                    type: "user_followed",
                    message: `${data.followerName} started following you`,
                    data: data,
                    timestamp: new Date().toISOString()
                });
            });

            socket.on("disconnect", () => {
                console.log("User disconnected:", socket.id);
            });
        });

        console.log("WebSocket server initialized");
    }

    return NextResponse.json({
        success: true,
        message: "WebSocket server running",
        port: process.env.WS_PORT || 3001
    });
}

// Helper function to emit notifications from API routes
export function emitNotification(event, data) {
    if (global.io) {
        global.io.emit(event, data);
    }
}

// Helper function to emit to specific user
export function emitToUser(userId, event, data) {
    if (global.io) {
        global.io.to(`user_${userId}`).emit(event, data);
    }
}