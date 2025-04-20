"use client";

import withAuth from "@/lib/withAuth";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

const page = () => {
    const [loading, setLoading] = useState(true);
    const [review, setReview] = useState([]);
    const [user, setUser] = useState(null);
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

                if (!response.ok) throw new Error("Invalid or expired token");

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

    useEffect(() => {
        if (user) {
            const fetchEvents = async () => {
                try {
                    const response = await fetch("/api/review/get-reviews");
                    if (response.ok) {
                        const data = await response.json();
                        const userReviews = data.filter(
                            (rev) => rev.username === user.data?.username
                        );
                        setReview(userReviews);
                    } else {
                        console.error("Failed to fetch events:", response.status);
                    }
                } catch (error) {
                    console.error("Error fetching events:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchEvents();
        }
    }, [user]);

    return (
        <>
           <div className="w-full flex justify-center items-center">
                <div className="w-full md:w-[65%]">
                    <Navbar />
                </div>
            </div>

            <div className="flex justify-center w-full items-center px-4 sm:px-8">
                <div className="relative w-full max-w-screen-xl mt-5 md:mt-32">
                    <h1 className="text-4xl font-bold text-white mb-6 border-b border-white/10 pb-2">
                        Your Reviews
                    </h1>

                    {loading ? (
                        <p className="text-gray-400 animate-pulse">Loading reviews...</p>
                    ) : review.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                            {review.map((rev) => (
                                <div
                                    key={rev._id}
                                    className="bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-md transition-all duration-300"
                                >
                                    <h2 className="text-2xl font-semibold text-[#FFD9C4] mb-3">
                                        {rev.title}
                                    </h2>
                                    <p className="text-white mb-4">
                                        {rev.content} I went on a{" "}
                                        <span className="italic text-[#B5F4E8]">{rev.category.toLowerCase()}</span> trip with{" "}
                                        <span className="italic text-[#B5F4E8]">{rev.who.toLowerCase()}</span>{" "}
                                        <span className="italic text-[#B5F4E8]">{rev.when.toLowerCase()}</span>. I would rate this
                                        experience <strong>{rev.rating}/5</strong>.
                                    </p>
                                    <div className="flex justify-between text-sm text-[#B0FFE4] font-light">
                                        <p>Reviewed by: {rev.username}</p>
                                        <p>{new Date(rev.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 mt-4">You haven’t written any reviews yet.</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default withAuth(page);
