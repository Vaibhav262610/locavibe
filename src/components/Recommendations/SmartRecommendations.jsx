import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiMapPin, FiClock, FiDollarSign, FiThumbsUp } from 'react-icons/fi';
import { chandigarhRestaurants } from '@/data/chandigarhRestaurants';

const SmartRecommendations = ({ userPreferences, userHistory }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('personalized');

  const categories = [
    { id: 'personalized', label: 'For You', description: 'Based on your taste' },
    { id: 'trending', label: 'Trending', description: 'Popular right now' },
    { id: 'nearby', label: 'Nearby', description: 'Close to you' },
    { id: 'new', label: 'New Places', description: 'Recently opened' }
  ];

  useEffect(() => {
    generateRecommendations();
  }, [selectedCategory, userPreferences]);

  const generateRecommendations = async () => {
    setLoading(true);
    
    // Simulate AI recommendation algorithm using Chandigarh restaurants
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const recommendations = {
      personalized: chandigarhRestaurants
        .filter(r => r.rating >= 4.2)
        .slice(0, 3)
        .map(restaurant => ({
          ...restaurant,
          matchScore: Math.floor(Math.random() * 20) + 80,
          reasons: [
            "Highly rated in your preferred area",
            "Similar to places you've liked",
            "Great reviews for " + restaurant.specialties[0]
          ]
        })),
      
      trending: chandigarhRestaurants
        .filter(r => r.reviewCount > 1000)
        .slice(0, 3)
        .map(restaurant => ({
          ...restaurant,
          trendScore: Math.floor(Math.random() * 20) + 85,
          reasons: [
            "Trending in Chandigarh",
            "Popular among locals",
            "Recently featured in reviews"
          ]
        })),
      
      nearby: chandigarhRestaurants
        .slice(0, 3)
        .map(restaurant => ({
          ...restaurant,
          reasons: [
            "Close to your location",
            "Quick delivery available",
            "Convenient location"
          ]
        })),
      
      new: chandigarhRestaurants
        .filter(r => r.rating >= 4.0)
        .slice(3, 6)
        .map(restaurant => ({
          ...restaurant,
          openedDate: "2024-01-15",
          reasons: [
            "Recently opened",
            "Fresh concept in the area",
            "Getting great early reviews"
          ]
        }))
    };

    setRecommendations(recommendations[selectedCategory] || []);
    setLoading(false);
  };

  const RecommendationCard = ({ restaurant }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300"
    >
      {/* Restaurant Image */}
      <div className="relative h-48 bg-gradient-to-br from-[#33e0a1]/20 to-[#33e0a1]/5">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[#33e0a1] text-sm">Restaurant Image</span>
        </div>
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
            restaurant.openNow 
              ? 'bg-[#33e0a1] text-[#121b22]' 
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            {restaurant.openNow ? 'Open Now' : 'Closed'}
          </span>
        </div>

        {/* Match Score */}
        {restaurant.matchScore && (
          <div className="absolute top-3 right-3 bg-[#33e0a1] text-[#121b22] px-2 py-1 rounded-lg text-xs font-bold">
            {restaurant.matchScore}% Match
          </div>
        )}
      </div>

      <div className="p-6">
        {/* Restaurant Info */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-white mb-1">{restaurant.name}</h3>
          <p className="text-[#D0D0D0]/70 text-sm mb-2">{restaurant.cuisine}</p>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <FiStar className="w-4 h-4 text-yellow-400" />
              <span className="text-white">{restaurant.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <FiDollarSign className="w-4 h-4 text-[#33e0a1]" />
              <span className="text-white">{'$'.repeat(restaurant.priceRange)}</span>
            </div>
            <div className="flex items-center gap-1">
              <FiMapPin className="w-4 h-4 text-[#D0D0D0]/70" />
              <span className="text-[#D0D0D0]/70">{restaurant.distance}</span>
            </div>
            <div className="flex items-center gap-1">
              <FiClock className="w-4 h-4 text-[#D0D0D0]/70" />
              <span className="text-[#D0D0D0]/70">{restaurant.estimatedTime}</span>
            </div>
          </div>
        </div>

        {/* Specialties */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {restaurant.specialties?.map((specialty, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-white/10 text-[#D0D0D0] text-xs rounded-lg"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>

        {/* Recommendation Reasons */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-[#33e0a1] mb-2">Why we recommend this:</h4>
          <ul className="space-y-1">
            {restaurant.reasons?.slice(0, 2).map((reason, index) => (
              <li key={index} className="text-xs text-[#D0D0D0]/70 flex items-center gap-2">
                <div className="w-1 h-1 bg-[#33e0a1] rounded-full" />
                {reason}
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button className="flex-1 bg-[#33e0a1] text-[#121b22] py-2 px-4 rounded-lg text-sm font-medium hover:bg-[#2dd4bf] transition-colors">
            View Details
          </button>
          <button className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
            <FiThumbsUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Category Selector */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedCategory === category.id
                ? 'bg-[#33e0a1] text-[#121b22]'
                : 'bg-white/10 text-[#D0D0D0] hover:bg-white/20'
            }`}
          >
            <div className="text-center">
              <div>{category.label}</div>
              <div className="text-xs opacity-70">{category.description}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Recommendations Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/5 rounded-2xl p-6 animate-pulse">
              <div className="h-48 bg-white/10 rounded-xl mb-4" />
              <div className="h-4 bg-white/10 rounded mb-2" />
              <div className="h-3 bg-white/10 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((restaurant) => (
            <RecommendationCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && recommendations.length === 0 && (
        <div className="text-center py-12">
          <div className="text-[#D0D0D0]/50 mb-4">No recommendations available</div>
          <button 
            onClick={generateRecommendations}
            className="bg-[#33e0a1] text-[#121b22] px-6 py-2 rounded-lg font-medium hover:bg-[#2dd4bf] transition-colors"
          >
            Refresh Recommendations
          </button>
        </div>
      )}
    </div>
  );
};

export default SmartRecommendations;