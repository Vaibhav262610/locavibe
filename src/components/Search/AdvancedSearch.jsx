import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiFilter, FiMapPin, FiStar, FiDollarSign, FiClock, FiX } from 'react-icons/fi';

const AdvancedSearch = ({ onSearch, onFiltersChange }) => {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    cuisine: [],
    priceRange: [1, 4],
    rating: 0,
    distance: 10,
    openNow: false,
    features: [],
    sortBy: 'relevance'
  });

  const cuisineOptions = [
    'Italian', 'Chinese', 'Japanese', 'Mexican', 'Indian', 'Thai', 'French', 
    'American', 'Mediterranean', 'Korean', 'Vietnamese', 'Greek', 'Spanish'
  ];

  const featureOptions = [
    'Outdoor Seating', 'Delivery', 'Takeout', 'Reservations', 'Parking', 
    'WiFi', 'Live Music', 'Pet Friendly', 'Wheelchair Accessible', 'Bar'
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'distance', label: 'Nearest' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest' }
  ];

  useEffect(() => {
    onFiltersChange?.(filters);
  }, [filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch?.(query, filters);
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleCuisine = (cuisine) => {
    setFilters(prev => ({
      ...prev,
      cuisine: prev.cuisine.includes(cuisine)
        ? prev.cuisine.filter(c => c !== cuisine)
        : [...prev.cuisine, cuisine]
    }));
  };

  const toggleFeature = (feature) => {
    setFilters(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const clearFilters = () => {
    setFilters({
      cuisine: [],
      priceRange: [1, 4],
      rating: 0,
      distance: 10,
      openNow: false,
      features: [],
      sortBy: 'relevance'
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.cuisine.length > 0) count++;
    if (filters.rating > 0) count++;
    if (filters.distance < 10) count++;
    if (filters.openNow) count++;
    if (filters.features.length > 0) count++;
    if (filters.priceRange[0] > 1 || filters.priceRange[1] < 4) count++;
    return count;
  };

  const RangeSlider = ({ min, max, value, onChange, step = 1, label, unit = '' }) => (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-[#D0D0D0]/70">{label}</span>
        <span className="text-[#33e0a1]">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
      />
      <div className="flex justify-between text-xs text-[#D0D0D0]/50">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );

  const PriceRangeSlider = ({ value, onChange }) => (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-[#D0D0D0]/70">Price Range</span>
        <span className="text-[#33e0a1]">
          {'$'.repeat(value[0])} - {'$'.repeat(value[1])}
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={1}
          max={4}
          value={value[0]}
          onChange={(e) => onChange([Number(e.target.value), value[1]])}
          className="absolute w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
        />
        <input
          type="range"
          min={1}
          max={4}
          value={value[1]}
          onChange={(e) => onChange([value[0], Number(e.target.value)])}
          className="absolute w-full h-2 bg-transparent rounded-lg appearance-none cursor-pointer slider"
        />
      </div>
      <div className="flex justify-between text-xs text-[#D0D0D0]/50">
        <span>$</span>
        <span>$$$$</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#D0D0D0]/50 w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search restaurants, cuisines, or dishes..."
            className="w-full pl-12 pr-20 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-[#D0D0D0]/50 focus:outline-none focus:border-[#33e0a1] focus:bg-white/15 transition-all"
          />
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
              showFilters || getActiveFiltersCount() > 0
                ? 'bg-[#33e0a1] text-[#121b22]'
                : 'bg-white/20 text-[#D0D0D0] hover:bg-white/30'
            }`}
          >
            <FiFilter className="w-4 h-4" />
            {getActiveFiltersCount() > 0 && (
              <span className="text-xs font-medium">{getActiveFiltersCount()}</span>
            )}
          </button>
        </div>
      </form>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-6"
          >
            {/* Filter Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Advanced Filters</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearFilters}
                  className="text-[#D0D0D0]/70 hover:text-[#33e0a1] text-sm transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-1 text-[#D0D0D0]/70 hover:text-white transition-colors"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Left Column */}
              <div className="space-y-6">
                
                {/* Cuisine Types */}
                <div>
                  <h4 className="text-sm font-medium text-white mb-3">Cuisine Type</h4>
                  <div className="flex flex-wrap gap-2">
                    {cuisineOptions.map((cuisine) => (
                      <button
                        key={cuisine}
                        onClick={() => toggleCuisine(cuisine)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                          filters.cuisine.includes(cuisine)
                            ? 'bg-[#33e0a1] text-[#121b22]'
                            : 'bg-white/10 text-[#D0D0D0] hover:bg-white/20'
                        }`}
                      >
                        {cuisine}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <PriceRangeSlider
                  value={filters.priceRange}
                  onChange={(value) => updateFilter('priceRange', value)}
                />

                {/* Rating */}
                <RangeSlider
                  min={0}
                  max={5}
                  value={filters.rating}
                  onChange={(value) => updateFilter('rating', value)}
                  step={0.5}
                  label="Minimum Rating"
                  unit="★"
                />
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                
                {/* Distance */}
                <RangeSlider
                  min={1}
                  max={25}
                  value={filters.distance}
                  onChange={(value) => updateFilter('distance', value)}
                  label="Maximum Distance"
                  unit=" km"
                />

                {/* Features */}
                <div>
                  <h4 className="text-sm font-medium text-white mb-3">Features</h4>
                  <div className="space-y-2">
                    {featureOptions.map((feature) => (
                      <label key={feature} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.features.includes(feature)}
                          onChange={() => toggleFeature(feature)}
                          className="w-4 h-4 text-[#33e0a1] bg-transparent border-white/30 rounded focus:ring-[#33e0a1]"
                        />
                        <span className="text-sm text-[#D0D0D0]">{feature}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Open Now */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.openNow}
                    onChange={(e) => updateFilter('openNow', e.target.checked)}
                    className="w-4 h-4 text-[#33e0a1] bg-transparent border-white/30 rounded focus:ring-[#33e0a1]"
                  />
                  <span className="text-sm text-white">Open Now</span>
                </label>
              </div>
            </div>

            {/* Sort By */}
            <div>
              <h4 className="text-sm font-medium text-white mb-3">Sort By</h4>
              <select
                value={filters.sortBy}
                onChange={(e) => updateFilter('sortBy', e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#33e0a1]"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-[#121b22]">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Apply Filters Button */}
            <button
              onClick={() => {
                onSearch?.(query, filters);
                setShowFilters(false);
              }}
              className="w-full bg-[#33e0a1] text-[#121b22] py-3 rounded-xl font-medium hover:bg-[#2dd4bf] transition-colors"
            >
              Apply Filters
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters Display */}
      {getActiveFiltersCount() > 0 && !showFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.cuisine.map((cuisine) => (
            <span
              key={cuisine}
              className="flex items-center gap-1 px-2 py-1 bg-[#33e0a1]/20 text-[#33e0a1] text-xs rounded-lg"
            >
              {cuisine}
              <button onClick={() => toggleCuisine(cuisine)}>
                <FiX className="w-3 h-3" />
              </button>
            </span>
          ))}
          {filters.rating > 0 && (
            <span className="flex items-center gap-1 px-2 py-1 bg-[#33e0a1]/20 text-[#33e0a1] text-xs rounded-lg">
              {filters.rating}★+
              <button onClick={() => updateFilter('rating', 0)}>
                <FiX className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.openNow && (
            <span className="flex items-center gap-1 px-2 py-1 bg-[#33e0a1]/20 text-[#33e0a1] text-xs rounded-lg">
              Open Now
              <button onClick={() => updateFilter('openNow', false)}>
                <FiX className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;