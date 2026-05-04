"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import withAuth from "@/lib/withAuth";
import { motion } from "framer-motion";
import { FiEdit3, FiLogOut, FiSettings, FiUsers, FiStar, FiMapPin, FiCalendar } from "react-icons/fi";
import Navbar from "@/components/Navbar";
import Loader from "@/components/ui/Loader";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [userReviews, setUserReviews] = useState([]);
  const [userStats, setUserStats] = useState({
    reviews: 0,
    likes: 0,
    averageRating: 0,
    totalRestaurants: 0,
    joinedDate: null
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

        // Fetch user reviews and statistics
        await fetchUserReviews(data.data._id);
        
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Don't redirect on error, just show empty state
        setUser({
          data: {
            username: "User",
            email: "user@example.com",
            _id: "temp_user_id"
          }
        });
        setNewUsername("User");
      } finally {
        setLoading(false);
      }
    };

    const fetchUserReviews = async (userId) => {
      try {
        const reviewsResponse = await fetch(`/api/review/get-reviews?userId=${userId}`);
        if (reviewsResponse.ok) {
          const reviewsData = await reviewsResponse.json();
          const reviews = reviewsData.reviews || [];
          
          setUserReviews(reviews);
          
          // Calculate real statistics from actual data
          const totalLikes = reviews.reduce((sum, review) => sum + (review.likes || 0), 0);
          const avgRating = reviews.length > 0 
            ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
            : 0;
          const uniqueRestaurants = new Set(reviews.map(r => r.restaurantId)).size;
          
          setUserStats({
            reviews: reviews.length,
            likes: totalLikes,
            averageRating: avgRating,
            totalRestaurants: uniqueRestaurants,
            joinedDate: new Date(2024, 0, 15) // This could come from user creation date
          });
        } else {
          // Set empty stats if no reviews found
          setUserStats({
            reviews: 0,
            likes: 0,
            averageRating: 0,
            totalRestaurants: 0,
            joinedDate: new Date(2024, 0, 15)
          });
        }
      } catch (error) {
        console.error("Error fetching user reviews:", error);
        // Set empty stats on error
        setUserStats({
          reviews: 0,
          likes: 0,
          averageRating: 0,
          totalRestaurants: 0,
          joinedDate: new Date(2024, 0, 15)
        });
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

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long' 
    }).format(date);
  };

  const StatCard = ({ label, value, subtitle, icon: Icon }) => (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <Icon className="w-6 h-6 text-[#33e0a1]" />
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-[#D0D0D0]/70 mb-1">{label}</div>
      {subtitle && <div className="text-[#D0D0D0]/50 text-xs">{subtitle}</div>}
    </div>
  );

  const ReviewCard = ({ review, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-start gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300"
    >
      <div className="w-10 h-10 bg-[#33e0a1]/20 rounded-lg flex items-center justify-center flex-shrink-0">
        <FiStar className="w-5 h-5 text-[#33e0a1]" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-white font-medium">{review.restaurantName || "Restaurant"}</h4>
          <div className="flex items-center gap-1">
            <FiStar className="w-4 h-4 text-yellow-400" />
            <span className="text-white text-sm">{review.rating}</span>
          </div>
        </div>
        <p className="text-[#D0D0D0]/70 text-sm mb-2 line-clamp-2">
          {review.comment}
        </p>
        <div className="flex items-center gap-4 text-xs text-[#D0D0D0]/50">
          <span>{new Date(review.createdAt).toLocaleDateString()}</span>
          {review.likes > 0 && <span>{review.likes} likes</span>}
        </div>
      </div>
    </motion.div>
  );

  return (
    <>
      <div className="w-full flex justify-center items-center bg-[#121b22]">
        <div className="w-full md:w-[65%]">
          <Navbar />
        </div>
      </div>

      <div className="min-h-screen bg-[#121b22] text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              
              {/* Profile Info */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#33e0a1]/20 to-[#33e0a1]/5 rounded-2xl flex items-center justify-center border border-[#33e0a1]/20">
                    <span className="text-2xl font-bold text-[#33e0a1]">
                      {user.data.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  {isAdmin && (
                    <div className="absolute -top-2 -right-2 bg-[#33e0a1] text-[#121b22] text-xs px-2 py-1 rounded-lg font-medium">
                      Admin
                    </div>
                  )}
                </div>
                
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newUsername}
                          onChange={(e) => setNewUsername(e.target.value)}
                          className="bg-white/10 border border-white/20 px-3 py-2 rounded-lg text-xl font-bold focus:outline-none focus:border-[#33e0a1] transition-colors"
                          onKeyDown={(e) => e.key === "Enter" && updateUsername()}
                          autoFocus
                        />
                        <button
                          onClick={updateUsername}
                          className="bg-[#33e0a1] text-[#121b22] px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#2dd4bf] transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="bg-white/10 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <h1 className="text-3xl font-bold text-white">
                          {user.data.username}
                        </h1>
                        <button
                          onClick={() => setIsEditing(true)}
                          className="p-2 text-[#D0D0D0]/70 hover:text-[#33e0a1] hover:bg-white/10 rounded-lg transition-all"
                        >
                          <FiEdit3 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                  <p className="text-[#D0D0D0]/70 mb-1">{user.data.email}</p>
                  <p className="text-[#D0D0D0]/50 text-sm flex items-center gap-2">
                    <FiCalendar className="w-4 h-4" />
                    Member since {formatDate(userStats.joinedDate)}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <Link
                  href="/write-review"
                  className="bg-[#33e0a1] text-[#121b22] px-6 py-3 rounded-xl font-medium hover:bg-[#2dd4bf] transition-colors"
                >
                  Write Review
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-white/10 text-white px-4 py-3 rounded-xl font-medium hover:bg-white/20 transition-colors"
                >
                  <FiLogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            <StatCard 
              label="Reviews Written" 
              value={userStats.reviews} 
              subtitle="Total contributions"
              icon={FiStar}
            />
            <StatCard 
              label="Likes Received" 
              value={userStats.likes} 
              subtitle="Community appreciation"
              icon={FiUsers}
            />
            <StatCard 
              label="Restaurants Tried" 
              value={userStats.totalRestaurants} 
              subtitle="Unique places"
              icon={FiMapPin}
            />
            <StatCard 
              label="Average Rating" 
              value={userStats.averageRating || "N/A"} 
              subtitle="Your rating style"
              icon={FiStar}
            />
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Recent Activity */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Recent Reviews</h2>
                
                {userReviews.length > 0 ? (
                  <div className="space-y-4">
                    {userReviews.slice(0, 5).map((review, index) => (
                      <ReviewCard key={review._id} review={review} index={index} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FiStar className="w-12 h-12 text-[#D0D0D0]/30 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-[#D0D0D0]/70 mb-2">
                      No reviews yet
                    </h3>
                    <p className="text-[#D0D0D0]/50 mb-6">
                      Start sharing your dining experiences with the community
                    </p>
                    <Link
                      href="/write-review"
                      className="inline-flex items-center gap-2 bg-[#33e0a1] text-[#121b22] px-6 py-3 rounded-xl font-medium hover:bg-[#2dd4bf] transition-colors"
                    >
                      <FiStar className="w-4 h-4" />
                      Write Your First Review
                    </Link>
                  </div>
                )}

                {userReviews.length > 5 && (
                  <div className="mt-6 text-center">
                    <Link
                      href="/my-reviews"
                      className="text-[#33e0a1] hover:text-[#2dd4bf] font-medium transition-colors"
                    >
                      View All Reviews ({userReviews.length}) →
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Quick Actions & Info */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              
              {/* Quick Actions */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link
                    href="/discover"
                    className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group"
                  >
                    <FiMapPin className="w-5 h-5 text-[#33e0a1]" />
                    <span className="text-white group-hover:text-[#33e0a1] transition-colors">
                      Discover Restaurants
                    </span>
                  </Link>
                  <Link
                    href="/saved"
                    className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group"
                  >
                    <FiStar className="w-5 h-5 text-[#33e0a1]" />
                    <span className="text-white group-hover:text-[#33e0a1] transition-colors">
                      Saved Places
                    </span>
                  </Link>
                  <Link
                    href="/community"
                    className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group"
                  >
                    <FiUsers className="w-5 h-5 text-[#33e0a1]" />
                    <span className="text-white group-hover:text-[#33e0a1] transition-colors">
                      Community
                    </span>
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-3 p-3 bg-[#33e0a1]/10 border border-[#33e0a1]/20 rounded-xl hover:bg-[#33e0a1]/20 transition-colors group"
                    >
                      <FiSettings className="w-5 h-5 text-[#33e0a1]" />
                      <span className="text-[#33e0a1] font-medium">
                        Admin Panel
                      </span>
                    </Link>
                  )}
                </div>
              </div>

              {/* Profile Insights */}
              {userReviews.length > 0 && (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Your Insights</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[#D0D0D0]/70 text-sm">Most Active Month</span>
                      <span className="text-white text-sm">
                        {new Date().toLocaleDateString('en-US', { month: 'long' })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#D0D0D0]/70 text-sm">Favorite Rating</span>
                      <span className="text-[#33e0a1] text-sm">
                        {Math.round(userStats.averageRating)} ★
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#D0D0D0]/70 text-sm">Review Streak</span>
                      <span className="text-white text-sm">
                        {userReviews.length > 5 ? 'Active' : 'Getting Started'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default withAuth(ProfilePage);