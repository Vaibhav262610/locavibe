"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { FaStar, FaHeart } from "react-icons/fa";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { IoMdPricetag } from "react-icons/io";

const Page = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    useEffect(() => {
        async function fetchRestaurants() {
            try {
                const response = await fetch("/api/restaurant");
                const data = await response.json();
                console.log("API Response:", data); // Debugging log
                if (data.success) {
                    setRestaurants(data.data);
                }
            } catch (error) {
                console.error("Error fetching restaurants:", error);
            }
        }
        fetchRestaurants();
    }, []);

    // ✅ Ensure this is defined after useState and useEffect
    const filteredRestaurants = searchQuery
        ? restaurants.filter((restaurant) =>
            restaurant.description?.toLowerCase()?.includes(searchQuery.toLowerCase())
        )
        : restaurants;

    console.log("Filtered Restaurants:", filteredRestaurants); // Debugging log

    return (
        <>
            <div className="mt-32">
                {/* Google Map */}
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d54872.0604246069!2d76.7295140993382!3d30.732347721742805!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390fed0be66ec96b%3A0xa5ff67f9527319fe!2sChandigarh!5e0!3m2!1sen!2sin!4v1741619504180!5m2!1sen!2sin"
                    width="600"
                    height="500"
                    style={{ border: 0 }}
                    className="w-full"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>

                {/* Search & Dropdown */}
                <div className="flex gap-6 text-[#FFD9C4] mt-12 w-full justify-center items-center">
                    <div className="relative cursor-pointer duration-200">
                        <button
                            onClick={toggleDropdown}
                            className="border border-white rounded-full px-14 py-3 flex cursor-pointer duration-200 items-center"
                        >
                            Chandigarh <ChevronDown className="ml-1" size={16} />
                        </button>
                        {isDropdownOpen && (
                            <ul className="absolute left-0 mt-2 w-full border rounded-md shadow-lg bg-white text-black cursor-pointer duration-200 z-10">
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                    More Places Coming Soon!
                                </li>
                            </ul>
                        )}
                    </div>

                    <div className="flex items-center justify-center border border-white pl-8 rounded-full shadow-md px-4 py-3">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search your vibe..."
                            className="w-[60rem] outline-none text-[#D0D0D0] text-lg placeholder:text-[#D0D0D0]"
                        />
                    </div>
                </div>

                {/* Restaurant List */}
                <div className="mt-20">
                    <div className="flex justify-center">
                        <div className="flex flex-col gap-6">
                            {/* ✅ If no restaurants are found, show a message */}
                            {filteredRestaurants.length > 0 ? (
                                filteredRestaurants.map((restaurant) => (
                                    <div
                                        key={restaurant._id}
                                        className="w-5xl mx-auto bg-white rounded-lg shadow-md p-4 flex gap-6"
                                    >
                                        <div className="w-[20rem] h-[20rem] overflow-hidden">
                                            <img
                                                src={restaurant.imageUrl || "https://via.placeholder.com/150"}
                                                alt="Restaurant Image"
                                                className="rounded-lg w-full h-full object-cover"
                                            />
                                        </div>

                                        <div className="w-1/2 flex flex-col gap-3">
                                            <div className="flex w-full justify-between items-start">
                                                <h2 className="text-4xl font-bold">{restaurant.name}</h2>
                                                <button className="text-gray-500 hover:text-red-500">
                                                    <FaHeart size={30} />
                                                </button>
                                            </div>
                                            <p className="text-blue-500 text-md">{restaurant.location}</p>
                                            <div className="flex items-center gap-1 text-green-600">
                                                {[...Array(4)].map((_, i) => (
                                                    <FaStar key={i} />
                                                ))}
                                                <span className="text-gray-700 ml-2">{restaurant.reviews}</span>
                                            </div>
                                            <p className="text-gray-700 text-lg">
                                                {restaurant.description}...
                                                <span className="text-blue-500 cursor-pointer">Read more</span>
                                            </p>
                                            <div className="flex flex-wrap gap-2 text-sm mt-2">
                                                <span className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                                                    <MdOutlineRestaurantMenu size={20} />
                                                    {restaurant.category}
                                                </span>
                                                <span className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                                                    <IoMdPricetag size={20} /> ₹{restaurant.priceRange}
                                                </span>
                                            </div>

                                            <div className="mt-4">
                                                <h3 className="text-xl font-semibold">Opening Hours</h3>
                                                <p className="text-gray-700">{restaurant.openingHours}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500">No restaurants found.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Page;
