"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import withAuth from "@/lib/withAuth";

const randomProfilePics = [
    "https://i.pravatar.cc/150?img=1",
    "https://i.pravatar.cc/150?img=2",
    "https://i.pravatar.cc/150?img=3",
    "https://i.pravatar.cc/150?img=4",
    "https://i.pravatar.cc/150?img=5",
];

const page = () => {
    const [user, setUser] = useState(null);
    const [profilePic, setProfilePic] = useState("");
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [newUsername, setNewUsername] = useState("");
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("authToken");
                if (!token) {
                    router.push("/login");
                    return;
                }

                const response = await fetch("/api/users/profile", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Invalid or expired token");
                }

                const data = await response.json();
                setUser(data);
                setNewUsername(data.data.username); // Set initial username

                setProfilePic(
                    randomProfilePics[
                    Math.floor(Math.random() * randomProfilePics.length)
                    ]
                );
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const updateUsername = async () => {
        if (!newUsername.trim() || newUsername === user.username) {
            setIsEditing(false);
            return;
        }

        try {
            const token = localStorage.getItem("authToken"); // Get token from localStorage

            if (!token) {
                console.error("No token found");
                return;
            }

            const response = await fetch("/api/users/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Send token in request headers
                },
                body: JSON.stringify({ username: newUsername }),
            });

            if (!response.ok) {
                throw new Error("Failed to update username");
            }

            const updatedUser = await response.json();
            setUser((prev) => ({
                ...prev,
                username: updatedUser.username, // Update username in the frontend
            }));
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating username:", error);
        }
    };



    if (loading) {
        return (
            <div className="flex justify-center flex-col items-center h-screen bg-[#121b22]/10">
                <img
                    className="w-42 h-42 select-none"
                    src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMng0bjlnb3Z1Zmo1N3kxcmoyemw0M3MwNGs3amszemdjbjJtM2FydyZlcD12MV9pbnRlcm5fYnlfaWQmY3Q9cw/6KKKVerzrhjRrClNKt/giphy.gif"
                    alt="Loading..."
                />
                <p className="mt-4 nav font-thin text-3xl text-white">Loading...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen text-xl">
                Failed to load user data.
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm text-center">
                <img
                    src={profilePic}
                    alt="Profile"
                    className="w-24 h-24 mx-auto rounded-full border-4 border-indigo-500"
                />
                <div className="mt-4 flex items-center justify-center gap-2">
                    {isEditing ? (
                        <input
                            type="text"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            className="border p-1 text-center rounded-md focus:outline-none"
                            onKeyDown={(e) => e.key === "Enter" && updateUsername()}
                        />
                    ) : (
                        <h2 className="text-2xl font-semibold text-gray-800">
                            {user.data.username}
                        </h2>
                    )}
                    <button
                        onClick={() => (isEditing ? updateUsername() : setIsEditing(true))}
                        className="ml-2 px-2 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                    >
                        {isEditing ? "Save" : "Edit"}
                    </button>
                </div>
                <p className="text-gray-600">{user.data.email}</p>

                <div className="flex flex-col gap-2">
                    <Link href="/logout">
                        <button
                            onClick={() => router.push("/discover")}
                            className="mt-4 px-6 py-2 w-full bg-red-500 text-white rounded-md hover:bg-red-600"
                        >
                            Log Out
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default withAuth(page);
