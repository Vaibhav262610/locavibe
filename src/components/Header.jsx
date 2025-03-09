"use client"

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

const page = () => {
    const [activeSection, setActiveSection] = useState(sections[0]);

    return (
        <div className="flex flex-col justify-center  h-screen items-center mt-12 w-full">
            <h1 className="font-black text-[#D0D0D0] mb-12 text-5xl">{activeSection.heading}</h1>
            <div className="flex space-x-6 border-b-2 pb-2">
                {sections.map((section) => (
                    <button
                        key={section.name}
                        onClick={() => setActiveSection(section)}
                        className={`flex items-center cursor-pointer duration-200 space-x-2 text-lg font-semibold ${activeSection.name === section.name ? "text-[#FFD9C4] border-b-2" : "text-[#D0D0D0]"}`}
                    >
                        <span>{section.icon}</span>
                        <span>{section.name}</span>
                    </button>
                ))}
            </div>
            <div className="flex mt-4 items-center w-full max-w-2xl border border-white pl-8 rounded-full shadow-md px-4 py-2">
                <input
                    type="text"
                    placeholder={activeSection.placeholder}
                    className="flex-grow outline-none text-[#D0D0D0] text-lg placeholder:text-[#D0D0D0]"
                />
                <button className="bg-green-400 cursor-pointer text-black font-semibold px-6 py-3 rounded-br-full rounded-tr-full rounded-bl-xl rounded-tl-xl">Search</button>
            </div>
            <div className="mt-16 w-full flex bg-[#33e0a1] py-8 rounded-lg justify-center">
                <img
                    src="https://media-cdn.tripadvisor.com/media/photo-o/2e/d9/f1/88/caption.jpg?w=1200&h=-1"
                    alt="Travel Inspiration"
                    className="w-1/2 h-full object-cover object-left max-w-[600px] "
                />
                <div className="text-black p-4 flex  flex-col">
                    <h1 className="text-xs text-black/50 mb-2">Made by Vaibhav Rajpoot 💖</h1>
                    <h2 className="text-5xl font-black mb-3 w-md flex flex-wrap">Find Your Vibe, Explore Your City</h2>
                    <p className="text-xl max-w-md text-black/70 mt-2 mb-4">New in town? No worries! LocaVibe helps you uncover the best local spots—from cozy cafés to budget-friendly shopping and hidden gems around campus</p>
                    <button className="text-white rounded-lg w-fit text-lg py-2 cursor-pointer bg-black font-semibold duration-200 px-7">Find your Vibe.</button>
                </div>
            </div>
        </div>
    );
};

export default page;
