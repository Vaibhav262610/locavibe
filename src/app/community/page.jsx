"use client"

import withAuth from '@/lib/withAuth';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown, User, Calendar } from 'lucide-react';
import Navbar from '@/components/Navbar';

const Page = () => {
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [user, setUser] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 5;

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
            if (!response.ok) throw new Error(data.message || "Failed to update vote");

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

    // Pagination logic
    const totalPages = Math.ceil(reviews.length / reviewsPerPage);
    const startIndex = (currentPage - 1) * reviewsPerPage;
    const currentReviews = reviews.slice(startIndex, startIndex + reviewsPerPage);

    return (
        <>
            <div className="w-full flex justify-center items-center">
                <div className="w-full md:w-[65%]">
                    <Navbar />
                </div>
            </div>

            <div className='flex justify-center w-full items-center min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 px-6'>
                <div className="relative w-full max-w-3xl mt-8">
                    <h1 className="text-4xl font-bold text-white text-center mb-6">People's Reviews</h1>
                    {loading ? (
                        <p className="text-gray-400 text-center">Loading reviews...</p>
                    ) : currentReviews.length > 0 ? (
                        <>
                            <div className="flex flex-col gap-6 mt-6">
                                {currentReviews.map((rev) => (
                                    <motion.div
                                        key={rev._id}
                                        className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 transition hover:scale-105 hover:border-gray-500"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <h2 className="text-2xl font-semibold text-[#FFD9C4] mb-4">{rev.title}</h2>
                                        <p className="text-white text-lg mb-4">{rev.content}</p>
                                        <div className="flex justify-between items-center text-gray-400 text-sm">
                                            <span className="flex items-center gap-2"><User size={16} /> {rev.username}</span>
                                            <span className="flex items-center gap-2"><Calendar size={16} /> {new Date(rev.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex gap-4 mt-6">
                                            <button
                                                onClick={() => handleVote(rev._id, "like")}
                                                className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition"
                                            >
                                                <ThumbsUp size={18} /> {rev.likes}
                                            </button>
                                            <button
                                                onClick={() => handleVote(rev._id, "dislike")}
                                                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition"
                                            >
                                                <ThumbsDown size={18} /> {rev.dislikes}
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Pagination Buttons */}
                            <div className="flex justify-between items-center mt-8 text-white">
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50"
                                >
                                    ⬅ Prev
                                </button>
                                <span className="text-gray-300">Page {currentPage} of {totalPages}</span>
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50"
                                >
                                    Next ➡
                                </button>
                            </div>
                        </>
                    ) : (
                        <p className="text-gray-400 text-center">Loading...</p>
                    )}
                </div>
            </div>
        </>
    );
}

export default withAuth(Page);
