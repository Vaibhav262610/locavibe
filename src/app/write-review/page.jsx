import React from "react";

const ReviewUI = () => {
    return (
        <div className="flex flex-col items-center p-8 bg-gray-100 min-h-screen">
            {/* Heading */}
            <h1 className="text-3xl font-bold text-center">
                Write a review, make someone's trip
            </h1>
            <p className="text-gray-600 text-center mt-2">
                Stories like yours are what help travellers have better trips.
                Share your experience and help out a fellow traveller!
            </p>

            {/* Search Bar */}
            <div className="relative mt-6 w-full max-w-lg">
                <input
                    type="text"
                    placeholder="What would you like to review?"
                    className="w-full p-3 pl-10 border border-gray-300 rounded-full shadow-sm focus:outline-none"
                />
                <span className="absolute left-3 top-3 text-gray-400">🔍</span>
            </div>

            {/* Cards */}
            <div className="mt-8 flex gap-6">
                <div className="w-40 h-56 bg-white p-4 rounded-lg shadow-md flex items-center justify-center">
                    <span>📊</span>
                </div>
                <div className="w-40 h-56 bg-white p-4 rounded-lg shadow-md flex items-center justify-center">
                    <span>🏨</span>
                </div>
                <div className="w-40 h-56 bg-white p-4 rounded-lg shadow-md flex items-center justify-center">
                    <span>💬</span>
                </div>
            </div>
        </div>
    );
};

export default ReviewUI;
