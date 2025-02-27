"use client"

import React, { useState } from "react";
import { FaHotel, FaCamera, FaUtensils, FaPlane, FaHome } from "react-icons/fa";

const sections = [
    { name: "Search All", icon: "🏠", heading: "Where to?", placeholder: "Places to go, things to do, hotels..." },
    { name: "Hotels", icon: <FaHotel />, heading: "Find Hotels", placeholder: "Search for hotels..." },
    { name: "Things to Do", icon: <FaCamera />, heading: "Discover Activities", placeholder: "Find attractions, tours..." },
    { name: "Restaurants", icon: <FaUtensils />, heading: "Explore Restaurants", placeholder: "Search for restaurants..." },
    { name: "Flights", icon: <FaPlane />, heading: "Book Flights", placeholder: "Search for flights..." },
    { name: "Holiday Homes", icon: <FaHome />, heading: "Find Holiday Homes", placeholder: "Search for holiday homes..." },
];

const page = () => {
    const [activeSection, setActiveSection] = useState(sections[0]);

    return (
        <div className="flex flex-col items-center mt-12 w-full">
            <h1 className="font-black text-[#D0D0D0] text-5xl">{activeSection.heading}</h1>
            <div className="flex space-x-6 mt-6 border-b-2 pb-2">
                {sections.map((section) => (
                    <button
                        key={section.name}
                        onClick={() => setActiveSection(section)}
                        className={`flex items-center space-x-2 text-lg font-semibold ${activeSection.name === section.name ? "text-black border-b-2" : "text-[#D0D0D0]"
                            }`}
                    >
                        <span>{section.icon}</span>
                        <span>{section.name}</span>
                    </button>
                ))}
            </div>
            <div className="flex items-center mt-6 w-full max-w-2xl bg-white rounded-full shadow-md px-4 py-2">
                <input
                    type="text"
                    placeholder={activeSection.placeholder}
                    className="flex-grow outline-none text-gray-600 text-lg"
                />
                <button className="bg-green-400 text-white px-6 py-2 rounded-full">Search</button>
            </div>
        </div>
    );
};

export default page;
