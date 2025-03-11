"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";

const Navbar = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isReviewDropdownOpen, setIsReviewDropdownOpen] = useState(false);

    const profileDropdownRef = useRef(null);
    const reviewDropdownRef = useRef(null);

    useEffect(() => {
        const token = Cookies.get("authToken");
        setIsAuthenticated(!!token);
        // setIsAuthenticated(!!authToken);
    }, []);

    // Function to handle clicks outside dropdowns
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }
            if (
                reviewDropdownRef.current && !reviewDropdownRef.current.contains(event.target)
            ) {
                setIsReviewDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div>
            <div className="bg-[#121b22] text-[#FFD9C4] w-full left-0 justify-evenly z-50 fixed top-0 items-center flex py-7 px-6 md:px-10 lg:px-34">
                <Link href="/">
                    <div className="flex gap-2">
                        <Image src="/logo.png" width={40} height={20} alt="" />
                        <h1 className="font-black text-4xl">
                            Loca<span className="text-[#33e0a1]">vibe</span>.
                        </h1>
                    </div>
                </Link>
                <div className="flex text-[#D0D0D0] text-lg gap-5 md:gap-8 lg:gap-10">
                    <Link href="/discover">
                        <h2 className="hover:opacity-70 duration-200 cursor-pointer">Discover</h2>
                    </Link>
                    <h2 className="hover:opacity-70 duration-200 cursor-pointer">Trips</h2>

                    {/* Review Dropdown */}
                    <div className="relative" ref={reviewDropdownRef}>
                        <h2
                            className="hover:opacity-70 duration-200 cursor-pointer"
                            onClick={() => setIsReviewDropdownOpen(!isReviewDropdownOpen)}
                        >
                            Review
                        </h2>
                        {isReviewDropdownOpen && (
                            <div className="absolute left-0 mt-2 text-sm font-semibold  w-40 bg-white text-black rounded-lg shadow-lg z-50">
                                <Link href="/write-review" className="block px-4 py-3 hover:bg-gray-200">
                                    Write a Review
                                </Link>
                                <Link href="/post-photo" className="block px-4 py-3 hover:bg-gray-200">
                                    Post a Photo
                                </Link>
                                <Link href="/add-place" className="block px-4 py-3 hover:bg-gray-200">
                                    Add a Place
                                </Link>
                            </div>
                        )}
                    </div>

                    <h2 className="hover:opacity-70 duration-200 cursor-pointer">Community</h2>
                </div>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileDropdownRef}>
                    {isAuthenticated ? (
                        <div>
                            <Image
                                src="https://mir-s3-cdn-cf.behance.net/project_modules/hd/d95c1f148207527.62d1246c25004.jpg"
                                width={42}
                                height={42}
                                alt="Profile"
                                className="cursor-pointer hover:opacity-60 duration-200 rounded-full"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            />
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg z-50">
                                    <Link href="/profile" className="block px-4 py-3 hover:bg-gray-200">
                                        View Profile
                                    </Link>
                                    <Link href="/my-reviews" className="block px-4 py-3 hover:bg-gray-200">
                                        My Reviews
                                    </Link>
                                    <Link href="/settings" className="block px-4 py-3 hover:bg-gray-200">
                                        Settings
                                    </Link>
                                    <button
                                        onClick={() => {
                                            Cookies.remove("authToken");
                                            setIsAuthenticated(false);
                                            setIsDropdownOpen(false);
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
                            <button className="border border-[#FFD9C4] text-white rounded-lg text-lg py-2 cursor-pointer hover:bg-[#FFD9C4] hover:text-black font-semibold duration-200 px-6 md:px-7 lg:px-7">
                                Sign In
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </div >
    );
};

export default Navbar;
