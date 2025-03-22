"use client";

import Link from "next/link";
import React, { useState } from "react";
import { FaHotel, FaCamera, FaUtensils, FaPlane, FaHome } from "react-icons/fa";

const sections = [
    { name: "Search All", icon: "🏠", heading: "Where to?", placeholder: "Places to go, things to do, hotels..." },
    { name: "Hotels", icon: <FaHotel />, heading: "Find Hotels", placeholder: "Search for hotels..." },
    { name: "Things to Do", icon: <FaCamera />, heading: "Discover Activities", placeholder: "Find attractions, tours..." },
    { name: "Restaurants", icon: <FaUtensils />, heading: "Explore Restaurants", placeholder: "Search for restaurants..." },
    { name: "Shopping", icon: <FaPlane />, heading: "Find the best clothes", placeholder: "Search for flights..." },
    { name: "Holiday Homes", icon: <FaHome />, heading: "Find Holiday Homes", placeholder: "Search for holiday homes..." },
];

const Page = () => {
    const [activeSection, setActiveSection] = useState(sections[0]);

    return (
        <div className="flex flex-col justify-center items-center w-full px-6 md:mt-12 mt-28 lg:px-12 py-8">
            {/* Title */}
            <h1 className="font-black text-[#D0D0D0] mb-8 text-3xl sm:text-4xl lg:text-5xl text-center">
                {activeSection.heading}
            </h1>

            {/* Navigation Buttons (Horizontal Scroll on Mobile) */}
            <div className="flex flex-nowrap overflow-x-scroll justify-center items-center gap-4 w-full max-w-full pb-3 scrollbar-hide">
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



            {/* Search Bar */}
            <Link href="/discover">
                <div className="flex mt-6 items-center w-full max-w-full border border-white rounded-full shadow-md px-4 py-1">
                    <input
                        type="text"
                        placeholder={activeSection.placeholder}
                        className="flex-grow outline-none text-[#D0D0D0] md:w-[60rem] text-sm sm:text-lg placeholder:text-[#D0D0D0] bg-transparent p-2 md:p-3"
                    />
                    <button className="bg-green-400 cursor-pointer text-black font-semibold px-6 py-3 rounded-br-full rounded-tr-full rounded-bl-xl rounded-tl-xl">
                        Search
                    </button>
                </div>
            </Link>

            {/* Travel Inspiration Section without Image on Mobile */}
            <div className="mt-12 w-full flex flex-col lg:flex-row bg-[#33e0a1] py-8 rounded-lg items-center justify-around  lg:text-left">
                {/* Content Section */}
                <div className="hidden lg:block">
                    <img
                        src="/image.png"
                        alt="Travel Inspiration"
                        className=" rounded-md w-md"
                    />
                </div>
                <div className="p-4 flex flex-col items-center lg:items-start  w-fit">
                    <h1 className="text-xs text-black/50 mb-2">Made by Vaibhav Rajpoot 💖</h1>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-3 max-w-lg">
                        Find Your Vibe, Explore Your City
                    </h2>
                    <p className="text-md sm:text-lg max-w-lg text-black/70 mt-2 mb-4">
                        New in town? No worries! LocaVibe helps you uncover the best local spots—from cozy cafés to budget-friendly shopping and hidden gems around campus.
                    </p>
                    <button className="text-white rounded-lg w-fit text-lg py-2 cursor-pointer bg-black font-semibold duration-200 px-6">
                        Find your Vibe.
                    </button>
                </div>

                {/* Hidden Image for Mobile */}

            </div>
        </div>
    );
};

export default Page;
