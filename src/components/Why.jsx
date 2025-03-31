"use client"

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Star, Users, ArrowRight, ChevronDown } from "lucide-react";

export default function WhyLocavibe() {
    const [expandedCard, setExpandedCard] = useState(null);

    const features = [
        {
            icon: <Star className="h-10 w-10 sm:h-12 sm:w-12 text-teal-400" />, // Responsive icon size
            title: "Trusted Reviews",
            description: "Find the best local shops based on genuine customer feedback and ratings.",
            stats: "Over 10,000 verified reviews from real customers",
            color: "from-teal-900/40 to-teal-800/30",
        },
        {
            icon: <MapPin className="h-10 w-10 sm:h-12 sm:w-12 text-cyan-400" />, // Responsive icon size
            title: "Discover Hidden Gems",
            description: "Explore top-rated shops in your area that you might not have known about.",
            stats: "Discover an average of 8 new local favorites per month",
            color: "from-cyan-900/40 to-cyan-800/30",
        },
        {
            icon: <Users className="h-10 w-10 sm:h-12 sm:w-12 text-blue-400" />, // Responsive icon size
            title: "Community Recommendations",
            description: "Get shop suggestions from real people who know the best places around.",
            stats: "Join 50,000+ community members sharing their favorite spots",
            color: "from-blue-900/40 to-blue-800/30",
        },
    ];

    return (
        <div className="min-h-screen w-full flex flex-col justify-center items-center px-4 sm:px-6 lg:px-12 py-20 ">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="text-center mb-16 max-w-5xl"
            >
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-6 text-[#D0D0D0]">
                    WHY LOCAVIBE?
                </h1>
                <p className="text-base sm:text-lg md:text-xl w-xs sm:w-full mx-auto text-slate-300 leading-relaxed">
                    Locavibe helps newcomers discover the best local shops in their area by providing
                    <span className="font-semibold text-teal-300"> trusted reviews</span> and
                    <span className="font-semibold text-cyan-300"> community recommendations</span>.
                </p>
            </motion.div>

            <div className="flex flex-wrap justify-center items-start gap-6 xl:gap-8 w-full">
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                        className="h-full"
                    >
                        <div
                            className={`h-full w-72 sm:w-80 rounded-xl bg-gradient-to-br ${feature.color} backdrop-blur-sm border border-[#1e2a33] shadow-xl overflow-hidden flex flex-col p-4 sm:p-6`}
                        >
                            <div className="flex justify-between items-start">
                                <div className="p-2 sm:p-3 rounded-xl bg-[#0c151b]/80 backdrop-blur-sm">{feature.icon}</div>
                                <button
                                    onClick={() => setExpandedCard(expandedCard === index ? null : index)}
                                    className="p-2 rounded-full text-slate-400 hover:text-teal-300 hover:bg-[#0c151b]/70 transition-colors"
                                >
                                    <ChevronDown
                                        className={`h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-300 ${expandedCard === index ? "rotate-180" : ""}`}
                                    />
                                </button>
                            </div>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mt-3 sm:mt-4 text-white">{feature.title}</h2>
                            <p className="text-sm sm:text-lg text-slate-300 mt-1 sm:mt-2">{feature.description}</p>

                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{
                                    height: expandedCard === index ? "auto" : 0,
                                    opacity: expandedCard === index ? 1 : 0,
                                }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden mt-3 sm:mt-4"
                            >
                                <div className="p-3 sm:p-4 bg-[#0c151b]/70 rounded-lg">
                                    <p className="text-xs sm:text-md font-medium text-slate-200">{feature.stats}</p>
                                </div>
                            </motion.div>

                            <div className="mt-auto pt-3 sm:pt-4">
                                <button className="w-full flex justify-between items-center py-2 sm:py-3 px-4 sm:px-5 rounded-lg text-sm sm:text-lg text-slate-300 hover:text-teal-300 hover:bg-[#0c151b]/70 transition-colors">
                                    Learn  more <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="mt-12 sm:mt-16"
            >
                <button className="px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-xl font-medium rounded-lg bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-500 hover:to-cyan-600 text-white shadow-lg shadow-teal-900/30 transition-all hover:scale-105">
                    Get Started Now
                </button>
            </motion.div>
        </div>
    );
}
