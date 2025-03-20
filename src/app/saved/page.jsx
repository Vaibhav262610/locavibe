"use client"

import React, { useEffect, useState } from 'react'

const page = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

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
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
                <img
                    // animate={{ rotate: 360 }}
                    // transition={{ repeat: Infinity, duration: 2 }}
                    className="w-24 h-24"
                    src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMng0bjlnb3Z1Zmo1N3kxcmoyemw0M3MwNGs3amszemdjbjJtM2FydyZlcD12MV9pbnRlcm5fYnlfaWQmY3Q9cw/6KKKVerzrhjRrClNKt/giphy.gif"
                    alt="Loading..."
                />
                <p className="ml-4 text-2xl font-light">Loading...</p>
            </div>
        );
    }
    return (
        <div className='h-screen  w-full flex justify-center items-center'>{user.data.username}</div>
    )
}

export default page