"use client"

import withAuth from '@/lib/withAuth';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Page = () => {
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
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

    useEffect(() => {
        if (user) {
            const fetchReviews = async () => {
                try {
                    const response = await fetch("/api/review/get-reviews");
                    if (response.ok) {
                        const data = await response.json();
                        setReviews(data);
                    } else {
                        console.error("Failed to fetch reviews:", response.status);
                    }
                } catch (error) {
                    console.error("Error fetching reviews:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchReviews();
        }
    }, [user]);

    const handleVote = async (reviewId, type) => {
        try {
            const response = await fetch("/api/review/vote", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reviewId, type }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to update vote");
            }

            // Update the state
            setReviews((prevReviews) =>
                prevReviews.map((rev) =>
                    rev._id === reviewId
                        ? { ...rev, likes: data.likes, dislikes: data.dislikes }
                        : rev
                )
            );
        } catch (error) {
            console.error("Error updating vote:", error);
        }
    };


    return (
        <div className='flex justify-center w-full items-center'>
            <div className="relative w-[70rem] mt-40">
                <h1 className="text-3xl text-white">Your Reviews</h1>
                {loading ? (
                    <p className="text-gray-400">Loading reviews...</p>
                ) : reviews.length > 0 ? (
                    <div className="w-full flex flex-col flex-wrap justify-center gap-6 mt-12">
                        {reviews.map((rev) => (
                            <div key={rev._id} className="bg-none shadow-lg flex flex-col gap-6 rounded-lg p-6 border border-white/10">
                                <h2 className="text-4xl font-black text-[#FFD9C4]">{rev.title}</h2>
                                <p className="text-white text-xl">{rev.content}</p>
                                <div className="flex justify-between">
                                    <h2 className="text-md font-thin text-[#33e0a1]">Reviewed by: {rev.username}</h2>
                                    <h2 className="text-md font-thin text-[#33e0a1]">Reviewed on {new Date(rev.createdAt).toLocaleDateString()}</h2>
                                </div>

                                {/* Like & Dislike Buttons */}
                                <div className="flex gap-4 mt-4">
                                    <button onClick={() => handleVote(rev._id, "like")} className="px-4 py-2 bg-green-500 rounded">
                                        👍 {rev.likes}
                                    </button>
                                    <button onClick={() => handleVote(rev._id, "dislike")} className="px-4 py-2 bg-red-500 rounded">
                                        👎 {rev.dislikes}
                                    </button>
                                </div>
                            </div>
                        ))}

                    </div>
                ) : (
                    <p className="text-gray-400">No reviews available.</p>
                )}
            </div>
        </div>
    );
}

export default withAuth(Page);
