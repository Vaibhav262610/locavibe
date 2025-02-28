"use client"
import React, { useState } from "react";

const allowedCategories = ["Business", "Couples", "Family", "Friends", "Solo", "My Arrival", "My Experience"];

const ReviewUI = () => {
    const [userInput, setUserInput] = useState("");
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");

    const handleInputChange = (e) => {
        const value = e.target.value;
        setUserInput(value);

        // Filter options based on input
        if (value) {
            const matches = allowedCategories.filter((cat) =>
                cat.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredOptions(matches);
        } else {
            setFilteredOptions([]);
        }
    };

    const handleSelectCategory = (category) => {
        setSelectedCategory(category);
        setUserInput("");
        setFilteredOptions([]);
    };

    return (
        <div className="flex flex-col mt-32 items-center p-8 text-white min-h-screen">
            {/* If no category is selected, show input field */}
            {!selectedCategory ? (
                <>
                    <h1 className="text-5xl font-bold">Write a review, make someone's trip</h1>
                    <p className="text-gray-400 text-xl w-[35rem] text-center mt-4">Stories like yours are what helps travellers have better trips. Share your experience and help out a fellow traveller!</p>
                    <div className="relative w-[40rem] mt-16">
                        <input
                            type="text"
                            value={userInput}
                            onChange={handleInputChange}
                            placeholder="What would you like to review ?"
                            className="mt-4 w-full px-8 outline-none  py-3 border border-gray-400 rounded-xl text-gray-300"
                        />



                        {/* Dropdown for suggestions */}
                        {filteredOptions.length > 0 && (
                            <ul className="absolute w-full bg-white border border-gray-300 mt-1 rounded-lg shadow-md text-black">
                                {filteredOptions.map((option) => (
                                    <li
                                        key={option}
                                        onClick={() => handleSelectCategory(option)}
                                        className="p-2 cursor-pointer hover:bg-gray-200"
                                    >
                                        {option}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="w-[60%] mt-40">
                        <h1 className="text-2xl font-bold">Your reviews.</h1>
                        <h1 className="text-md mt-8 text-gray-400">You have no reviews yet. After you write some reviews, they will appear here.</h1>
                    </div>
                </>
            ) : (
                /* If category is selected, show review UI */
                <div className="mt-12 w-full max-w-2xl">
                    <h2 className="text-3xl font-semibold text-center mb-4">
                        How was your experience ({selectedCategory})?
                    </h2>

                    {/* Star Rating */}
                    <div className="flex justify-center space-x-2">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <span key={index} className="text-green-500 text-2xl">⭐</span>
                        ))}
                    </div>

                    {/* Review Text Area */}
                    <textarea
                        placeholder="Write your review..."
                        className="w-full mt-4 p-3 border border-gray-300 rounded-lg text-black"
                    />

                    {/* Title Input */}
                    <input
                        type="text"
                        placeholder="Title your review"
                        className="w-full mt-4 p-3 border border-gray-300 rounded-lg text-black"
                    />
                </div>
            )
            }
        </div >
    );
};

export default ReviewUI;
