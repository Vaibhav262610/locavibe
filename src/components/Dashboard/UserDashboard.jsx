import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiTrendingUp, FiMapPin, FiClock } from 'react-icons/fi';

const UserDashboard = ({ userId }) => {
  const [dashboardData, setDashboardData] = useState({
    monthlyStats: [],
    topCuisines: [],
    recentTrends: [],
    activityHeatmap: []
  });

  useEffect(() => {
    // Mock data - in real app, fetch from API
    setDashboardData({
      monthlyStats: [
        { month: 'Jan', reviews: 5, restaurants: 4 },
        { month: 'Feb', reviews: 8, restaurants: 6 },
        { month: 'Mar', reviews: 12, restaurants: 9 },
        { month: 'Apr', reviews: 7, restaurants: 5 },
        { month: 'May', reviews: 15, restaurants: 11 },
        { month: 'Jun', reviews: 10, restaurants: 8 }
      ],
      topCuisines: [
        { name: 'Italian', count: 12, percentage: 35 },
        { name: 'Asian', count: 8, percentage: 24 },
        { name: 'Mexican', count: 6, percentage: 18 },
        { name: 'American', count: 5, percentage: 15 },
        { name: 'Mediterranean', count: 3, percentage: 8 }
      ],
      recentTrends: [
        { period: 'This Week', reviews: 3, change: '+50%' },
        { period: 'This Month', reviews: 12, change: '+20%' },
        { period: 'Last 3 Months', reviews: 34, change: '+15%' }
      ]
    });
  }, [userId]);

  const ActivityChart = ({ data }) => (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={index} className="flex items-center justify-between">
          <span className="text-sm text-[#D0D0D0]/70">{item.month}</span>
          <div className="flex items-center gap-4 flex-1 mx-4">
            <div className="flex-1 bg-white/10 rounded-full h-2">
              <div 
                className="bg-[#33e0a1] h-2 rounded-full transition-all duration-500"
                style={{ width: `${(item.reviews / 15) * 100}%` }}
              />
            </div>
            <span className="text-sm text-white w-8">{item.reviews}</span>
          </div>
        </div>
      ))}
    </div>
  );

  const CuisineChart = ({ data }) => (
    <div className="space-y-3">
      {data.map((cuisine, index) => (
        <div key={index} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: `hsl(${index * 60}, 70%, 60%)` }}
            />
            <span className="text-sm text-white">{cuisine.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#D0D0D0]/70">{cuisine.count}</span>
            <span className="text-xs text-[#33e0a1]">{cuisine.percentage}%</span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Monthly Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <FiCalendar className="w-5 h-5 text-[#33e0a1]" />
          <h3 className="text-lg font-bold text-white">Monthly Activity</h3>
        </div>
        <ActivityChart data={dashboardData.monthlyStats} />
      </motion.div>

      {/* Cuisine Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <FiMapPin className="w-5 h-5 text-[#33e0a1]" />
          <h3 className="text-lg font-bold text-white">Favorite Cuisines</h3>
        </div>
        <CuisineChart data={dashboardData.topCuisines} />
      </motion.div>

      {/* Recent Trends */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <FiTrendingUp className="w-5 h-5 text-[#33e0a1]" />
          <h3 className="text-lg font-bold text-white">Activity Trends</h3>
        </div>
        <div className="space-y-4">
          {dashboardData.recentTrends.map((trend, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
              <div>
                <p className="text-white font-medium">{trend.period}</p>
                <p className="text-[#D0D0D0]/70 text-sm">{trend.reviews} reviews</p>
              </div>
              <span className="text-[#33e0a1] text-sm font-medium">{trend.change}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Activity Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <FiClock className="w-5 h-5 text-[#33e0a1]" />
          <h3 className="text-lg font-bold text-white">Review Timeline</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#D0D0D0]/70">Most Active Day</span>
            <span className="text-white">Saturday</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#D0D0D0]/70">Preferred Time</span>
            <span className="text-white">Evening (6-9 PM)</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#D0D0D0]/70">Average Rating</span>
            <span className="text-[#33e0a1]">4.2 ★</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#D0D0D0]/70">Review Length</span>
            <span className="text-white">142 words avg</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserDashboard;