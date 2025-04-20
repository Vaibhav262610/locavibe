"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import withAuth from "@/lib/withAuth";
import { motion } from "framer-motion";
import { FaUserEdit } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { MdAdminPanelSettings } from "react-icons/md";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  const adminEmailId = "vaibhav@gmail.com";
  const adminUserName = "vaibhav";

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
        setNewUsername(data.data.username);
        if (
          adminUserName === data.data.username &&
          adminEmailId === data.data.email
        ) {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const updateUsername = async () => {
    if (!newUsername.trim() || newUsername === user.username) {
      setIsEditing(false);
      return;
    }
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const response = await fetch("/api/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username: newUsername }),
      });

      if (!response.ok) throw new Error("Failed to update username");

      setUser((prev) => ({ ...prev, username: newUsername }));
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating username:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center flex-col items-center h-[85vh] bg-[#0d1117]">
        <img
          className="select-none md:w-auto w-72"
          src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMng0bjlnb3Z1Zmo1N3kxcmoyemw0M3MwNGs3amszemdjbjJtM2FydyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/6KKKVerzrhjRrClNKt/giphy.gif"
          alt="Loading..."
        />
        <p className="mt-4 nav font-thin text-xl md:text-3xl text-white">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#0d1117] text-white min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Top Profile Card */}
        <div className="flex flex-col md:flex-row items-center gap-6 border-b border-gray-700 pb-6">
          <img
            src="https://mir-s3-cdn-cf.behance.net/project_modules/hd/d95c1f148207527.62d1246c25004.jpg"
            className="w-32 h-32 rounded-full border-4 border-indigo-500"
            alt="Profile"
          />
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2">
              {isEditing ? (
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="border p-2 text-sm text-center rounded-md bg-gray-700 text-white focus:outline-none"
                  onKeyDown={(e) => e.key === "Enter" && updateUsername()}
                />
              ) : (
                <h1 className="text-3xl font-bold">{user.data.username}</h1>
              )}
              <button
                onClick={() =>
                  isEditing ? updateUsername() : setIsEditing(true)
                }
                className="p-2 bg-blue-600 rounded-full hover:bg-blue-700"
              >
                <FaUserEdit size={16} />
              </button>
              {isAdmin && (
                <span className="text-xs bg-green-600 px-2 py-1 rounded-full">
                  Admin
                </span>
              )}
            </div>
            <p className="text-gray-400 mt-1 text-sm">{user.data.email}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {isAdmin && (
                <Link href="/admin">
                  <button className="bg-green-600 px-4 py-1 rounded hover:bg-green-700 flex items-center gap-1">
                    <MdAdminPanelSettings size={16} />
                    Admin Panel
                  </button>
                </Link>
              )}
              <button
                onClick={() => router.push("/discover")}
                className="bg-red-600 px-4 py-1 rounded hover:bg-red-700 flex items-center gap-1"
              >
                <FiLogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* About Me Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold border-b border-gray-700 pb-2 mb-4">
            About Me
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Hi, I'm {user.data.username}. I'm passionate about building cool
            stuff on the web 🌐 and creating seamless user experiences. I love
            coding, contributing to projects, and always looking to learn more
            each day 🚀.
          </p>
        </div>

        {/* Stats */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold border-b border-gray-700 pb-2 mb-4">
            Stats
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-2xl font-bold">12</p>
              <p className="text-sm text-gray-400">Posts</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-2xl font-bold">7</p>
              <p className="text-sm text-gray-400">Communities</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-2xl font-bold">35</p>
              <p className="text-sm text-gray-400">Friends</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-2xl font-bold">198</p>
              <p className="text-sm text-gray-400">Profile Views</p>
            </div>
          </div>
        </div>

        {/* Placeholder: Contribution Graph */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold border-b border-gray-700 pb-2 mb-4">
            Contribution Graph
          </h2>
          <div className="bg-gray-800 p-6 rounded-lg h-40 text-center flex items-center justify-center text-gray-500">
            Contribution graph coming soon 📊
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(ProfilePage);
