"use client";
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import RealTimeNotifications from '@/components/Notifications/RealTimeNotifications';
import { performanceMonitor } from '@/lib/performance';
import { getDataFromToken } from '@/helpers/getDataFromToken';

const AppLayout = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
    
    // Initialize performance monitoring
    if (typeof window !== 'undefined') {
      performanceMonitor.trackInteraction('page_view', pathname);
    }

    // Get user ID for notifications
    const getUserId = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          // Extract user ID from token or make API call
          const response = await fetch('/api/users/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const userData = await response.json();
            setUserId(userData.data._id);
          }
        }
      } catch (error) {
        console.error('Error getting user ID:', error);
      }
    };

    getUserId();
  }, [pathname]);

  // Don't render notifications on server side
  if (!isClient) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      {/* Real-time notifications - only render if user is authenticated */}
      {userId && <RealTimeNotifications userId={userId} />}
    </>
  );
};

export default AppLayout;