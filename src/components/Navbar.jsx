"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import { redirect } from "next/navigation";
import { HiMenu, HiX } from "react-icons/hi";
import { FiBell, FiUser, FiSettings, FiLogOut } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isReviewDropdownOpen, setIsReviewDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);
    const [user, setUser] = useState(null);

    const profileDropdownRef = useRef(null);
    const reviewDropdownRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        setIsAuthenticated(!!token);
        
        if (token) {
            fetchUserProfile(token);
        }
    }, []);

    const fetchUserProfile = async (token) => {
        try {
            const response = await fetch('/api/users/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const userData = await response.json();
                setUser(userData.data);
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

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

    const handleLogout = () => {
        Cookies.remove("token", { path: "/" });
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
        setIsDropdownOpen(false);
        setUser(null);
        redirect('/login');
    };

    return (
        <div className="w-full flex justify-between items-center">
            <div className="bg-[#121b22] text-[#FFD9C4] w-full z-50 flex items-center justify-between py-7 px-6 md:px-10 lg:px-12">
                {/* Mobile Menu Button */}
                <div className="xl:hidden">
                    <HiMenu className="text-2xl cursor-pointer hover:text-[#33e0a1] transition-colors" onClick={() => setIsMobileMenuOpen(true)} />
                </div>

                {/* Logo */}
                <Link href="/">
                    <div className="flex gap-2 items-center">
                        <Image src="/logo.png" width={40} height={20} alt="LocaVibe Logo" />
                        <h1 className="font-black text-2xl md:text-4xl">
                            Loca<span className="text-[#33e0a1]">vibe</span>.
                        </h1>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden xl:flex text-[#D0D0D0] text-lg gap-8 lg:gap-10">
                    <Link href="/discover">
                        <h2 className="hover:text-[#33e0a1] duration-200 cursor-pointer transition-colors">
                            Discover
                        </h2>
                    </Link>
                    <div className="relative" ref={reviewDropdownRef}>
                        <h2 
                            className="hover:text-[#33e0a1] duration-200 cursor-pointer transition-colors" 
                            onClick={() => setIsReviewDropdownOpen(!isReviewDropdownOpen)}
                        >
                            Review
                        </h2>
                        <AnimatePresence>
                            {isReviewDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute left-0 mt-2 text-sm font-semibold w-40 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl shadow-xl z-50"
                                >
                                    <Link href="/write-review" className="block px-4 py-3 hover:bg-white/20 rounded-t-xl transition-colors">
                                        Write a Review
                                    </Link>
                                    <Link href="/my-reviews" className="block px-4 py-3 hover:bg-white/20 transition-colors">
                                        My Reviews
                                    </Link>
                                    <Link href="/saved" className="block px-4 py-3 hover:bg-white/20 rounded-b-xl transition-colors">
                                        Saved Places
                                    </Link>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    <Link href="/community">
                        <h2 className="hover:text-[#33e0a1] duration-200 cursor-pointer transition-colors">
                            Community
                        </h2>
                    </Link>
                </div>

                {/* Right Side - Notifications & Profile */}
                <div className="flex items-center gap-4">
                    {/* Notifications Bell */}
                    {isAuthenticated && (
                        <div className="relative">
                            <button className="p-2 text-[#D0D0D0] hover:text-[#33e0a1] hover:bg-white/10 rounded-xl transition-all">
                                <FiBell className="w-5 h-5" />
                            </button>
                            {notificationCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-[#33e0a1] text-[#121b22] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {notificationCount > 9 ? '9+' : notificationCount}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Profile/Sign In */}
                    <div className="relative" ref={profileDropdownRef}>
                        {isAuthenticated ? (
                            <div>
                                <div
                                    className="flex items-center gap-2 cursor-pointer hover:bg-white/10 p-2 rounded-xl transition-all"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                >
                                    <div className="w-8 h-8 bg-gradient-to-br from-[#33e0a1]/20 to-[#33e0a1]/5 rounded-xl flex items-center justify-center border border-[#33e0a1]/20">
                                        <span className="text-sm font-bold text-[#33e0a1]">
                                            {user?.username?.charAt(0).toUpperCase() || 'U'}
                                        </span>
                                    </div>
                                    <span className="hidden md:block text-[#D0D0D0] text-sm">
                                        {user?.username || 'User'}
                                    </span>
                                </div>
                                <AnimatePresence>
                                    {isDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl shadow-xl z-50"
                                        >
                                            <Link href="/profile" className="flex items-center gap-3 px-4 py-3 hover:bg-white/20 rounded-t-xl transition-colors">
                                                <FiUser className="w-4 h-4" />
                                                View Profile
                                            </Link>
                                            <Link href="/my-reviews" className="flex items-center gap-3 px-4 py-3 hover:bg-white/20 transition-colors">
                                                <FiBell className="w-4 h-4" />
                                                My Reviews
                                            </Link>
                                            <Link href="/contact" className="flex items-center gap-3 px-4 py-3 hover:bg-white/20 transition-colors">
                                                <FiSettings className="w-4 h-4" />
                                                Settings
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-red-500/20 text-red-400 rounded-b-xl transition-colors"
                                            >
                                                <FiLogOut className="w-4 h-4" />
                                                Logout
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link href="/login">
                                <button className="bg-[#33e0a1] text-[#121b22] rounded-xl text-sm md:text-base py-2 px-6 cursor-pointer hover:bg-[#2dd4bf] font-semibold duration-200 transition-colors">
                                    Sign In
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Fullscreen Mobile Menu with Animation */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: "-100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "-100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed inset-0 bg-[#121b22]/95 backdrop-blur-md flex flex-col items-center justify-center z-50"
                    >
                        {/* Close Button */}
                        <HiX 
                            className="absolute top-8 right-8 text-white text-5xl cursor-pointer hover:text-[#33e0a1] transition-colors" 
                            onClick={() => setIsMobileMenuOpen(false)} 
                        />

                        {/* Menu Items */}
                        <div className="flex flex-col gap-8 text-3xl font-bold text-white text-center">
                            <Link 
                                href="/discover" 
                                onClick={() => setIsMobileMenuOpen(false)} 
                                className="hover:text-[#33e0a1] duration-200 transition-colors"
                            >
                                Discover
                            </Link>
                            <div className="relative" ref={reviewDropdownRef}>
                                <h2 
                                    className="hover:text-[#33e0a1] duration-200 cursor-pointer transition-colors" 
                                    onClick={() => setIsReviewDropdownOpen(!isReviewDropdownOpen)}
                                >
                                    Review
                                </h2>
                                <AnimatePresence>
                                    {isReviewDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="mt-4 text-lg font-medium space-y-2"
                                        >
                                            <Link 
                                                href="/write-review" 
                                                onClick={() => setIsMobileMenuOpen(false)} 
                                                className="block hover:text-[#33e0a1] transition-colors"
                                            >
                                                Write a Review
                                            </Link>
                                            <Link 
                                                href="/my-reviews" 
                                                onClick={() => setIsMobileMenuOpen(false)} 
                                                className="block hover:text-[#33e0a1] transition-colors"
                                            >
                                                My Reviews
                                            </Link>
                                            <Link 
                                                href="/saved" 
                                                onClick={() => setIsMobileMenuOpen(false)} 
                                                className="block hover:text-[#33e0a1] transition-colors"
                                            >
                                                Saved Places
                                            </Link>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            <Link 
                                href="/community" 
                                onClick={() => setIsMobileMenuOpen(false)} 
                                className="hover:text-[#33e0a1] duration-200 transition-colors"
                            >
                                Community
                            </Link>
                            {isAuthenticated && (
                                <Link 
                                    href="/profile" 
                                    onClick={() => setIsMobileMenuOpen(false)} 
                                    className="hover:text-[#33e0a1] duration-200 transition-colors"
                                >
                                    Profile
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Navbar;
