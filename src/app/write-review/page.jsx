"use client";
// import UploadImage from "@/components/UploadImage";
import withAuth from "@/lib/withAuth";
// import { CldImage } from "next-cloudinary";
// import axios from "axios";3wertwt
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const allowedCategories = ["Business", "Couples", "Family", "Friends", "Solo", "My Arrival", "My Experience"];
const groupOptions = ["Business", "Couples", "Family", "Friends", "Solo"];

const ReviewUI = () => {
    const [userInput, setUserInput] = useState("");
    const [filteredOptions, setFilteredOptions] = useState([]);
    // const [review, setReview] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [reviewText, setReviewText] = useState("");
    const [titleText, setTitleText] = useState("");
    const [rating, setRating] = useState(0);
    const [selectedOption, setSelectedOption] = useState("");
    const [loading, setLoading] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);
    const [user, setUser] = useState(null);

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
    }, []); // Empty dependency array ensures this runs once




    const handleInputChange = (e) => {
        const value = e.target.value;
        setUserInput(value);

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

    const handleReviewChange = (e) => {
        const words = e.target.value.split(/\s+/).filter((word) => word.length > 0);
        if (words.length <= 100) {
            setReviewText(e.target.value);
        }
    };

    const handleTitleChange = (e) => {
        const words = e.target.value.split(/\s+/).filter((word) => word.length > 0);
        if (words.length <= 120) {
            setTitleText(e.target.value);
        }
    };

    const handleStarClick = (index) => {
        setRating(index + 1);
    };

    const handleSelectChange = (e) => {
        setSelectedOption(e.target.value);  // Update state on option change
    };
    const handleSubmit = async () => {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        if (!token) {
            toast.error('Authentication token not found!');
            setLoading(false);
            return;
        }
        console.log(user.data);


        const reviewData = {
            profileId: user.data._id,
            username: user.data.username,
            title: titleText,
            content: reviewText,
            category: selectedCategory,
            when: selectedOption,
            who: selectedGroup,
            rating: rating
        };
        try {
            const response = await fetch("/api/review/reviews", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(reviewData),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                console.error("Error submitting review:", errorResponse.message || errorResponse.error);
                return;
            }

            const data = await response.json();
            toast.success("Review submitted successfully!");
            console.log("Review submitted successfully:", data);
        } catch (error) {
            toast.error("Error submitting review. Please try again.");
            console.error("Error in handleSubmit:", error.message || error);
        }
        setUserInput("")
        setFilteredOptions([])
        setSelectedCategory("")
        setSelectedGroup(null)
        setReviewText("")
        setTitleText("")
        setRating(0)
        setSelectedOption("")
        setLoading(false);
    };
    const [file, setFile] = useState(null);
    const [imageUrl, setImageUrl] = useState("");

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return toast.error("Please select an image!");
        setImageLoading(true); // Start loading

        const formData = new FormData();

        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (data.Url) {
                setImageUrl(data.Url);
            } else {
                toast.error("Upload failed!");
            }
            console.log(data);
        } catch (error) {
            toast.error("Upload error:", error);
        } finally {
            toast.success("Image Upload Successfully!")
            setImageLoading(false); // Stop loading
        }
    };

    return (
        <div className="flex h-screen  justify-center flex-col  items-center p-8 min-h-screen">
            {!selectedCategory ? (
                <>
                    <h1 className="text-5xl text-[#FFD9C4] font-bold text-center">
                        Write a review, make someone's trip
                    </h1>
                    <p className="text-gray-400 text-center text-xl w-[35rem] mt-2">
                        Stories like yours help travelers have better trips.
                        Share your experience and help out a fellow traveler!
                    </p>

                    <div className="relative w-[40rem] mt-16">
                        <input
                            type="text"
                            value={userInput}
                            onChange={handleInputChange}
                            placeholder="What would you like to review?"
                            className="w-full px-8 outline-none py-3 border border-[#FFD9C4] rounded-xl text-gray-300"
                        />

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

                </>
            ) : (
                <div className="flex gap-16 justify-center mt-32 ">
                    <div className="text-[#FFD9C4] ">
                        <h2 className="text-4xl font-semibold text-center mb-6">
                            How was your experience ({selectedCategory})?
                        </h2>
                    </div>
                    <div className="w-full max-w-3xl text-[#FFD9C4]  rounded-lg shadow-md">


                        {/* Star Rating */}
                        {/* <div className="flex  items-center gap-20"> */}
                        <label className="block  text-gray-300 font-medium mb-2">Rate your experience:</label>
                        <div className="flex  space-x-2 mb-4">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <span
                                    key={index}
                                    onClick={() => handleStarClick(index)}
                                    className={`text-5xl cursor-pointer ${index < rating ? "text-yellow-500" : "text-gray-200"
                                        }`}
                                >
                                    ★
                                </span>
                            ))}
                        </div>

                        {/* Date Selection */}
                        <label className="block mt-8 text-gray-300 font-medium">When did you go?</label>
                        <select value={selectedOption}
                            onChange={handleSelectChange} className="w-full mt-2 p-2 border text-white bg-[#121b22] border-gray-300 rounded-lg">
                            <option>Select one</option>
                            <option>Last week</option>
                            <option>Last month</option>
                            <option>Last year</option>
                        </select>

                        {/* Group Selection (Only One Selectable) */}
                        <label className="block  mt-8 text-gray-300 font-medium ">Who did you go with?</label>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {groupOptions.map((group) => (
                                <button
                                    key={group}
                                    onClick={() => setSelectedGroup(group)}
                                    className={`px-4 py-2 border rounded-lg ${selectedGroup === group ? "bg-gray-800 text-white" : "border-gray-300"
                                        }`}
                                >
                                    {group}
                                </button>
                            ))}
                        </div>

                        {/* Review Text Area */}
                        <label className="block mt-8 text-gray-300 font-medium ">Write your review (1-100 words)</label>
                        <textarea
                            placeholder="Write your review..."
                            value={reviewText}
                            onChange={handleReviewChange}
                            className="w-full mt-2 p-3 border border-gray-300 rounded-lg text-gray-400"
                        />
                        <p className="text-right text-gray-500 text-sm">
                            {reviewText.split(/\s+/).filter((word) => word.length > 0).length}/100 words
                        </p>

                        {/* Title Input */}
                        <label className="block mt-8 text-gray-300 font-medium">Title your review (0-120 words)</label>
                        <input
                            type="text"
                            placeholder="Title your review"
                            value={titleText}
                            onChange={handleTitleChange}
                            className="w-full mt-2 p-3 border border-gray-300 rounded-lg text-gray-400"
                        />
                        <p className="text-right text-gray-500 text-sm">
                            {titleText.split(/\s+/).filter((word) => word.length > 0).length}/120 words
                        </p>

                        {/* Photo Upload */}
                        <label className="block mt-8 text-gray-300 font-medium ">Add some photos (optional)</label>
                        <div>
                            <input type="file" onChange={handleFileChange} />

                            <button onClick={handleUpload}>{imageLoading ? "Uploading..." : "Upload"}</button>
                            {imageUrl && <img src={imageUrl} alt="Uploaded" width="200" />}
                        </div>

                        {/* Checkbox Agreement */}
                        <div className="flex items-center mt-8">
                            <input type="checkbox" id="agreement" className="mr-2" />
                            <label htmlFor="agreement" className="text-gray-200 text-sm">
                                I certify that this review is based on my own experience and is my genuine opinion.
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button onClick={handleSubmit} className="w-full mt-8 cursor-pointer bg-[#33e0a1] text-white py-3 rounded-lg font-semibold hover:bg-gray-800" disabled={loading}>
                            {loading ? "Processing..." : "Continue"}
                        </button>
                    </div>
                </div>
            )
            }
            <ToastContainer />
        </div >
    );
};

export default withAuth(ReviewUI);
