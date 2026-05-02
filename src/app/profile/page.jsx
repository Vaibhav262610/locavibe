"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import withAuth from "@/lib/withAuth";
import { motion } from "framer-motion";
import { FaUserEdit, FaHeart, FaEye, FaStar, FaMapMarkerAlt } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { MdAdminPanelSettings, MdReviews } from "react-icons/md";
import { HiTrendingUp } from "react-icons/hi";
import Navbar from "@/components/Navbar";
import Loader from "@/components/ui/Loader";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [userStats, setUserStats] = useState({
    reviews: 0,
    likes: 0,
    profileViews: 0,
    averageRating: 0
  });
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
        
        // Check admin status
        if (
          adminUserName === data.data.username &&
          adminEmailId === data.data.email
        ) {
          setIsAdmin(true);
        }

        // Fetch user statistics (you can implement these API endpoints) 
        await fetchUserStats(data.data._id);
        
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserStats = async (userId) => {
      try {
        // You can implement these endpoints to get real user stats
        // For now, we'll use placeholder logic
        const reviewsResponse = await fetch(`/api/review/get-reviews?userId=${userId}`);
        if (reviewsResponse.ok) {
          const reviewsData = await reviewsResponse.json();
          setUserStats({
            reviews: reviewsData.reviews?.length || 0,
            likes: reviewsData.reviews?.reduce((sum, review) => sum + (review.likes || 0), 0) || 0,
            profileViews: Math.floor(Math.random() * 100) + 50, // Placeholder until you implement view tracking
            averageRating: reviewsData.reviews?.length > 0 
              ? (reviewsData.reviews.reduce((sum, review) => sum + review.rating, 0) / reviewsData.reviews.length).toFixed(1)
              : 0
          });
        }
      } catch (error) {
        console.error("Error fetching user stats:", error);
      }
    };

    fetchUserData();
  }, []);

  const updateUsername = async () => {
    if (!newUsername.trim() || newUsername === user.data.username) {
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

      setUser((prev) => ({ 
        ...prev, 
        data: { ...prev.data, username: newUsername }
      }));
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating username:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    router.push("/login");
  };

  if (loading) {
    return <Loader message="Loading your profile" />;
  }

  return (
    <>
      <div className="w-full flex justify-center items-center">
        <div className="bg-red-50 w-full md:w-[65%]">
          <Navbar />
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Hero Profile Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-8 mb-8 backdrop-blur-sm border border-white/10"
          >
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Profile Image */}
              <div className="relative">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  src={`https://ui-avatars.com/api/?name=${user.data.username}&size=150&background=6366f1&color=ffffff&bold=true`}
                  className="w-32 h-32 lg:w-40 lg:h-40 rounded-full border-4 border-gradient-to-r from-blue-500 to-purple-500 shadow-2xl"
                  alt="Profile"
                />
                <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-slate-900 flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                  {isEditing ? (
                    <motion.input
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="bg-slate-700/50 border border-slate-600 px-4 py-2 rounded-lg text-xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                      onKeyDown={(e) => e.key === "Enter" && updateUsername()}
                      autoFocus
                    />
                  ) : (
                    <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      {user.data.username}
                    </h1>
                  )}
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => isEditing ? updateUsername() : setIsEditing(true)}
                    className="p-2 bg-blue-600/80 rounded-full hover:bg-blue-700 transition-colors backdrop-blur-sm"
                  >
                    <FaUserEdit size={16} />
                  </motion.button>
                  
                  {isAdmin && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-xs font-semibold rounded-full shadow-lg"
                    >
                      Admin
                    </motion.span>
                  )}
                </div>
                
                <p className="text-slate-300 mb-4 flex items-center justify-center lg:justify-start gap-2">
                  <FaMapMarkerAlt className="text-blue-400" />
                  {user.data.email}
                </p>
                
                <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-2xl">
                  Hey there! 👋 Welcome to <span className="text-white font-semibold">LocaVibe</span>! 
                  I'm passionate about discovering amazing local spots and sharing authentic experiences with the community. 
                  Let's explore and support local businesses together! 🌟
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  {isAdmin && (
                    <Link href="/admin">
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 flex items-center gap-2 font-medium shadow-lg"
                      >
                        <MdAdminPanelSettings size={18} />
                        Admin Panel
                      </motion.button>
                    </Link>
                  )}
                  
                  <Link href="/write-review">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 flex items-center gap-2 font-medium shadow-lg"
                    >
                      <MdReviews size={18} />
                      Write Review
                    </motion.button>
                  </Link>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-red-600 to-pink-600 px-6 py-2 rounded-lg hover:from-red-700 hover:to-pink-700 flex items-center gap-2 font-medium shadow-lg"
                  >
                    <FiLogOut size={18} />
                    Logout
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {[
              { 
                label: "Reviews Written", 
                value: userStats.reviews, 
                icon: MdReviews, 
                color: "from-blue-500 to-cyan-500",
                bgColor: "from-blue-500/20 to-cyan-500/20"
              },
              { 
                label: "Total Likes", 
                value: userStats.likes, 
                icon: FaHeart, 
                color: "from-red-500 to-pink-500",
                bgColor: "from-red-500/20 to-pink-500/20"
              },
              { 
                label: "Profile Views", 
                value: userStats.profileViews, 
                icon: FaEye, 
                color: "from-green-500 to-emerald-500",
                bgColor: "from-green-500/20 to-emerald-500/20"
              },
              { 
                label: "Avg Rating", 
                value: userStats.averageRating || "N/A", 
                icon: FaStar, 
                color: "from-yellow-500 to-orange-500",
                bgColor: "from-yellow-500/20 to-orange-500/20"
              }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.05 }}
                className={`bg-gradient-to-br ${stat.bgColor} backdrop-blur-sm border border-white/10 p-6 rounded-xl text-center group hover:shadow-2xl transition-all duration-300`}
              >
                <div className={`inline-flex p-3 rounded-full bg-gradient-to-r ${stat.color} mb-3 group-hover:scale-110 transition-transform`}>
                  <stat.icon className="text-white text-xl" />
                </div>
                <p className="text-2xl lg:text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Activity Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <HiTrendingUp className="text-white text-xl" />
              </div>
              <h2 className="text-2xl font-bold">Recent Activity</h2>
            </div>
            
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MdReviews className="text-3xl text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Start Your Journey</h3>
              <p className="text-slate-400 mb-6 max-w-md mx-auto">
                Share your first review and help others discover amazing local spots in your area.
              </p>
              <Link href="/write-review">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  Write Your First Review
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default withAuth(ProfilePage);
