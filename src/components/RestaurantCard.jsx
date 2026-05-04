import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiMapPin, FiClock, FiDollarSign, FiHeart, FiShare2, FiEye, FiWifi, FiCar, FiMusic } from 'react-icons/fi';
import Link from 'next/link';

const RestaurantCard = ({ 
  restaurant, 
  variant = 'default', // 'default', 'compact', 'detailed'
  onSave, 
  onShare, 
  onViewDetails 
}) => {
  const [isSaved, setIsSaved] = useState(restaurant.isSaved || false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newSavedState = !isSaved;
    setIsSaved(newSavedState);
    onSave?.(restaurant._id, newSavedState);
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onShare?.(restaurant);
  };

  const handleViewDetails = () => {
    onViewDetails?.(restaurant);
  };

  const getFeatureIcon = (feature) => {
    const icons = {
      'WiFi': FiWifi,
      'Parking': FiCar,
      'Live Music': FiMusic,
      'Outdoor Seating': FiMapPin,
      'Delivery': FiClock,
      'Takeout': FiClock,
    };
    return icons[feature] || FiStar;
  };

  const formatDistance = (distance) => {
    if (typeof distance === 'string') return distance;
    return distance ? `${distance.toFixed(1)} km` : 'Distance N/A';
  };

  const formatPriceRange = (priceRange) => {
    return '$'.repeat(priceRange || 2);
  };

  if (variant === 'compact') {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all duration-300"
      >
        <div className="flex items-center gap-4">
          {/* Restaurant Image */}
          <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-xl">
            {restaurant.image ? (
              <img 
                src={restaurant.image} 
                alt={restaurant.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-br from-[#33e0a1]/20 to-[#33e0a1]/5 flex items-center justify-center" style={{ display: restaurant.image ? 'none' : 'flex' }}>
              <span className="text-[#33e0a1] text-xs">IMG</span>
            </div>
            {restaurant.openNow !== undefined && (
              <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                restaurant.openNow ? 'bg-[#33e0a1]' : 'bg-red-500'
              }`} />
            )}
          </div>

          {/* Restaurant Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white mb-1 truncate">
              {restaurant.name}
            </h3>
            <p className="text-[#D0D0D0]/70 text-sm mb-2">{restaurant.cuisine}</p>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <FiStar className="w-4 h-4 text-yellow-400" />
                <span className="text-white">{restaurant.rating || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-1">
                <FiDollarSign className="w-4 h-4 text-[#33e0a1]" />
                <span className="text-white">{formatPriceRange(restaurant.priceRange)}</span>
              </div>
              <div className="flex items-center gap-1">
                <FiMapPin className="w-4 h-4 text-[#D0D0D0]/70" />
                <span className="text-[#D0D0D0]/70">{formatDistance(restaurant.distance)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className={`p-2 rounded-lg transition-colors ${
                isSaved 
                  ? 'bg-red-500/20 text-red-400' 
                  : 'bg-white/10 text-[#D0D0D0] hover:bg-white/20'
              }`}
            >
              <FiHeart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleViewDetails}
              className="bg-[#33e0a1] text-[#121b22] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#2dd4bf] transition-colors"
            >
              View
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Default card variant
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 group"
    >
      {/* Restaurant Image */}
      <div className="relative h-48 bg-gradient-to-br from-[#33e0a1]/20 to-[#33e0a1]/5 overflow-hidden">
        {restaurant.image ? (
          <img 
            src={restaurant.image} 
            alt={restaurant.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#33e0a1]/20 to-[#33e0a1]/5" style={{ display: restaurant.image ? 'none' : 'flex' }}>
          <span className="text-[#33e0a1] text-sm">Restaurant Image</span>
        </div>
        
        {/* Status Badge */}
        {restaurant.openNow !== undefined && (
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
              restaurant.openNow 
                ? 'bg-[#33e0a1] text-[#121b22]' 
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {restaurant.openNow ? 'Open Now' : 'Closed'}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleSave}
            className={`p-2 rounded-lg backdrop-blur-sm transition-all ${
              isSaved 
                ? 'bg-red-500/80 text-white' 
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <FiHeart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleShare}
            className="p-2 bg-white/20 text-white rounded-lg backdrop-blur-sm hover:bg-white/30 transition-colors"
          >
            <FiShare2 className="w-4 h-4" />
          </button>
        </div>

        {/* Match Score or Special Badge */}
        {restaurant.matchScore && (
          <div className="absolute bottom-3 left-3 bg-[#33e0a1] text-[#121b22] px-2 py-1 rounded-lg text-xs font-bold">
            {restaurant.matchScore}% Match
          </div>
        )}
      </div>

      <div className="p-6">
        {/* Restaurant Info */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-white mb-1">{restaurant.name}</h3>
          <p className="text-[#D0D0D0]/70 text-sm mb-3">{restaurant.cuisine}</p>
          
          <div className="flex items-center gap-4 text-sm mb-3">
            <div className="flex items-center gap-1">
              <FiStar className="w-4 h-4 text-yellow-400" />
              <span className="text-white">{restaurant.rating || 'N/A'}</span>
              {restaurant.reviewCount && (
                <span className="text-[#D0D0D0]/50">({restaurant.reviewCount})</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <FiDollarSign className="w-4 h-4 text-[#33e0a1]" />
              <span className="text-white">{formatPriceRange(restaurant.priceRange)}</span>
            </div>
            <div className="flex items-center gap-1">
              <FiMapPin className="w-4 h-4 text-[#D0D0D0]/70" />
              <span className="text-[#D0D0D0]/70">{formatDistance(restaurant.distance)}</span>
            </div>
          </div>

          {/* Address */}
          {restaurant.address && (
            <p className="text-[#D0D0D0]/50 text-xs mb-3">{restaurant.address}</p>
          )}
        </div>

        {/* Features/Specialties */}
        {(restaurant.features || restaurant.specialties) && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {(restaurant.features || restaurant.specialties || []).slice(0, 3).map((feature, index) => {
                const Icon = getFeatureIcon(feature);
                return (
                  <span 
                    key={index}
                    className="flex items-center gap-1 px-2 py-1 bg-white/10 text-[#D0D0D0] text-xs rounded-lg"
                  >
                    <Icon className="w-3 h-3" />
                    {feature}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Recommendation Reasons */}
        {restaurant.reasons && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-[#33e0a1] mb-2">Why recommended:</h4>
            <ul className="space-y-1">
              {restaurant.reasons.slice(0, 2).map((reason, index) => (
                <li key={index} className="text-xs text-[#D0D0D0]/70 flex items-center gap-2">
                  <div className="w-1 h-1 bg-[#33e0a1] rounded-full" />
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleViewDetails}
            className="flex-1 bg-[#33e0a1] text-[#121b22] py-2 px-4 rounded-lg text-sm font-medium hover:bg-[#2dd4bf] transition-colors"
          >
            View Details
          </button>
          <Link
            href={`/write-review?restaurant=${restaurant._id}`}
            className="flex items-center justify-center gap-1 bg-white/10 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors"
          >
            <FiStar className="w-4 h-4" />
            Review
          </Link>
        </div>

        {/* Estimated Time */}
        {restaurant.estimatedTime && (
          <div className="mt-3 pt-3 border-t border-white/10">
            <div className="flex items-center justify-between text-xs text-[#D0D0D0]/50">
              <span>Estimated delivery time</span>
              <span className="text-[#33e0a1]">{restaurant.estimatedTime}</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RestaurantCard;