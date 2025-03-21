"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import withAuth from "@/lib/withAuth";
import { motion } from "framer-motion";
import { FaUserEdit } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { MdAdminPanelSettings } from "react-icons/md";

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [newUsername, setNewUsername] = useState("");
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);

    const adminEmailId = "vaibhav@gmail.com";
    const adminUserName = "vaibhav";

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
                setNewUsername(data.data.username);
                if (adminUserName === data.data.username && adminEmailId === data.data.email) {
                    setIsAdmin(true);
                }
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
            const token = localStorage.getItem("authToken");
            if (!token) return;

            const response = await fetch("/api/users/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ username: newUsername }),
            });

            if (!response.ok) throw new Error("Failed to update username");

            setUser((prev) => ({ ...prev, username: newUsername }));
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating username:", error);
        }
    };

    if (loading) {

        return (
            <div className="flex justify-center flex-col items-center h-screen bg-[#121b22]/10">
                <img
                    className=" select-none md:w-auto w-72"

                    src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMng0bjlnb3Z1Zmo1N3kxcmoyemw0M3MwNGs3amszemdjbjJtM2FydyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/6KKKVerzrhjRrClNKt/giphy.gif"
                    alt="Loading..."
                />
                <p className="mt-4 nav font-thin text-xl md:text-3xl text-white">
                    Loading...
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
            <motion.div
                className="bg-gray-800 p-4 rounded-lg shadow-xl w-full max-w-xs text-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <motion.img
                    whileHover={{ scale: 1.1 }}
                    src="https://mir-s3-cdn-cf.behance.net/project_modules/hd/d95c1f148207527.62d1246c25004.jpg"
                    alt="Profile"
                    className="w-20 h-20 mx-auto rounded-full border-4 border-indigo-500"
                />
                <div className="mt-2 flex items-center justify-center gap-2">
                    {isEditing ? (
                        <input
                            type="text"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            className="border p-2 text-sm text-center rounded-md bg-gray-700 text-white focus:outline-none"
                            onKeyDown={(e) => e.key === "Enter" && updateUsername()}
                        />
                    ) : (
                        <h2 className="text-lg sm:text-xl font-semibold">{user.data.username}</h2>
                    )}
                    <button
                        onClick={() => (isEditing ? updateUsername() : setIsEditing(true))}
                        className="ml-2 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                    >
                        <FaUserEdit size={16} />
                    </button>
                </div>
                <p className="text-gray-400 mt-1 text-sm">{user.data.email}</p>
                {isAdmin ? (
                    <div className="flex flex-col gap-2 mt-4">
                        <Link href="/admin">
                            <button className="flex items-center justify-center gap-2 w-full p-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                                <MdAdminPanelSettings size={18} /> Admin Panel
                            </button>
                        </Link>
                        <button
                            onClick={() => router.push("/discover")}
                            className="flex items-center justify-center gap-2 w-full p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                        >
                            <FiLogOut size={18} /> Log Out
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => router.push("/discover")}
                        className="mt-4 flex items-center justify-center gap-2 w-full p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                        <FiLogOut size={18} /> Log Out
                    </button>
                )}
            </motion.div>
        </div>
    );
};

export default withAuth(ProfilePage);
