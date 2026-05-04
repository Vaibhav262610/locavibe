import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ReviewAnalytics = ({ userId }) => {
  const [analyticsData, setAnalyticsData] = useState({
    reviewTrends: [],
    ratingDistribution: [],
    cuisinePreferences: [],
    monthlyStats: []
  });
  const [timeframe, setTimeframe] = useState('30d');

  useEffect(() => {
    // Generate mock analytics data
    const generateMockData = () => {
      const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
      const reviewTrends = [];
      const monthlyStats = [];
      
      for (let i = days - 1; i >= 0; i--) {
        const date = subDays(new Date(), i);
        reviewTrends.push({
          date: format(date, 'MMM dd'),
          reviews: Math.floor(Math.random() * 5),
          likes: Math.floor(Math.random() * 15)
        });
      }

      // Generate monthly stats for the last 6 months
      for (let i = 5; i >= 0; i--) {
        const date = subDays(new Date(), i * 30);
        monthlyStats.push({
          month: format(date, 'MMM'),
          reviews: Math.floor(Math.random() * 20) + 5,
          avgRating: (Math.random() * 2 + 3).toFixed(1)
        });
      }

      setAnalyticsData({
        reviewTrends,
        monthlyStats,
        ratingDistribution: [
          { rating: '5 Stars', count: 12, percentage: 40 },
          { rating: '4 Stars', count: 10, percentage: 33 },
          { rating: '3 Stars', count: 5, percentage: 17 },
          { rating: '2 Stars', count: 2, percentage: 7 },
          { rating: '1 Star', count: 1, percentage: 3 }
        ],
        cuisinePreferences: [
          { cuisine: 'Italian', count: 8, percentage: 27 },
          { cuisine: 'Asian', count: 7, percentage: 23 },
          { cuisine: 'American', count: 6, percentage: 20 },
          { cuisine: 'Mexican', count: 5, percentage: 17 },
          { cuisine: 'Others', count: 4, percentage: 13 }
        ]
      });
    };

    generateMockData();
  }, [userId, timeframe]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#D0D0D0',
          font: {
            size: 12
          }
        }
      }
    },
    scales: {
      x: {
        ticks: { 
          color: '#D0D0D0',
          font: { size: 11 }
        },
        grid: { 
          color: 'rgba(208, 208, 208, 0.1)',
          drawBorder: false
        }
      },
      y: {
        ticks: { 
          color: '#D0D0D0',
          font: { size: 11 }
        },
        grid: { 
          color: 'rgba(208, 208, 208, 0.1)',
          drawBorder: false
        }
      }
    }
  };

  const reviewTrendData = {
    labels: analyticsData.reviewTrends.map(item => item.date),
    datasets: [
      {
        label: 'Reviews',
        data: analyticsData.reviewTrends.map(item => item.reviews),
        borderColor: '#33e0a1',
        backgroundColor: 'rgba(51, 224, 161, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Likes Received',
        data: analyticsData.reviewTrends.map(item => item.likes),
        borderColor: '#FFD9C4',
        backgroundColor: 'rgba(255, 217, 196, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const ratingDistributionData = {
    labels: analyticsData.ratingDistribution.map(item => item.rating),
    datasets: [
      {
        data: analyticsData.ratingDistribution.map(item => item.count),
        backgroundColor: [
          '#33e0a1',
          '#2dd4bf',
          '#FFD9C4',
          '#fbbf24',
          '#f87171'
        ],
        borderWidth: 0
      }
    ]
  };

  const cuisinePreferenceData = {
    labels: analyticsData.cuisinePreferences.map(item => item.cuisine),
    datasets: [
      {
        data: analyticsData.cuisinePreferences.map(item => item.count),
        backgroundColor: [
          '#33e0a1',
          '#2dd4bf',
          '#FFD9C4',
          '#60a5fa',
          '#a78bfa'
        ],
        borderWidth: 0
      }
    ]
  };

  const monthlyStatsData = {
    labels: analyticsData.monthlyStats.map(item => item.month),
    datasets: [
      {
        label: 'Reviews Written',
        data: analyticsData.monthlyStats.map(item => item.reviews),
        backgroundColor: '#33e0a1',
        borderRadius: 8
      }
    ]
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#D0D0D0]">Analytics</h2>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="bg-[#121b22]/80 border border-[#D0D0D0]/20 rounded-lg px-4 py-2 text-[#D0D0D0] focus:outline-none focus:border-[#33e0a1]"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 3 months</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Reviews', value: '30', trend: '+15%', positive: true },
          { label: 'Avg Rating Given', value: '4.2', trend: '+0.3', positive: true },
          { label: 'Total Likes', value: '127', trend: '+23%', positive: true },
          { label: 'Response Rate', value: '89%', trend: '+5%', positive: true }
        ].map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#D0D0D0]/70 text-sm">{metric.label}</span>
              <span className={`text-xs ${metric.positive ? 'text-[#33e0a1]' : 'text-red-400'}`}>
                {metric.trend}
              </span>
            </div>
            <div className="text-2xl font-bold text-[#D0D0D0]">{metric.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Review Trends */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-[#D0D0D0] mb-4">Review Activity</h3>
          <div className="h-64">
            <Line data={reviewTrendData} options={chartOptions} />
          </div>
        </div>

        {/* Monthly Stats */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-[#D0D0D0] mb-4">Monthly Reviews</h3>
          <div className="h-64">
            <Bar data={monthlyStatsData} options={chartOptions} />
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-[#D0D0D0] mb-4">Rating Distribution</h3>
          <div className="h-64 flex items-center justify-center">
            <div className="w-48 h-48">
              <Doughnut 
                data={ratingDistributionData} 
                options={{
                  ...chartOptions,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        color: '#D0D0D0',
                        font: { size: 11 },
                        padding: 15
                      }
                    }
                  }
                }} 
              />
            </div>
          </div>
        </div>

        {/* Cuisine Preferences */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-[#D0D0D0] mb-4">Cuisine Preferences</h3>
          <div className="space-y-4">
            {analyticsData.cuisinePreferences.map((cuisine, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-[#D0D0D0]">{cuisine.cuisine}</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-[#D0D0D0]/20 rounded-full h-2">
                    <div 
                      className="bg-[#33e0a1] h-2 rounded-full transition-all duration-500"
                      style={{ width: `${cuisine.percentage}%` }}
                    />
                  </div>
                  <span className="text-[#D0D0D0]/70 text-sm w-8">{cuisine.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-[#D0D0D0] mb-4">Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#33e0a1] mb-2">4.2</div>
            <div className="text-[#D0D0D0]/70 text-sm">Average Rating You Give</div>
            <div className="text-xs text-[#D0D0D0]/50 mt-1">You're a generous reviewer!</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#FFD9C4] mb-2">Italian</div>
            <div className="text-[#D0D0D0]/70 text-sm">Most Reviewed Cuisine</div>
            <div className="text-xs text-[#D0D0D0]/50 mt-1">You love Italian food!</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#60a5fa] mb-2">Weekend</div>
            <div className="text-[#D0D0D0]/70 text-sm">Most Active Time</div>
            <div className="text-xs text-[#D0D0D0]/50 mt-1">Weekend foodie adventures!</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewAnalytics;