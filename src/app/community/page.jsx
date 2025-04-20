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
    const [userVotes, setUserVotes] = useState({});

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
            
                        // Sort reviews by likes in descending order
                        const sorted = data.sort((a, b) => b.likes - a.likes);
                        setReviews(sorted);
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
        if (userVotes[reviewId]) return; // already voted on this review
    
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
    
            setUserVotes((prev) => ({ ...prev, [reviewId]: type }));
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
            <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
            <div className="w-full flex justify-center items-center">
                <div className="w-full md:w-[65%]">
                    <Navbar />
                </div>
            </div>  
    
                <div className="flex-1 flex flex-col items-center justify-start px-4 py-10 sm:px-8 md:px-16 lg:px-32">
                    <h1 className="text-5xl font-extrabold text-white text-center mb-10 tracking-tight">People's Reviews</h1>
    
                    {loading ? (
                        <p className="text-gray-400 text-center text-lg">Loading reviews...</p>
                    ) : currentReviews.length > 0 ? (
                        <>
                            <div className="w-full grid gap-8 max-w-5xl">
                                {currentReviews.map((rev) => (
                                    <motion.div
                                        key={rev._id}
                                        className="bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-700 hover:border-gray-500 hover:shadow-xl transition-all duration-300"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <h2 className="text-3xl font-semibold text-[#FFD9C4] mb-4">{rev.title}</h2>
                                        <p className="text-white text-lg mb-6 leading-relaxed">{rev.content}</p>
                                        <div className="flex flex-wrap justify-between items-center text-gray-400 text-sm">
                                            <span className="flex items-center gap-2"><User size={16} /> {rev.username}</span>
                                            <span className="flex items-center gap-2"><Calendar size={16} /> {new Date(rev.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex gap-4 mt-6">
                                        <button
    onClick={() => handleVote(rev._id, "like")}
    disabled={userVotes[rev._id]}
    className={`flex items-center gap-2 px-5 py-2.5 rounded-full shadow-md transition duration-200 
        ${userVotes[rev._id] ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white"}`}
>
    <ThumbsUp size={18} /> {rev.likes}
</button>

<button
    onClick={() => handleVote(rev._id, "dislike")}
    disabled={userVotes[rev._id]}
    className={`flex items-center gap-2 px-5 py-2.5 rounded-full shadow-md transition duration-200 
        ${userVotes[rev._id] ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700 text-white"}`}
>
    <ThumbsDown size={18} /> {rev.dislikes}
</button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
    
                            {/* Pagination */}
                            <div className="flex justify-center items-center gap-6 mt-10 text-white">
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded-full disabled:opacity-40 transition"
                                >
                                    ⬅ Prev
                                </button>
                                <span className="text-gray-300 font-medium">Page {currentPage} of {totalPages}</span>
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded-full disabled:opacity-40 transition"
                                >
                                    Next ➡
                                </button>
                            </div>
                        </> 
                    ) : (
                        <p className="text-gray-400 text-center text-lg">No reviews yet. Be the first to share!</p>
                    )}
                </div>
            </div>
        </>
    );
    
}

export default withAuth(Page);
