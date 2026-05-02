import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiBell, 
  FiX, 
  FiCheck, 
  FiHeart, 
  FiMessageCircle, 
  FiUserPlus,
  FiStar,
  FiMapPin,
  FiSettings
} from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import useAppStore from '@/store/useAppStore';
import { wsManager } from '@/lib/websocket';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';

const NotificationItem = ({ notification, onMarkRead, onRemove }) => {
  const getIcon = (type) => {
    const icons = {
      like: FiHeart,
      comment: FiMessageCircle,
      follow: FiUserPlus,
      review: FiStar,
      restaurant: FiMapPin,
      system: FiSettings
    };
    return icons[type] || FiBell;
  };

  const getColor = (type) => {
    const colors = {
      like: 'text-red-400',
      comment: 'text-blue-400',
      follow: 'text-green-400',
      review: 'text-yellow-400',
      restaurant: 'text-purple-400',
      system: 'text-gray-400'
    };
    return colors[type] || 'text-[#33e0a1]';
  };

  const Icon = getIcon(notification.type);

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -300 }}
      className={`p-4 border-l-4 transition-all duration-200 ${
        notification.read 
          ? 'border-[#D0D0D0]/20 bg-[#121b22]/50' 
          : 'border-[#33e0a1] bg-[#33e0a1]/5'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Avatar or Icon */}
        <div className="flex-shrink-0">
          {notification.avatar ? (
            <Avatar
              src={notification.avatar}
              alt={notification.from}
              size="sm"
            />
          ) : (
            <div className={`p-2 rounded-full bg-current/10 ${getColor(notification.type)}`}>
              <Icon className="w-4 h-4" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <p className={`text-sm ${notification.read ? 'text-[#D0D0D0]/70' : 'text-[#D0D0D0]'}`}>
                {notification.message}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-[#D0D0D0]/50">
                  {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                </span>
                {notification.category && (
                  <Badge variant="default" size="sm">
                    {notification.category}
                  </Badge>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 ml-2">
              {!notification.read && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onMarkRead(notification.id)}
                  className="p-1 text-[#33e0a1] hover:bg-[#33e0a1]/10 rounded"
                  title="Mark as read"
                >
                  <FiCheck className="w-4 h-4" />
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onRemove(notification.id)}
                className="p-1 text-[#D0D0D0]/50 hover:text-red-400 hover:bg-red-400/10 rounded"
                title="Remove"
              >
                <FiX className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          {/* Action buttons for interactive notifications */}
          {notification.actions && (
            <div className="flex gap-2 mt-3">
              {notification.actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                    action.primary
                      ? 'bg-[#33e0a1] text-[#121b22] hover:bg-[#2dd4bf]'
                      : 'bg-[#D0D0D0]/20 text-[#D0D0D0] hover:bg-[#D0D0D0]/30'
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const NotificationCenter = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead, clearNotifications, addNotification } = useAppStore();
  const [filter, setFilter] = useState('all');
  const [settings, setSettings] = useState({
    sound: true,
    desktop: true,
    email: false,
    push: true
  });

  useEffect(() => {
    if (!isOpen) return;

    // Subscribe to real-time notifications
    const unsubscribe = wsManager.subscribe('notification', (data) => {
      addNotification(data);
      
      // Play notification sound
      if (settings.sound) {
        const audio = new Audio('/sounds/notification.mp3');
        audio.play().catch(() => {}); // Ignore errors if sound fails
      }

      // Show desktop notification
      if (settings.desktop && 'Notification' in window && Notification.permission === 'granted') {
        new Notification('LocaVibe', {
          body: data.message,
          icon: '/logo.png',
          tag: data.id
        });
      }
    });

    return unsubscribe;
  }, [isOpen, settings, addNotification]);

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    notifications.forEach(notification => {
      if (!notification.read) {
        markNotificationRead(notification.id);
      }
    });
  };

  const handleRemoveNotification = (id) => {
    // This would typically call a store action to remove the notification
    console.log('Remove notification:', id);
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      setSettings(prev => ({ ...prev, desktop: permission === 'granted' }));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Notification Panel */}
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[#121b22] border-l border-[#D0D0D0]/20 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-[#D0D0D0]/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <FiBell className="w-6 h-6 text-[#33e0a1]" />
                  <h2 className="text-xl font-bold text-[#D0D0D0]">Notifications</h2>
                  {unreadCount > 0 && (
                    <Badge variant="primary" size="sm">
                      {unreadCount}
                    </Badge>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-[#D0D0D0]/70 hover:text-[#D0D0D0] hover:bg-[#D0D0D0]/10 rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Filters */}
              <div className="flex gap-2 mb-4">
                {['all', 'unread', 'like', 'comment', 'follow'].map((filterType) => (
                  <button
                    key={filterType}
                    onClick={() => setFilter(filterType)}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors capitalize ${
                      filter === filterType
                        ? 'bg-[#33e0a1] text-[#121b22]'
                        : 'bg-[#D0D0D0]/20 text-[#D0D0D0] hover:bg-[#D0D0D0]/30'
                    }`}
                  >
                    {filterType}
                  </button>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={handleMarkAllRead}
                  disabled={unreadCount === 0}
                  className="flex-1 px-3 py-2 text-sm bg-[#33e0a1]/20 text-[#33e0a1] rounded-lg hover:bg-[#33e0a1]/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Mark All Read
                </button>
                <button
                  onClick={clearNotifications}
                  className="flex-1 px-3 py-2 text-sm bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {filteredNotifications.length > 0 ? (
                <div className="divide-y divide-[#D0D0D0]/10">
                  <AnimatePresence>
                    {filteredNotifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onMarkRead={markNotificationRead}
                        onRemove={handleRemoveNotification}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <FiBell className="w-12 h-12 text-[#D0D0D0]/30 mb-4" />
                  <h3 className="text-lg font-medium text-[#D0D0D0]/70 mb-2">
                    No notifications
                  </h3>
                  <p className="text-sm text-[#D0D0D0]/50">
                    {filter === 'all' 
                      ? "You're all caught up!" 
                      : `No ${filter} notifications`
                    }
                  </p>
                </div>
              )}
            </div>

            {/* Settings */}
            <div className="p-4 border-t border-[#D0D0D0]/20">
              <h3 className="text-sm font-medium text-[#D0D0D0] mb-3">Notification Settings</h3>
              <div className="space-y-2">
                <label className="flex items-center justify-between">
                  <span className="text-sm text-[#D0D0D0]/70">Sound</span>
                  <input
                    type="checkbox"
                    checked={settings.sound}
                    onChange={(e) => setSettings(prev => ({ ...prev, sound: e.target.checked }))}
                    className="w-4 h-4 text-[#33e0a1] bg-transparent border-[#D0D0D0]/30 rounded focus:ring-[#33e0a1]"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-[#D0D0D0]/70">Desktop</span>
                  <input
                    type="checkbox"
                    checked={settings.desktop}
                    onChange={(e) => {
                      if (e.target.checked) {
                        requestNotificationPermission();
                      } else {
                        setSettings(prev => ({ ...prev, desktop: false }));
                      }
                    }}
                    className="w-4 h-4 text-[#33e0a1] bg-transparent border-[#D0D0D0]/30 rounded focus:ring-[#33e0a1]"
                  />
                </label>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationCenter;