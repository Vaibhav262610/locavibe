import React from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiNavigation, FiRefreshCw } from 'react-icons/fi';
import { useGeolocation } from '@/hooks/useGeolocation';

const LocationDisplay = ({ className = '', showRefresh = true, compact = false }) => {
  const { location, error, loading, refreshLocation } = useGeolocation();

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <FiMapPin className={`w-4 h-4 ${location ? 'text-[#33e0a1]' : 'text-red-400'}`} />
        {loading ? (
          <span className="text-[#D0D0D0]/70 text-sm">Getting location...</span>
        ) : location ? (
          <span className="text-[#33e0a1] text-sm">Chandigarh</span>
        ) : (
          <span className="text-red-400 text-sm">Location unavailable</span>
        )}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FiNavigation className={`w-5 h-5 ${location ? 'text-[#33e0a1]' : 'text-red-400'}`} />
          <div>
            {loading ? (
              <div>
                <div className="text-[#D0D0D0]/70 text-sm">Getting your location...</div>
                <div className="text-[#D0D0D0]/50 text-xs">Please allow location access</div>
              </div>
            ) : location ? (
              <div>
                <div className="text-[#33e0a1] font-medium">Location detected</div>
                <div className="text-[#D0D0D0]/70 text-sm">
                  Chandigarh • Accuracy: ±{location.accuracy}m
                </div>
                <div className="text-[#D0D0D0]/50 text-xs">
                  {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </div>
              </div>
            ) : (
              <div>
                <div className="text-red-400 font-medium">Location unavailable</div>
                <div className="text-[#D0D0D0]/70 text-sm">
                  {error || 'Unable to get your location'}
                </div>
                <div className="text-[#D0D0D0]/50 text-xs">
                  Showing all restaurants in Chandigarh
                </div>
              </div>
            )}
          </div>
        </div>
        
        {showRefresh && (
          <button
            onClick={refreshLocation}
            className="p-2 text-[#D0D0D0] hover:text-[#33e0a1] hover:bg-white/10 rounded-lg transition-all"
            disabled={loading}
            title="Refresh location"
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>
      
      {location && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="text-[#33e0a1] text-xs">
            ✓ Showing restaurants sorted by distance from your location
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default LocationDisplay;