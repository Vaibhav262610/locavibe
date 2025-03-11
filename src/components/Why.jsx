import React from "react";

const Why = () => {
    return (
        <div className="min-h-screen w-full flex flex-col justify-center items-center text-white px-6">
            <h1 className="text-5xl font-bold mb-4">WHY LOCAVIBE?</h1>
            <p className="text-lg text-center max-w-3xl mb-8">
                Locavibe helps newcomers discover the best local shops in their area by providing trusted reviews and community recommendations.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
                <div className="p-6 bg-black/50 bg-opacity-10 rounded-2xl shadow-lg text-center">
                    <h2 className="text-xl font-semibold mb-2">🌟 Trusted Reviews</h2>
                    <p className="text-sm">Find the best local shops based on genuine customer feedback and ratings.</p>
                </div>
                <div className="p-6 bg-black/50 bg-opacity-10 rounded-2xl shadow-lg text-center">
                    <h2 className="text-xl font-semibold mb-2">📍 Discover Hidden Gems</h2>
                    <p className="text-sm">Explore top-rated shops in your area that you might not have known about.</p>
                </div>
                <div className="p-6 bg-black/50 bg-opacity-10 rounded-2xl shadow-lg text-center">
                    <h2 className="text-xl font-semibold mb-2">💬 Community Recommendations</h2>
                    <p className="text-sm">Get shop suggestions from real people who know the best places around.</p>
                </div>
            </div>
        </div>
    );
};

export default Why;