"use client";

import withAuth from "@/lib/withAuth";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const page = () => {
    const [loading, setLoading] = useState(true);
    const [review, setReview] = useState([]);
    const [user, setUser] = useState(null);
    const router = useRouter(); // Added useRouter for redirection

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
                setUser(data); // Set the user data from the response
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []); // Empty dependency array ensures this runs once

    useEffect(() => {
        if (user) {
            const fetchEvents = async () => {
                try {
                    const response = await fetch("/api/review/get-reviews");
                    if (response.ok) {
                        const data = await response.json();
                        console.log("Fetched Reviews:", data); // Log the data

                        // Filter reviews to only show those where username matches user.data.username
                        const userReviews = data.filter((rev) => rev.username === user.data?.username);
                        setReview(userReviews);
                    } else {
                        console.error("Failed to fetch events:", response.status);
                    }
                } catch (error) {
                    console.error("Error fetching events:", error);
                } finally {
                    setLoading(false); // Stop loading after fetch
                }
            };
            fetchEvents();
        }
    }, [user]); // Re-fetch reviews when user changes

    return (
        <>
            <div className="flex justify-center w-full items-center px-4 sm:px-8">
                <div className="relative w-full max-w-screen-xl mt-32">
                    <h1 className="text-3xl text-white ">Your Reviews</h1>
                    {loading ? (
                        <p className="text-gray-400 ">Loading reviews...</p> // Show loading text
                    ) : review.length > 0 ? (
                        <div className="w-full flex flex-col gap-6 mt-12">
                            {review.map((rev) => (
                                <div
                                    key={rev._id}
                                    className="bg-none shadow-lg flex-wrap flex flex-col gap-6 rounded-lg p-6 border border-white/10"
                                >
                                    <h2 className="text-2xl sm:text-4xl font-black text-[#FFD9C4]">{rev.title}</h2>
                                    <p className="text-white text-lg sm:text-xl">
                                        {rev.content} I went on a {rev.category.toLowerCase()} trip with{" "}
                                        {rev.who.toLowerCase()} {rev.when.toLowerCase()}. I would rate this
                                        experience {rev.rating} out of 5.
                                    </p>
                                    <div className="flex justify-between flex-wrap">
                                        <h2 className="text-md font-thin text-[#33e0a1]">Reviewed by: {rev.username}</h2>
                                        <h2 className="text-md font-thin text-[#33e0a1]">
                                            Reviewed on {new Date(rev.createdAt).toLocaleDateString()}
                                        </h2>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 ">No reviews available.</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default withAuth(page);
