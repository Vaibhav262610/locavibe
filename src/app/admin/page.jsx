"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Page = () => {
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        location: "",
        imageUrl: "",
        rating: "",
        reviews: "",
        description: "",
        categories: "",
        priceRange: "",
        openingHours: "",
    });

    const adminEmailId = "vaibhav@gmail.com";
    const adminUserName = "vaibhav";

    useEffect(() => {
        const checkAdmin = async () => {
            const token = localStorage.getItem("token") || localStorage.getItem("authToken");
            if (!token) return router.push("/login");

            try {
                const response = await fetch("/api/users/profile", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) throw new Error("Invalid or expired token");

                const data = await response.json();
                if (
                    data?.data?.username === adminUserName &&
                    data?.data?.email === adminEmailId
                ) {
                    setIsAdmin(true);
                } else {
                    router.push("/login");
                }
            } catch (error) {
                console.error("Error verifying admin:", error);
                router.push("/login");
            } finally {
                setIsLoading(false);
            }
        };

        checkAdmin();
    }, [router]);

    if (isLoading) {
        return (
            <div className="h-screen w-full flex justify-center items-center bg-gray-900">
                <h1 className="text-sm text-teal-400 animate-pulse text-center">
                    Checking Admin Credentials...
                </h1>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="h-screen w-full flex justify-center items-center bg-gray-900">
                <h1 className="text-3xl text-red-500">Access Denied</h1>
            </div>
        );
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        toast.info("Uploading restaurant...");

        try {
            const response = await fetch("/api/restaurant", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    rating: Number(formData.rating),
                    reviews: Number(formData.reviews),
                    categories: formData.categories.split(",").map((c) => c.trim()),
                }),
            });

            const data = await response.json();
            if (response.ok) {
                toast.success("Restaurant added successfully! 🎉");
                setFormData({
                    name: "",
                    location: "",
                    imageUrl: "",
                    rating: "",
                    reviews: "",
                    description: "",
                    categories: "",
                    priceRange: "",
                    openingHours: "",
                });
            } else {
                toast.error(`Upload failed: ${data.error || "Unknown error"}`);
            }
        } catch (error) {
            toast.error("Error submitting form. Try again!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-gray-900 py-10 px-6 sm:px-20 text-white">
            <h2 className="text-3xl font-bold text-teal-400 text-center mb-10">
                📍 Add a Restaurant
            </h2>

            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto"
            >
                {[{
                    name: "name", placeholder: "Restaurant Name", emoji: "🏠"
                }, {
                    name: "location", placeholder: "Location", emoji: "📍"
                }, {
                    name: "imageUrl", placeholder: "Image URL", emoji: "🖼️"
                }, {
                    name: "rating", placeholder: "Rating (1-5)", emoji: "⭐", type: "number"
                }, {
                    name: "reviews", placeholder: "Number of Reviews", emoji: "📝", type: "number"
                }, {
                    name: "categories", placeholder: "Categories (comma separated)", emoji: "📂"
                }, {
                    name: "priceRange", placeholder: "Price Range", emoji: "💰"
                }, {
                    name: "openingHours", placeholder: "Opening Hours", emoji: "⏰"
                }].map((field) => (
                    <div key={field.name}>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            {field.emoji} {field.placeholder}
                        </label>
                        <input
                            type={field.type || "text"}
                            name={field.name}
                            placeholder={field.placeholder}
                            className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-teal-400 focus:ring-2 focus:ring-teal-500 outline-none transition text-sm"
                            onChange={handleChange}
                            value={formData[field.name]}
                            required
                        />
                    </div>
                ))}

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                        📝 Description
                    </label>
                    <textarea
                        name="description"
                        placeholder="Description"
                        className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-teal-400 focus:ring-2 focus:ring-teal-500 outline-none transition text-sm"
                        onChange={handleChange}
                        value={formData.description}
                        required
                        rows={4}
                    />
                </div>

                <div className="md:col-span-2 flex justify-center mt-6">
                    <button
                        type="submit"
                        className={`w-full max-w-md py-3 rounded-lg text-white font-semibold flex justify-center items-center transition-all ${loading
                            ? "bg-gray-500 cursor-not-allowed"
                            : "bg-teal-500 hover:bg-teal-600 transform hover:scale-105"
                            }`}
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4l4-4-4-4v4a12 12 0 00-12 12h4z"
                                    ></path>
                                </svg>
                                Uploading...
                            </div>
                        ) : (
                            "🚀 Submit"
                        )}
                    </button>
                </div>
            </form>

            <ToastContainer />
        </div>
    );
};

export default Page;
