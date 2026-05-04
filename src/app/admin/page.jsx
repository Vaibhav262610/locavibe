"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FiUsers, 
  FiStar, 
  FiMapPin, 
  FiTrendingUp, 
  FiActivity, 
  FiSettings,
  FiDatabase,
  FiZap,
  FiMonitor,
  FiWifi,
  FiShield
} from "react-icons/fi";
import Navbar from "@/components/Navbar";
import AnalyticsDashboard from "@/components/Analytics/AnalyticsDashboard";
import Restaurant3DView from "@/components/3D/Restaurant3DView";
import { performanceMonitor } from "@/lib/performance";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [systemStats, setSystemStats] = useState({
    totalUsers: 2347,
    totalRestaurants: 1205,
    totalReviews: 8934,
    activeConnections: 156,
    serverUptime: '99.9%',
    avgResponseTime: '245ms',
    errorRate: '0.02%',
    memoryUsage: '68%'
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState({});

  useEffect(() => {
    // Track admin page view
    performanceMonitor.trackInteraction('admin_page_view', 'admin');
    
    // Fetch admin data
    fetchAdminData();
    
    // Set up real-time updates
    const interval = setInterval(fetchRealTimeData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchAdminData = async () => {
    try {
      // Simulate fetching admin data
      const mockActivity = [
        { id: 1, type: 'user_signup', user: 'john_doe', timestamp: new Date(), details: 'New user registration' },
        { id: 2, type: 'review_posted', user: 'jane_smith', timestamp: new Date(), details: 'Posted review for "Pasta Palace"' },
        { id: 3, type: 'restaurant_added', user: 'admin', timestamp: new Date(), details: 'Added "Sushi Zen" to database' },
        { id: 4, type: 'ai_recommendation', user: 'system', timestamp: new Date(), details: 'Generated 150 AI recommendations' },
        { id: 5, type: 'websocket_connection', user: 'system', timestamp: new Date(), details: '25 new WebSocket connections' }
      ];
      
      setRecentActivity(mockActivity);
      
      // Get performance metrics
      const metrics = performanceMonitor.getPerformanceSummary();
      setPerformanceMetrics(metrics);
      
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };

  const fetchRealTimeData = async () => {
    try {
      // Simulate real-time data updates
      setSystemStats(prev => ({
        ...prev,
        activeConnections: Math.floor(Math.random() * 50) + 120,
        avgResponseTime: `${Math.floor(Math.random() * 100) + 200}ms`,
        memoryUsage: `${Math.floor(Math.random() * 20) + 60}%`
      }));
    } catch (error) {
      console.error('Error fetching real-time data:', error);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiActivity },
    { id: 'analytics', label: 'Analytics', icon: FiTrendingUp },
    { id: 'users', label: 'Users', icon: FiUsers },
    { id: 'restaurants', label: 'Restaurants', icon: FiMapPin },
    { id: 'system', label: 'System', icon: FiSettings },
    { id: 'ai', label: 'AI Features', icon: FiZap }
  ];

  const StatCard = ({ title, value, subtitle, icon: Icon, color = 'text-[#33e0a1]', trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <Icon className={`w-6 h-6 ${color}`} />
        {trend && (
          <div className={`flex items-center gap-1 text-xs ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
            <FiTrendingUp className="w-3 h-3" />
            {trend > 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-[#D0D0D0]/70">{title}</div>
      {subtitle && (
        <div className="text-xs text-[#D0D0D0]/50 mt-1">{subtitle}</div>
      )}
    </motion.div>
  );

  const ActivityItem = ({ activity }) => {
    const getActivityIcon = (type) => {
      const icons = {
        user_signup: FiUsers,
        review_posted: FiStar,
        restaurant_added: FiMapPin,
        ai_recommendation: FiZap,
        websocket_connection: FiWifi
      };
      return icons[type] || FiActivity;
    };

    const getActivityColor = (type) => {
      const colors = {
        user_signup: 'text-green-400',
        review_posted: 'text-yellow-400',
        restaurant_added: 'text-blue-400',
        ai_recommendation: 'text-purple-400',
        websocket_connection: 'text-[#33e0a1]'
      };
      return colors[type] || 'text-[#D0D0D0]';
    };

    const Icon = getActivityIcon(activity.type);
    const colorClass = getActivityColor(activity.type);

    return (
      <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
        <Icon className={`w-5 h-5 ${colorClass}`} />
        <div className="flex-1">
          <p className="text-white text-sm">{activity.details}</p>
          <p className="text-[#D0D0D0]/50 text-xs">
            {activity.user} • {activity.timestamp.toLocaleTimeString()}
          </p>
        </div>
      </div>
    );
  };

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={systemStats.totalUsers.toLocaleString()}
          subtitle="Active platform users"
          icon={FiUsers}
          trend={12}
        />
        <StatCard
          title="Restaurants"
          value={systemStats.totalRestaurants.toLocaleString()}
          subtitle="Listed establishments"
          icon={FiMapPin}
          trend={8}
        />
        <StatCard
          title="Reviews"
          value={systemStats.totalReviews.toLocaleString()}
          subtitle="User-generated content"
          icon={FiStar}
          trend={25}
        />
        <StatCard
          title="Active Connections"
          value={systemStats.activeConnections}
          subtitle="Real-time WebSocket connections"
          icon={FiWifi}
          color="text-green-400"
        />
      </div>

      {/* System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <FiMonitor className="w-5 h-5 text-[#33e0a1]" />
            System Health
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[#D0D0D0]/70">Server Uptime</span>
              <span className="text-green-400 font-medium">{systemStats.serverUptime}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#D0D0D0]/70">Avg Response Time</span>
              <span className="text-[#33e0a1] font-medium">{systemStats.avgResponseTime}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#D0D0D0]/70">Error Rate</span>
              <span className="text-green-400 font-medium">{systemStats.errorRate}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#D0D0D0]/70">Memory Usage</span>
              <span className="text-yellow-400 font-medium">{systemStats.memoryUsage}</span>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <FiActivity className="w-5 h-5 text-[#33e0a1]" />
            Recent Activity
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {recentActivity.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const AIFeaturesTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="AI Recommendations"
          value="1,247"
          subtitle="Generated this week"
          icon={FiZap}
          color="text-purple-400"
          trend={18}
        />
        <StatCard
          title="Groq API Calls"
          value="3,456"
          subtitle="Successful requests"
          icon={FiDatabase}
          color="text-blue-400"
          trend={22}
        />
        <StatCard
          title="WebSocket Messages"
          value="12,890"
          subtitle="Real-time notifications"
          icon={FiWifi}
          color="text-green-400"
          trend={35}
        />
      </div>

      {/* AI Features Status */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <FiZap className="w-5 h-5 text-[#33e0a1]" />
          Advanced Features Status
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-white">AI Recommendations (Groq)</span>
              </div>
              <span className="text-green-400 text-sm">Active</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-white">Real-time Notifications</span>
              </div>
              <span className="text-green-400 text-sm">Active</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-white">Performance Monitoring</span>
              </div>
              <span className="text-green-400 text-sm">Active</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-white">3D Visualizations</span>
              </div>
              <span className="text-green-400 text-sm">Active</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-white">Voice Search</span>
              </div>
              <span className="text-green-400 text-sm">Active</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-white">Advanced Search</span>
              </div>
              <span className="text-green-400 text-sm">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Restaurant Preview */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">3D Restaurant Visualization Demo</h3>
        <Restaurant3DView
          restaurant={{
            name: "Demo Restaurant",
            cuisine: "Italian",
            rating: 4.5,
            reviewCount: 127
          }}
          className="h-64"
        />
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'ai':
        return <AIFeaturesTab />;
      case 'users':
        return (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">User Management</h3>
            <p className="text-[#D0D0D0]/70">User management interface would be implemented here.</p>
          </div>
        );
      case 'restaurants':
        return (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Restaurant Management</h3>
            <p className="text-[#D0D0D0]/70">Restaurant management interface would be implemented here.</p>
          </div>
        );
      case 'system':
        return (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">System Configuration</h3>
            <p className="text-[#D0D0D0]/70">System settings and configuration options would be implemented here.</p>
          </div>
        );
      default:
        return <OverviewTab />;
    }
  };

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
            <div className="flex items-center gap-3 mb-2">
              <FiShield className="w-8 h-8 text-[#33e0a1]" />
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            </div>
            <p className="text-[#D0D0D0]/70">
              Comprehensive platform management and analytics
            </p>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex flex-wrap gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-[#33e0a1] text-[#121b22]'
                        : 'text-[#D0D0D0] hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {renderTabContent()}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default AdminPage;