"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import { redirect } from "next/navigation";
import { HiMenu, HiX } from "react-icons/hi";
import { motion } from "framer-motion";

const Navbar = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isReviewDropdownOpen, setIsReviewDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const profileDropdownRef = useRef(null);
    const reviewDropdownRef = useRef(null);

    useEffect(() => {
        const token = Cookies.get("authToken");
        setIsAuthenticated(!!token);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
            if (reviewDropdownRef.current && !reviewDropdownRef.current.contains(event.target)) {
                setIsReviewDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="w-full flex justify-between items-center ">
            <div className="bg-[#121b22] text-[#FFD9C4] w-full  z-50 flex items-center justify-between py-7 px-6 md:px-10 lg:px-12">
                {/* Mobile Menu Button */}
                <div className="xl:hidden">
                    <HiMenu className="text-2xl cursor-pointer" onClick={() => setIsMobileMenuOpen(true)} />
                </div>

                {/* Logo */}
                <Link href="/">
                    <div className="flex gap-2">
                        <Image src="/logo.png" width={40} height={20} alt="LocaVibe Logo" />
                        <h1 className="font-black text-2xl md:text-4xl">Loca<span className="text-[#33e0a1]">vibe</span>.</h1>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden xl:flex text-[#D0D0D0] text-lg gap-8 lg:gap-10">
                    <Link href="/discover"><h2 className="hover:opacity-70 duration-200 cursor-pointer">Discover</h2></Link>
                    <div className="relative" ref={reviewDropdownRef}>
                        <h2 className="hover:opacity-70 duration-200 cursor-pointer" onClick={() => setIsReviewDropdownOpen(!isReviewDropdownOpen)}>Review</h2>
                        {isReviewDropdownOpen && (
                            <div className="absolute left-0 mt-2 text-sm font-semibold w-40 bg-white text-black rounded-lg shadow-lg z-50">
                                <Link href="/write-review" className="block px-4 py-3 hover:bg-gray-200">Write a Review</Link>
                                <Link href="/post-photo" className="block px-4 py-3 hover:bg-gray-200">Post a Photo</Link>
                                <Link href="/add-place" className="block px-4 py-3 hover:bg-gray-200">Add a Place</Link>
                            </div>
                        )}
                    </div>
                    <Link href="/community"><h2 className="hover:opacity-70 duration-200 cursor-pointer">Community</h2></Link>
                </div>

                {/* Profile/Sign In */}
                <div className="relative" ref={profileDropdownRef}>
                    {isAuthenticated ? (
                        <div>
                            <Image
                                src="https://mir-s3-cdn-cf.behance.net/project_modules/hd/d95c1f148207527.62d1246c25004.jpg"
                                width={42} height={42} alt="Profile"
                                className="cursor-pointer hover:opacity-60 duration-200 rounded-full"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            />
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg z-50">
                                    <Link href="/profile" className="block px-4 py-3 hover:bg-gray-200">View Profile</Link>
                                    <Link href="/my-reviews" className="block px-4 py-3 hover:bg-gray-200">My Reviews</Link>
                                    <Link href="/saved" className="block px-4 py-3 hover:bg-gray-200">Saved</Link>
                                    <Link href="/settings" className="block px-4 py-3 hover:bg-gray-200">Settings</Link>
                                    <button
                                        onClick={() => {
                                            Cookies.remove("token", { path: "/" });
                                            localStorage.removeItem('token');
                                            localStorage.removeItem('authToken');
                                            setIsAuthenticated(false);
                                            setIsDropdownOpen(false);
                                            redirect('/login');
                                        }}
                                        className="block w-full text-left px-4 py-3 hover:bg-gray-200"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link href="/login">
                            <button className="border border-[#FFD9C4] text-white rounded-lg text-xs md:text-lg py-2 cursor-pointer hover:bg-[#FFD9C4] hover:text-black font-semibold duration-200 px-6">Sign In</button>
                        </Link>
                    )}
                </div>
            </div>

            {/* Fullscreen Mobile Menu with Animation */}
            {isMobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, x: "-100%" }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: "-100%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }} // Adjust spring properties for smooth sliding
                    className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50"
                >
                    {/* Close Button */}
                    <HiX className="absolute top-8 right-8 text-white text-5xl cursor-pointer hover:opacity-80" onClick={() => setIsMobileMenuOpen(false)} />

                    {/* Menu Items */}
                    <div className="flex flex-col gap-8 text-3xl font-bold text-white text-center">
                        <Link href="/discover" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#33e0a1] duration-200">Discover</Link>
                        <h2 className="hover:text-[#33e0a1] duration-200 cursor-pointer">Trips</h2>
                        <div className="relative" ref={reviewDropdownRef}>
                            <h2 className="hover:opacity-70 duration-200 cursor-pointer" onClick={() => setIsReviewDropdownOpen(!isReviewDropdownOpen)}>Review</h2>
                            {isReviewDropdownOpen && (
                                <div className="absolute left-0 mt-2 text-sm font-semibold w-40 bg-white text-black rounded-lg shadow-lg z-50">
                                    <Link href="/write-review" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3  hover:bg-gray-200">Write a Review</Link>
                                    <Link href="/post-photo" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 hover:bg-gray-200">Post a Photo</Link>
                                    <Link href="/add-place" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 hover:bg-gray-200">Add a Place</Link>
                                </div>
                            )}
                        </div>
                        <Link href="/community" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#33e0a1] duration-200">Community</Link>
                    </div>
                </motion.div>
            )}

        </div>
    );
};

export default Navbar;
