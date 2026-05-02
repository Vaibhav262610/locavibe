import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ message = "Loading", size = "default" }) => {
    const sizeClasses = {
        small: "w-6 h-6",
        default: "w-12 h-12", 
        large: "w-16 h-16"
    };

    const containerVariants = {
        start: { transition: { staggerChildren: 0.2 } },
        end: { transition: { staggerChildren: 0.2 } }
    };

    const circleVariants = {
        start: { y: "0%" },
        end: { y: "100%" }
    };

    const circleTransition = {
        duration: 0.5,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
    };

    return (
        <div className="flex justify-center flex-col items-center h-[85vh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Custom animated loader */}
            <div className="relative mb-8">
                {/* Outer ring */}
                <motion.div
                    className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-500"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    style={{ width: "80px", height: "80px" }}
                />
                
                {/* Inner pulsing circle */}
                <motion.div
                    className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
                    animate={{ 
                        scale: [1, 1.1, 1],
                        opacity: [0.7, 1, 0.7]
                    }}
                    transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{ margin: "8px" }}
                >
                    {/* Bouncing dots */}
                    <motion.div
                        className="flex space-x-1"
                        variants={containerVariants}
                        initial="start"
                        animate="end"
                    >
                        {[0, 1, 2].map((index) => (
                            <motion.div
                                key={index}
                                className="w-2 h-2 bg-white rounded-full"
                                variants={circleVariants}
                                transition={circleTransition}
                            />
                        ))}
                    </motion.div>
                </motion.div>
            </div>

            {/* Loading text with typewriter effect */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center"
            >
                <motion.p 
                    className="text-xl md:text-2xl font-medium text-white mb-2"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    {message}
                </motion.p>
                <p className="text-sm text-gray-400">
                    Discovering amazing local spots for you...
                </p>
            </motion.div>

            {/* Progress bar */}
            <div className="w-64 h-1 bg-gray-700 rounded-full mt-6 overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                    }}
                />
            </div>
        </div>
    );
};

export default Loader;




