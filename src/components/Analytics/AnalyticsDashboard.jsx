import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiTrendingUp, 
  FiUsers, 
  FiStar, 
  FiMapPin, 
  FiCalendar,
  FiActivity,
  FiTarget,
  FiAward
} from 'react-icons/fi';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
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
  RadialLinearScale,
} from 'chart.js';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
);

const MetricCard = ({ title, value, change, icon: Icon, color = 'primary' }) => {
  const colorClasses = {
    primary: 'text-[#33e0a1]',
    secondary: 'text-[#FFD9C4]',
    success: 'text-green-400',
    warning: 'text-yellow-400',
    danger: 'text-red-400'
  };

  return (
    <Card variant="default" className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[#D0D0D0]/70 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-[#D0D0D0] mt-1">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              <FiTrendingUp className={`w-4 h-4 mr-1 ${change > 0 ? 'text-green-400' : 'text-red-400'}`} />
              <span className={`text-sm ${change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {change > 0 ? '+' : ''}{change}%
              </span>
              <span className="text-[#D0D0D0]/50 text-sm ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-current/10 ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
};

const AnalyticsDashboard = ({ userId, timeRange = '30d' }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock analytics data - replace with real API call
    const mockAnalytics = {
      overview: {
        totalReviews: 47,
        totalLikes: 234,
        profileViews: 1205,
        followersGained: 23,
        averageRating: 4.2,
        engagementRate: 8.5
      },
      trends: {
        reviewsOverTime: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Reviews',
            data: [5, 8, 12, 7, 15, 10],
            borderColor: '#33e0a1',
            backgroundColor: 'rgba(51, 224, 161, 0.1)',
            tension: 0.4
          }]
        },
        likesOverTime: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Likes Received',
            data: [25, 45, 60, 35, 80, 55],
            backgroundColor: '#FFD9C4'
          }]
        }
      },
      cuisinePreferences: {
        labels: ['Italian', 'Asian', 'Mexican', 'American', 'Mediterranean'],
        datasets: [{
          data: [30, 25, 20, 15, 10],
          backgroundColor: [
            '#33e0a1',
            '#FFD9C4',
            '#60a5fa',
            '#f87171',
            '#a78bfa'
          ]
        }]
      },
      skillRadar: {
        labels: ['Food Quality', 'Service', 'Ambiance', 'Value', 'Authenticity'],
        datasets: [{
          label: 'Review Focus Areas',
          data: [85, 70, 90, 75, 80],
          backgroundColor: 'rgba(51, 224, 161, 0.2)',
          borderColor: '#33e0a1',
          pointBackgroundColor: '#33e0a1'
        }]
      },
      achievements: [
        { title: 'Top Reviewer', description: 'Most reviews this month', icon: FiStar, earned: true },
        { title: 'Local Explorer', description: 'Reviewed 10+ different cuisines', icon: FiMapPin, earned: true },
        { title: 'Community Favorite', description: '100+ likes received', icon: FiUsers, earned: true },
        { title: 'Consistency King', description: 'Posted reviews 7 days in a row', icon: FiTarget, earned: false }
      ]
    };

    setTimeout(() => {
      setAnalytics(mockAnalytics);
      setLoading(false);
    }, 1000);
  }, [userId, timeRange]);

  if (loading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 6 }, (_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-4 bg-[#D0D0D0]/20 rounded w-1/4 mb-4"></div>
            <div className="h-8 bg-[#D0D0D0]/20 rounded w-1/2"></div>
          </Card>
        ))}
      </div>
    );
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#D0D0D0'
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#D0D0D0' },
        grid: { color: 'rgba(208, 208, 208, 0.1)' }
      },
      y: {
        ticks: { color: '#D0D0D0' },
        grid: { color: 'rgba(208, 208, 208, 0.1)' }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Total Reviews"
          value={analytics.overview.totalReviews}
          change={12}
          icon={FiStar}
          color="primary"
        />
        <MetricCard
          title="Total Likes"
          value={analytics.overview.totalLikes}
          change={8}
          icon={FiUsers}
          color="secondary"
        />
        <MetricCard
          title="Profile Views"
          value={analytics.overview.profileViews.toLocaleString()}
          change={15}
          icon={FiActivity}
          color="success"
        />
        <MetricCard
          title="New Followers"
          value={analytics.overview.followersGained}
          change={-3}
          icon={FiUsers}
          color="warning"
        />
        <MetricCard
          title="Avg Rating Given"
          value={analytics.overview.averageRating}
          change={5}
          icon={FiStar}
          color="primary"
        />
        <MetricCard
          title="Engagement Rate"
          value={`${analytics.overview.engagementRate}%`}
          change={2}
          icon={FiTrendingUp}
          color="success"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reviews Over Time */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-[#D0D0D0] mb-4">Reviews Over Time</h3>
          <Line data={analytics.trends.reviewsOverTime} options={chartOptions} />
        </Card>

        {/* Likes Over Time */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-[#D0D0D0] mb-4">Likes Received</h3>
          <Bar data={analytics.trends.likesOverTime} options={chartOptions} />
        </Card>
      </div>

      {/* Second Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cuisine Preferences */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-[#D0D0D0] mb-4">Cuisine Preferences</h3>
          <div className="w-64 h-64 mx-auto">
            <Doughnut 
              data={analytics.cuisinePreferences} 
              options={{
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: { color: '#D0D0D0' }
                  }
                }
              }} 
            />
          </div>
        </Card>

        {/* Review Focus Areas */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-[#D0D0D0] mb-4">Review Focus Areas</h3>
          <div className="w-64 h-64 mx-auto">
            <Radar 
              data={analytics.skillRadar}
              options={{
                plugins: {
                  legend: { display: false }
                },
                scales: {
                  r: {
                    ticks: { color: '#D0D0D0' },
                    grid: { color: 'rgba(208, 208, 208, 0.2)' },
                    pointLabels: { color: '#D0D0D0' }
                  }
                }
              }}
            />
          </div>
        </Card>
      </div>

      {/* Achievements */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-[#D0D0D0] mb-4 flex items-center gap-2">
          <FiAward className="w-5 h-5 text-[#33e0a1]" />
          Achievements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {analytics.achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                achievement.earned
                  ? 'border-[#33e0a1]/30 bg-[#33e0a1]/10'
                  : 'border-[#D0D0D0]/20 bg-[#D0D0D0]/5'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <achievement.icon 
                  className={`w-6 h-6 ${
                    achievement.earned ? 'text-[#33e0a1]' : 'text-[#D0D0D0]/50'
                  }`} 
                />
                <Badge 
                  variant={achievement.earned ? 'primary' : 'default'}
                  size="sm"
                >
                  {achievement.earned ? 'Earned' : 'Locked'}
                </Badge>
              </div>
              <h4 className={`font-semibold ${
                achievement.earned ? 'text-[#D0D0D0]' : 'text-[#D0D0D0]/50'
              }`}>
                {achievement.title}
              </h4>
              <p className={`text-sm ${
                achievement.earned ? 'text-[#D0D0D0]/70' : 'text-[#D0D0D0]/40'
              }`}>
                {achievement.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;