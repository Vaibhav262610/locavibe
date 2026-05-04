import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiX, FiStar, FiHeart, FiUserPlus, FiMapPin } from 'react-icons/fi';
import { wsManager } from '@/lib/websocket';

const RealTimeNotifications = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!userId) return;

    // Initialize WebSocket connection
    wsManager.connect(userId);

    // Subscribe to connection status
    const unsubscribeConnection = wsManager.subscribe('connection_status', (data) => {
      setIsConnected(data.connected);
    });

    // Subscribe to different notification types
    const unsubscribeReview = wsManager.subscribe('review_notification', (data) => {
      addNotification({
        id: Date.now(),
        type: 'review',
        title: 'New Review',
        message: data.message,
        data: data.data,
        timestamp: new Date().toISOString()
      });
    });

    const unsubscribeLike = wsManager.subscribe('like_notification', (data) => {
      addNotification({
        id: Date.now(),
        type: 'like',
        title: 'Review Liked',
        message: data.message,
        data: data.data,
        timestamp: new Date().toISOString()
      });
    });

    const unsubscribeFollow = wsManager.subscribe('follow_notification', (data) => {
      addNotification({
        id: Date.now(),
        type: 'follow',
        title: 'New Follower',
        message: data.message,
        data: data.data,
        timestamp: new Date().toISOString()
      });
    });

    // Join user's personal room
    wsManager.sendMessage('join_user_room', userId);

    return () => {
      unsubscribeConnection();
      unsubscribeReview();
      unsubscribeLike();
      unsubscribeFollow();
    };
  }, [userId]);

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev.slice(0, 4)]); // Keep only 5 notifications
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeNotification(notification.id);
    }, 5000);

    // Play notification sound
    if ('Audio' in window) {
      try {
        const audio = new Audio('/sounds/notification.mp3');
        audio.volume = 0.3;
        audio.play().catch(() => {}); // Ignore errors
      } catch (error) {
        // Ignore audio errors
      }
    }

    // Show browser notification if permission granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/logo.png',
        tag: notification.id.toString()
      });
    }
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type) => {
    const icons = {
      review: FiStar,
      like: FiHeart,
      follow: FiUserPlus,
      restaurant: FiMapPin
    };
    return icons[type] || FiBell;
  };

  const getNotificationColor = (type) => {
    const colors = {
      review: 'text-blue-400',
      like: 'text-red-400',
      follow: 'text-green-400',
      restaurant: 'text-purple-400'
    };
    return colors[type] || 'text-[#33e0a1]';
  };

  const NotificationItem = ({ notification }) => {
    const Icon = getNotificationIcon(notification.type);
    const colorClass = getNotificationColor(notification.type);

    return (
      <motion.div
        initial={{ opacity: 0, x: 300, scale: 0.8 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 300, scale: 0.8 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-[#121b22]/95 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-2xl max-w-sm"
      >
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-xl bg-current/10 ${colorClass}`}>
            <Icon className="w-5 h-5" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-white text-sm mb-1">
              {notification.title}
            </h4>
            <p className="text-[#D0D0D0]/80 text-sm leading-relaxed">
              {notification.message}
            </p>
            <p className="text-[#D0D0D0]/50 text-xs mt-2">
              {new Date(notification.timestamp).toLocaleTimeString()}
            </p>
          </div>
          
          <button
            onClick={() => removeNotification(notification.id)}
            className="p-1 text-[#D0D0D0]/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      {/* Connection Status Indicator */}
      <div className="fixed top-4 left-4 z-40">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium ${
            isConnected
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${
            isConnected ? 'bg-green-400' : 'bg-red-400'
          }`} />
          <span className="hidden sm:inline">
            {isConnected ? 'Live' : 'Offline'}
          </span>
        </motion.div>
      </div>

      {/* Notifications Container */}
      <div className="fixed top-4 right-4 z-50 space-y-3 pointer-events-none">
        <AnimatePresence>
          {notifications.map((notification) => (
            <div key={notification.id} className="pointer-events-auto">
              <NotificationItem notification={notification} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
};

export default RealTimeNotifications;