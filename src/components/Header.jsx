"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaHotel, FaCamera, FaUtensils, FaPlane, FaHome } from "react-icons/fa";
import Navbar from "./Navbar";
import { motion, AnimatePresence } from "framer-motion"


const sections = [
    {
      name: "Search All",
      icon: "🏠",
      heading: "Where to?",
      placeholder: "Places to go, things to do, hotels...",
      suggestions: ["Chandigarh","Delhi", "Bareilly", "Punjab", "Lucknow", "Shopping"],
    },
    {
      name: "Street Foods",
      icon: <FaHotel />,
      heading: "Find Food",
      placeholder: "Search for foods...",
      suggestions: ["Clothing", "Chole Bhature", "Momoz", "Briyani", "Fried Rice"],
    },
    {
      name: "Things to Do",
      icon: <FaCamera />,
      heading: "Discover Activities",
      placeholder: "Find attractions, tours...",
      suggestions: ["Museums", "Outdoor Adventures", "City Tours", "Theme Parks", "Local Experiences"],
    },
    {
      name: "Restaurants",
      icon: <FaUtensils />,
      heading: "Explore Restaurants",
      placeholder: "Search for restaurants...",
      suggestions: ["Fine Dining", "Casual Eats", "Local Cuisine", "Vegetarian Options", "Rooftop Bars"],
    },
    {
      name: "Shopping",
      icon: <FaPlane />,
      heading: "Find the best clothes",
      placeholder: "Search for fashion...",
      suggestions: ["Kharar", "Local Boutiques", "Local Winter Clothes", "Vintage Shops", "Souvenirs"],
    },
    {
      name: "Medical & Electronics",
      icon: <FaHome />,
      heading: "Find shops",
      placeholder: "Search for nearby shops...",
      suggestions: ["Gamezone", "Pharmacy", "Medical Stores", "Gadgets", "Grocery"],
    },
  ]
  
const Page = () => {
    const [activeSection, setActiveSection] = useState(sections[0])
  const [searchValue, setSearchValue] = useState("")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleSectionChange = (section) => {
    setIsVisible(false)
    setTimeout(() => {
      setActiveSection(section)
      setIsVisible(true)
    }, 300)
  }

  const handleSuggestionClick = (suggestion) => {
    setSearchValue(suggestion)
  }


    return (
        <>
        <Navbar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col justify-center items-center w-full px-6 md:mt-12 lg:px-12 py-8"
      >
        {/* Title */}
        <AnimatePresence mode="wait">
          <motion.h1
            key={activeSection.heading}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="font-black text-[#D0D0D0] mb-8 text-3xl sm:text-4xl lg:text-5xl text-center"
          >
            {activeSection.heading}
          </motion.h1>
        </AnimatePresence>

        {/* Navigation Buttons (Horizontal Scroll on Mobile) */}
        <div className="flex flex-nowrap overflow-x-auto justify-start md:justify-center items-center gap-4 w-full max-w-full pb-3 scrollbar-hide">
          {sections.map((section) => (
            <motion.button
              key={section.name}
              onClick={() => handleSectionChange(section)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center cursor-pointer duration-200      text-sm sm:text-lg font-semibold px-4 py-2 whitespace-nowrap ${activeSection.name === section.name ? "text-[#FFD9C4] border-b-2" : "text-[#D0D0D0]"}`}
            >
              <span>{section.icon}</span>
              <span>{section.name}</span>
            </motion.button>
          ))}
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mt-6 w-full"
        >
          <div className="flex items-center w-full max-w-full border border-white pl-4 rounded-full shadow-md md:px-4 px-1 py-1 hover:shadow-lg transition-shadow duration-300">
            <input
              type="text"
              placeholder={activeSection.placeholder}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="flex-grow outline-none text-[#D0D0D0] md:w-[60rem] text-sm sm:text-lg placeholder:text-[#D0D0D0] bg-transparent p-2 md:p-3"
            />
            <Link href="/discover">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-green-400 cursor-pointer text-black font-semibold px-6 py-3 rounded-br-full rounded-tr-full rounded-bl-xl rounded-tl-xl"
              >
                Search
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Popular Searches */}
        <AnimatePresence mode="wait">
          {isVisible && (
            <motion.div
              key={activeSection.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-4 flex flex-wrap justify-center gap-2"
            >
              {activeSection.suggestions.map((suggestion, index) => (
                <motion.button
                  key={suggestion}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: index * 0.1 },
                  }}
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 217, 196, 0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-3 py-1 rounded-full border border-[#FFD9C4] text-[#FFD9C4] text-sm hover:bg-[#FFD9C4]/10 transition-colors duration-200"
                >
                  {suggestion}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Travel Inspiration Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 w-full flex flex-col lg:flex-row bg-[#33e0a1] py-8 rounded-lg items-center justify-around lg:text-left"
        >
          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="hidden lg:block"
          >
            <img src="/image.png" alt="Travel Inspiration" className="rounded-md w-md" />
          </motion.div>
          <div className="p-4 flex flex-col items-center lg:items-start w-fit">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="text-xs text-black/50 mb-2"
            >
              Made by Vaibhav Rajpoot 💖
            </motion.h1>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-black mb-3 max-w-lg text-center lg:text-left"
            >
              Find Your Vibe, Explore Your City
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="text-md sm:text-lg max-w-lg text-black/70 mt-2 mb-4 text-center lg:text-left"
            >
              New in town? No worries! LocaVibe helps you uncover the best local spots—from cozy cafés to
              budget-friendly shopping and hidden gems around campus.
            </motion.p>
            <Link href="/discover">
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "#000000", boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)" }}
                whileTap={{ scale: 0.95 }}
                className="text-white rounded-lg w-fit text-lg py-2 cursor-pointer bg-black font-semibold duration-200 px-6"
              >
                Find your Vibe.
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </motion.div>
                        </>
    );
};

export default Page;
