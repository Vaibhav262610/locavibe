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
                if (data.success) {
                    setRestaurants(data.data);
                }
            } catch (error) {
                console.error("Error fetching restaurants:", error);
            }
        }
        fetchRestaurants();
    }, []);

    const filteredRestaurants = searchQuery
        ? restaurants.filter((restaurant) =>
            restaurant.description?.toLowerCase()?.includes(searchQuery.toLowerCase())
        )
        : restaurants;

    return (
        <>
            <div className="md:mt-8 px-4 sm:px-6 md:px-1">
                {/* <h1 className="text-center text-white md:text-5xl text-3xl font-black py-8">Discover your Vibe</h1> */}
                {/* Google Map */}
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d54872.0604246069!2d76.7295140993382!3d30.732347721742805!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390fed0be66ec96b%3A0xa5ff67f9527319fe!2sChandigarh!5e0!3m2!1sen!2sin!4v1741619504180!5m2!1sen!2sin"
                    className="w-full h-[300px] sm:h-[400px] md:h-[500px]"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>

                {/* Search & Dropdown */}
                <div className="flex flex-col sm:flex-row gap-4 text-[#FFD9C4] mt-8 w-full items-center justify-center">
                    <div className="relative w-full sm:w-auto">
                        <button
                            onClick={toggleDropdown}
                            className="border border-white rounded-full px-6 py-3 flex items-center justify-center w-full sm:w-auto"
                        >
                            Chandigarh <ChevronDown className="ml-1" size={16} />
                        </button>
                        {isDropdownOpen && (
                            <ul className="absolute left-0 mt-2 w-full sm:w-auto border rounded-md shadow-lg bg-white text-black cursor-pointer duration-200 z-10">
                                <li className="px-4 py-2 hover:bg-gray-100">More Places Coming Soon!</li>
                            </ul>
                        )}
                    </div>

                    <div className="flex items-center w-full md:w-[50%] border border-white pl-4 rounded-full shadow-md py-3">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search your vibe..."
                            className=" w-full outline-none text-[#D0D0D0] text-sm placeholder:text-[#D0D0D0] bg-transparent"
                        />
                    </div>
                </div>

                {/* Restaurant List */}
                <div className="mt-12">
                    <div className="flex flex-col gap-6 mb-12 items-center">
                        {filteredRestaurants.length > 0 ? (
                            filteredRestaurants.map((restaurant) => (
                                <div
                                    key={restaurant._id}
                                    className="w-full  sm:w-4/5 lg:w-3/5 bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row gap-6"
                                >
                                    <div className="w-full md:w-[40%] h-[250px] sm:h-[300px] overflow-hidden rounded-lg">
                                        <img
                                            src={restaurant.imageUrl || "https://via.placeholder.com/150"}
                                            alt="Restaurant Image"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div className="w-full md:w-[60%] flex flex-col gap-3">
                                        <div className="flex w-full justify-between items-start">
                                            <h2 className="text-2xl sm:text-3xl font-bold">{restaurant.name}</h2>
                                            <button className="text-gray-500 hover:text-red-500">
                                                <FaHeart size={24} />
                                            </button>
                                        </div>
                                        <p className="text-blue-500 text-sm sm:text-md">{restaurant.location}</p>
                                        <div className="flex items-center gap-1 text-green-600">
                                            {[...Array(4)].map((_, i) => (
                                                <FaStar key={i} />
                                            ))}
                                            <span className="text-gray-700 ml-2">{restaurant.reviews}</span>
                                        </div>
                                        <p className="text-gray-700 text-sm sm:text-md">
                                            {restaurant.description}...
                                            <span className="text-blue-500 cursor-pointer">Read more</span>
                                        </p>
                                        <div className="flex flex-wrap gap-2 text-xs sm:text-sm mt-2">
                                            <span className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                                                <MdOutlineRestaurantMenu size={16} />
                                                {restaurant.category}
                                            </span>
                                            <span className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                                                <IoMdPricetag size={16} /> ₹{restaurant.priceRange}
                                            </span>
                                        </div>

                                        <div className="mt-4">
                                            <h3 className="text-lg sm:text-xl font-semibold">Opening Hours</h3>
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
        </>
    );
};

export default Page;
