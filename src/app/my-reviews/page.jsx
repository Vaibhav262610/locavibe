"use client"

import React, { useEffect, useState } from 'react'

const page = () => {

    const [loading, setLoading] = useState(false);
    const [review, setReview] = useState([]);
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch("/api/review/get-reviews");
                if (response.ok) {
                    const data = await response.json();
                    console.log("Fetched Reviews:", data);  // Log the data
                    setReview(data);
                } else {
                    console.error("Failed to fetch events:", response.status);
                }
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);  // Update: stop loading after fetch
            }
        };
        fetchEvents();
    }, []);
    return (
        <>
            <div className='flex justify-center w-full items-center'>
                <div className="relative w-[70rem] mt-40">
                    <h1 className="text-4xl font-black text-white">Your Reviews</h1>
                    {loading ? (
                        <p className="text-gray-400">Loading reviews...</p>  // Show loading text
                    ) : review.length > 0 ? (
                        <div className="w-full flex flex-col flex-wrap justify-center gap-6 mt-12">
                            {review.map((rev) => (
                                <div key={rev._id} className="bg-none shadow-lg flex-wrap flex flex-col rounded-lg p-6  border border-white/10">
                                    <h2 className="text-2xl font-thin text-blue-700">{rev.title}</h2>
                                    <h2 className="text-2xl font-thin text-blue-700">{rev.content}</h2>
                                    <h2 className="text-2xl font-thin text-blue-700">{rev.when}</h2>
                                    <h2 className="text-2xl font-thin text-blue-700">{rev.who}</h2>
                                    <h2 className="text-2xl font-thin text-blue-700">{rev.category}</h2>
                                    <h2 className="text-2xl font-thin text-blue-700">{rev.rating}</h2>
                                    <h2 className="text-2xl font-thin text-blue-700">{rev.createdAt}</h2>
                                    <h2 className="text-2xl font-thin text-blue-700">{rev._id}</h2>
                                    {/* <p className="text-gray-300 ">{rev.content}</p> */}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400">No reviews available.</p>
                    )}

                </div>
            </div>
        </>
    )
}

export default page