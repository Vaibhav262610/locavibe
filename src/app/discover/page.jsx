"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { FaStar, FaHeart } from "react-icons/fa";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { IoMdPricetag } from "react-icons/io";
import withAuth from "@/lib/withAuth";
import { FaCamera, FaUtensils, FaShoppingCart , FaClinicMedical  } from "react-icons/fa";
import { FaStreetView } from "react-icons/fa6"
import { MdElectricBolt  } from "react-icons/md"
import Navbar from "@/components/Navbar";


const sections = [
    { name: "All", icon: "🏠", heading: "Where to?", placeholder: "Places to go, things to do, hotels..." },
    { name: "Street Food", icon: <FaStreetView  />, heading: "Find Hotels", placeholder: "Search for hotels..." },
    { name: "Places to Visit", icon: <FaCamera />, heading: "Discover Activities", placeholder: "Find attractions, tours..." },
    { name: "Restaurants", icon: <FaUtensils />, heading: "Explore Restaurants", placeholder: "Search for restaurants..." },
    { name: "Shopping", icon: <FaShoppingCart  />, heading: "Find the best clothes", placeholder: "Search for flights..." },
    { name: "Electronics", icon: <MdElectricBolt  />, heading: "Find Holiday Homes", placeholder: "Search for holiday homes..." },
    { name: "Medical", icon: <FaClinicMedical  />, heading: "Find Holiday Homes", placeholder: "Search for holiday homes..." },
];

const Page = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [user, setUser] = useState()
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState(sections[0]);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };
    // const profileId = "vaibhav"
    // const reviewId = "rajpoot"
    // const saved = {
    //     profileId: user.data._id,
    //     reviewId: reviewId
    // }
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

    // console.log("updated user", user.data._id);

    // useEffect(() => {
    //     async function saveReview() {
    //         try {
    //             const response = await fetch("/api/review/save-review", {
    //                 method: "POST",
    //                 headers: {
    //                     "Authorization": `Bearer ${token}`,
    //                     "Content-Type": "application/json",
    //                 },
    //                 body: JSON.stringify(saved),
    //             });

    //             if (!response.ok) {
    //                 const errorResponse = await response.json();
    //                 console.error("Error submitting review:", errorResponse.message || errorResponse.error);
    //                 return;
    //             }

    //         }
    //         catch {
    //             console.log("error in saving review", error);

    //         }
    //     }
    // })


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
            <div className="w-full flex justify-center items-center px-4 sm:px-6">
                <div className="bg-red-50 w-full md:w-[65%]">
                    <Navbar />
              </div>
            </div>

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
                <div>

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
                    <div className="flex mt-4 flex-nowrap overflow-x-auto justify-start md:justify-center items-center gap-4 w-full max-w-full scrollbar-hide">
                {sections.map((section) => (
                    <button
                        key={section.name}
                        onClick={() => setActiveSection(section)}
                        className={`flex items-center cursor-pointer duration-200 space-x-2 text-sm sm:text-lg font-semibold px-4 py-2 whitespace-nowrap ${activeSection.name === section.name ? "text-[#FFD9C4] border-b-2" : "text-[#D0D0D0]"}`}
                    >
                        <span>{section.icon}</span>
                        <span>{section.name}</span>
                    </button>
                ))}
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
                                            <button className="text-gray-500 hover:text-red-500 cursor-pointer">
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
                            <p className="text-center text-gray-500">Loading...</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default withAuth(Page);
