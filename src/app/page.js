"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiMapPin, FiStar, FiTrendingUp, FiUsers, FiMic } from "react-icons/fi";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import AdvancedSearch from "@/components/Search/AdvancedSearch";
import SmartRecommendations from "@/components/Recommendations/SmartRecommendations";
import VoiceSearchButton from "@/components/VoiceSearch/VoiceSearchButton";
import LocationDisplay from "@/components/Location/LocationDisplay";
import { performanceMonitor } from "@/lib/performance";
import { chandigarhRestaurants } from "@/data/chandigarhRestaurants";

export default function HomePage() {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [featuredRestaurants, setFeaturedRestaurants] = useState([]);
  const [stats, setStats] = useState({
    totalRestaurants: 0,
    totalReviews: 0,
    activeUsers: 0
  });

  useEffect(() => {
    // Initialize performance monitoring
    if (typeof window !== 'undefined') {
      performanceMonitor.trackInteraction('page_view', 'homepage');
    }

    // Fetch homepage data
    fetchHomepageData();
  }, []);

  const fetchHomepageData = async () => {
    try {
      // Use hardcoded Chandigarh restaurants for featured section
      const featuredRestaurants = chandigarhRestaurants
        .filter(restaurant => restaurant.rating >= 4.2)
        .slice(0, 6);

      setFeaturedRestaurants(featuredRestaurants);

      // Set platform statistics
      setStats({
        totalRestaurants: chandigarhRestaurants.length,
        totalReviews: chandigarhRestaurants.reduce((sum, r) => sum + r.reviewCount, 0),
        activeUsers: 2347 // Mock data
      });
    } catch (error) {
      console.error('Error fetching homepage data:', error);
    }
  };

  const handleSearch = async (query, filters) => {
    setIsSearching(true);
    performanceMonitor.trackInteraction('search', 'homepage', { query, filters });

    try {
      // Search through Chandigarh restaurants
      let results = chandigarhRestaurants.filter(restaurant => {
        const matchesQuery = !query ||
          restaurant.name.toLowerCase().includes(query.toLowerCase()) ||
          restaurant.cuisine.toLowerCase().includes(query.toLowerCase()) ||
          restaurant.specialties.some(specialty =>
            specialty.toLowerCase().includes(query.toLowerCase())
          );

        const matchesCuisine = !filters.cuisine?.length ||
          filters.cuisine.includes(restaurant.cuisine);

        const matchesRating = !filters.rating ||
          restaurant.rating >= filters.rating;

        const matchesPriceRange = !filters.priceRange?.length ||
          (restaurant.priceRange >= filters.priceRange[0] &&
            restaurant.priceRange <= filters.priceRange[1]);

        const matchesFeatures = !filters.features?.length ||
          filters.features.some(feature => restaurant.features.includes(feature));

        return matchesQuery && matchesCuisine && matchesRating &&
          matchesPriceRange && matchesFeatures;
      });

      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleVoiceResult = (transcript, confidence) => {
    if (confidence > 0.7) {
      handleSearch(transcript, {});
    }
  };

  const StatCard = ({ icon: Icon, value, label, trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center"
    >
      <Icon className="w-8 h-8 text-[#33e0a1] mx-auto mb-3" />
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-[#D0D0D0]/70 text-sm mb-2">{label}</div>
      {trend && (
        <div className="text-[#33e0a1] text-xs flex items-center justify-center gap-1">
          <FiTrendingUp className="w-3 h-3" />
          {trend}
        </div>
      )}
    </motion.div>
  );

  const RestaurantCard = ({ restaurant }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300"
    >
      <div className="h-48 bg-gradient-to-br from-[#33e0a1]/20 to-[#33e0a1]/5 flex items-center justify-center">
        <span className="text-[#33e0a1] text-sm">Restaurant Image</span>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-1">{restaurant.name}</h3>
        <p className="text-[#D0D0D0]/70 text-sm mb-2">{restaurant.cuisine}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <FiStar className="w-4 h-4 text-yellow-400" />
            <span className="text-white text-sm">{restaurant.rating}</span>
          </div>
          <span className="text-[#D0D0D0]/70 text-sm">
            {'$'.repeat(restaurant.priceRange || 2)}
          </span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#121b22] text-white">
      {/* Navigation */}
      <div className="w-full flex justify-center items-center">
        <div className="w-full md:w-[65%]">
          <Navbar />
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-[#33e0a1] bg-clip-text text-transparent"
          >
            Discover Amazing
            <br />
            Local Restaurants
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-[#D0D0D0]/70 mb-12 max-w-2xl mx-auto"
          >
            Find the perfect dining experience in Chandigarh with AI-powered recommendations,
            real-time reviews, and voice search capabilities.
          </motion.p>

          {/* Search Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto mb-8"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1">
                <AdvancedSearch
                  onSearch={handleSearch}
                  onFiltersChange={(filters) => console.log('Filters changed:', filters)}
                />
              </div>
              <VoiceSearchButton
                onResult={handleVoiceResult}
                onError={(error) => console.error('Voice search error:', error)}
                className="flex-shrink-0"
              />
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 mb-8"
          >
            <Link
              href="/discover"
              className="flex items-center gap-2 bg-[#33e0a1] text-[#121b22] px-6 py-3 rounded-xl font-medium hover:bg-[#2dd4bf] transition-colors"
            >
              <FiMapPin className="w-4 h-4" />
              Explore Chandigarh
            </Link>
            <button
              onClick={() => setShowRecommendations(!showRecommendations)}
              className="flex items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-xl font-medium hover:bg-white/20 transition-colors"
            >
              <FiStar className="w-4 h-4" />
              Get Recommendations
            </button>
            <Link
              href="/community"
              className="flex items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-xl font-medium hover:bg-white/20 transition-colors"
            >
              <FiUsers className="w-4 h-4" />
              Join Community
            </Link>
          </motion.div>

          {/* Location Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-md mx-auto mb-16"
          >
            <LocationDisplay />
          </motion.div>
        </div>
      </section>

      {/* AI Recommendations Section */}
      {showRecommendations && (
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <h2 className="text-3xl font-bold text-center mb-12">
                Personalized Recommendations
              </h2>
              <SmartRecommendations />
            </motion.div>
          </div>
        </section>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Search Results ({searchResults.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((restaurant) => (
                <RestaurantCard key={restaurant._id} restaurant={restaurant} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Restaurants */}
      {featuredRestaurants.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-center mb-12"
            >
              Featured Restaurants
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredRestaurants.map((restaurant, index) => (
                <motion.div
                  key={restaurant._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <RestaurantCard restaurant={restaurant} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Platform Statistics */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12"
          >
            Join Our Growing Community
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              icon={FiMapPin}
              value={stats.totalRestaurants?.toLocaleString() || "1,200+"}
              label="Restaurants Listed"
              trend="+15% this month"
            />
            <StatCard
              icon={FiStar}
              value={stats.totalReviews?.toLocaleString() || "8,500+"}
              label="Reviews Written"
              trend="+25% this month"
            />
            <StatCard
              icon={FiUsers}
              value={stats.activeUsers?.toLocaleString() || "2,300+"}
              label="Active Users"
              trend="+18% this month"
            />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-6"
          >
            Ready to Discover Your Next Favorite Restaurant?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-[#D0D0D0]/70 mb-8"
          >
            Join thousands of food lovers sharing their dining experiences
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link
              href="/signup"
              className="bg-[#33e0a1] text-[#121b22] px-8 py-4 rounded-xl font-medium text-lg hover:bg-[#2dd4bf] transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              href="/discover"
              className="bg-white/10 text-white px-8 py-4 rounded-xl font-medium text-lg hover:bg-white/20 transition-colors"
            >
              Explore Now
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}