"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiMapPin, FiStar, FiFilter, FiGrid, FiList, FiMap, FiNavigation, FiRefreshCw } from "react-icons/fi";
import Navbar from "@/components/Navbar";
import AdvancedSearch from "@/components/Search/AdvancedSearch";
import RestaurantCard from "@/components/RestaurantCard";
import Loader from "@/components/ui/Loader";
import { chandigarhRestaurants, updateRestaurantDistances } from "@/data/chandigarhRestaurants";
import { useGeolocation } from "@/hooks/useGeolocation";

const DiscoverPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list', 'map'
  const [sortBy, setSortBy] = useState('distance');
  const [filters, setFilters] = useState({
    cuisine: [],
    priceRange: [1, 4],
    rating: 0,
    distance: 25,
    openNow: false,
    features: []
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Geolocation hook
  const { location: userLocation, error: locationError, loading: locationLoading, refreshLocation } = useGeolocation();

  useEffect(() => {
    fetchRestaurants();
  }, [filters, sortBy, currentPage, userLocation]);

  const fetchRestaurants = async (isNewSearch = false) => {
    try {
      if (isNewSearch) {
        setLoading(true);
        setCurrentPage(1);
      }

      // Use hardcoded Chandigarh restaurants
      let filteredRestaurants = [...chandigarhRestaurants];

      // Update distances based on user location
      if (userLocation) {
        filteredRestaurants = updateRestaurantDistances(filteredRestaurants, userLocation);
      }

      // Apply filters
      if (searchQuery) {
        filteredRestaurants = filteredRestaurants.filter(restaurant =>
          restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
          restaurant.specialties.some(specialty => 
            specialty.toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
      }

      if (filters.cuisine.length > 0) {
        filteredRestaurants = filteredRestaurants.filter(restaurant =>
          filters.cuisine.includes(restaurant.cuisine)
        );
      }

      if (filters.rating > 0) {
        filteredRestaurants = filteredRestaurants.filter(restaurant =>
          restaurant.rating >= filters.rating
        );
      }

      if (filters.priceRange[0] > 1 || filters.priceRange[1] < 4) {
        filteredRestaurants = filteredRestaurants.filter(restaurant =>
          restaurant.priceRange >= filters.priceRange[0] && 
          restaurant.priceRange <= filters.priceRange[1]
        );
      }

      if (filters.openNow) {
        filteredRestaurants = filteredRestaurants.filter(restaurant =>
          restaurant.openNow
        );
      }

      if (filters.features.length > 0) {
        filteredRestaurants = filteredRestaurants.filter(restaurant =>
          filters.features.some(feature => restaurant.features.includes(feature))
        );
      }

      // Apply sorting
      switch (sortBy) {
        case 'rating':
          filteredRestaurants.sort((a, b) => b.rating - a.rating);
          break;
        case 'distance':
          if (userLocation) {
            filteredRestaurants.sort((a, b) => (a.actualDistance || 0) - (b.actualDistance || 0));
          }
          break;
        case 'price_low':
          filteredRestaurants.sort((a, b) => a.priceRange - b.priceRange);
          break;
        case 'price_high':
          filteredRestaurants.sort((a, b) => b.priceRange - a.priceRange);
          break;
        case 'popular':
          filteredRestaurants.sort((a, b) => b.reviewCount - a.reviewCount);
          break;
        default:
          break;
      }

      // Pagination simulation
      const itemsPerPage = 12;
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedResults = filteredRestaurants.slice(0, endIndex);

      if (isNewSearch || currentPage === 1) {
        setRestaurants(paginatedResults);
      } else {
        setRestaurants(prev => [...prev, ...filteredRestaurants.slice(startIndex, endIndex)]);
      }
      
      setTotalResults(filteredRestaurants.length);
      setHasMore(endIndex < filteredRestaurants.length);
      
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query, newFilters) => {
    setSearchQuery(query);
    setFilters(newFilters);
    fetchRestaurants(true);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const ViewToggle = () => (
    <div className="flex items-center gap-2 bg-white/10 rounded-xl p-1">
      {[
        { mode: 'grid', icon: FiGrid, label: 'Grid' },
        { mode: 'list', icon: FiList, label: 'List' },
        { mode: 'map', icon: FiMap, label: 'Map' }
      ].map(({ mode, icon: Icon, label }) => (
        <button
          key={mode}
          onClick={() => setViewMode(mode)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            viewMode === mode
              ? 'bg-[#33e0a1] text-[#121b22]'
              : 'text-[#D0D0D0] hover:bg-white/10'
          }`}
        >
          <Icon className="w-4 h-4" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );

  const SortDropdown = () => (
    <select
      value={sortBy}
      onChange={(e) => handleSortChange(e.target.value)}
      className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#33e0a1]"
    >
      <option value="distance" className="bg-[#121b22]">Nearest First</option>
      <option value="rating" className="bg-[#121b22]">Highest Rated</option>
      <option value="price_low" className="bg-[#121b22]">Price: Low to High</option>
      <option value="price_high" className="bg-[#121b22]">Price: High to Low</option>
      <option value="popular" className="bg-[#121b22]">Most Popular</option>
    </select>
  );

  const LocationStatus = () => (
    <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 mb-6">
      <FiNavigation className={`w-5 h-5 ${userLocation ? 'text-[#33e0a1]' : 'text-red-400'}`} />
      <div className="flex-1">
        {locationLoading ? (
          <span className="text-[#D0D0D0]/70">Getting your location...</span>
        ) : userLocation ? (
          <span className="text-[#33e0a1]">
            Location detected • Showing restaurants near you in Chandigarh
          </span>
        ) : (
          <span className="text-red-400">
            {locationError || 'Location access denied • Showing all restaurants'}
          </span>
        )}
      </div>
      <button
        onClick={refreshLocation}
        className="p-2 text-[#D0D0D0] hover:text-[#33e0a1] hover:bg-white/10 rounded-lg transition-all"
        disabled={locationLoading}
      >
        <FiRefreshCw className={`w-4 h-4 ${locationLoading ? 'animate-spin' : ''}`} />
      </button>
    </div>
  );

  const RestaurantGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {restaurants.map((restaurant, index) => (
        <motion.div
          key={restaurant._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <RestaurantCard
            restaurant={restaurant}
            onSave={(id, saved) => console.log('Save restaurant:', id, saved)}
            onShare={(restaurant) => console.log('Share restaurant:', restaurant)}
            onViewDetails={(restaurant) => console.log('View details:', restaurant)}
          />
        </motion.div>
      ))}
    </div>
  );

  const RestaurantList = () => (
    <div className="space-y-4">
      {restaurants.map((restaurant, index) => (
        <motion.div
          key={restaurant._id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <RestaurantCard
            restaurant={restaurant}
            variant="compact"
            onSave={(id, saved) => console.log('Save restaurant:', id, saved)}
            onShare={(restaurant) => console.log('Share restaurant:', restaurant)}
            onViewDetails={(restaurant) => console.log('View details:', restaurant)}
          />
        </motion.div>
      ))}
    </div>
  );

  const MapView = () => (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
      <FiMap className="w-16 h-16 text-[#33e0a1] mx-auto mb-4" />
      <h3 className="text-xl font-bold text-white mb-2">Interactive Map View</h3>
      <p className="text-[#D0D0D0]/70 mb-4">
        See all {totalResults} restaurants in Chandigarh on an interactive map
      </p>
      {userLocation && (
        <div className="bg-white/5 rounded-xl p-4 mb-4">
          <p className="text-[#33e0a1] text-sm">
            📍 Your Location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
          </p>
          <p className="text-[#D0D0D0]/50 text-xs mt-1">
            Accuracy: ±{userLocation.accuracy}m
          </p>
        </div>
      )}
      <p className="text-[#D0D0D0]/50 text-sm">
        Interactive map with restaurant locations will be available in the next update.
      </p>
    </div>
  );

  if (loading && restaurants.length === 0) {
    return <Loader message="Discovering amazing restaurants in Chandigarh..." />;
  }

  return (
    <>
      <div className="w-full flex justify-center items-center bg-[#121b22]">
        <div className="w-full md:w-[65%]">
          <Navbar />
        </div>
      </div>

      <div className="min-h-screen bg-[#121b22] text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-white mb-2">
              Discover Restaurants in Chandigarh
            </h1>
            <p className="text-[#D0D0D0]/70">
              Find your next favorite dining spot from {totalResults.toLocaleString()} restaurants
            </p>
          </motion.div>

          {/* Location Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <LocationStatus />
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <AdvancedSearch
              onSearch={handleSearch}
              onFiltersChange={handleFiltersChange}
            />
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
          >
            <div className="flex items-center gap-4">
              <span className="text-[#D0D0D0]/70 text-sm">
                {totalResults.toLocaleString()} restaurants found
              </span>
              {searchQuery && (
                <span className="text-[#33e0a1] text-sm">
                  for "{searchQuery}"
                </span>
              )}
              {userLocation && (
                <span className="text-[#33e0a1] text-sm">
                  📍 Near you
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <SortDropdown />
              <ViewToggle />
            </div>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {restaurants.length > 0 ? (
              <>
                {viewMode === 'grid' && <RestaurantGrid />}
                {viewMode === 'list' && <RestaurantList />}
                {viewMode === 'map' && <MapView />}

                {/* Load More Button */}
                {hasMore && viewMode !== 'map' && (
                  <div className="text-center mt-12">
                    <button
                      onClick={loadMore}
                      disabled={loading}
                      className="bg-[#33e0a1] text-[#121b22] px-8 py-3 rounded-xl font-medium hover:bg-[#2dd4bf] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Loading...' : 'Load More Restaurants'}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <FiMapPin className="w-16 h-16 text-[#D0D0D0]/30 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-[#D0D0D0]/70 mb-4">
                  No restaurants found
                </h3>
                <p className="text-[#D0D0D0]/50 mb-8 max-w-md mx-auto">
                  Try adjusting your search criteria or filters to find more restaurants in Chandigarh.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilters({
                      cuisine: [],
                      priceRange: [1, 4],
                      rating: 0,
                      distance: 25,
                      openNow: false,
                      features: []
                    });
                    fetchRestaurants(true);
                  }}
                  className="bg-[#33e0a1] text-[#121b22] px-6 py-3 rounded-xl font-medium hover:bg-[#2dd4bf] transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default DiscoverPage;