
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  getNotifications, 
  getUnreadNotificationCount, 
  Notification, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  deleteNotification,
  deleteExpiredNotifications,
  updateNotificationReadStatus
} from '@/services/notificationService';
import { useAuth } from '@/context/AuthContext';
import { useQueryRefresh } from './useQueryRefresh';

interface UseNotificationsOptions {
  limit?: number;
  type?: string;
  category?: string;
  isRead?: boolean;
  refreshInterval?: number;
}

export const useNotifications = (options: UseNotificationsOptions = {}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isLoadingAction, setIsLoadingAction] = useState(false);
  const [playSound, setPlaySound] = useState(false);
  
  // Set up real-time updates for notifications table
  useQueryRefresh(['notifications'], [['notifications'], ['unreadCount']]);
  
  // Query to fetch notifications
  const { 
    data: notifications = [], 
    isLoading,
    error,
    refetch,
    isFetching 
  } = useQuery({
    queryKey: ['notifications', options],
    queryFn: () => user ? getNotifications(user.id, options) : Promise.resolve([]),
    enabled: !!user,
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 3,
    meta: {
      onError: (err: any) => {
        console.error('Error fetching notifications:', err);
        toast.error('Failed to load notifications');
      }
    }
  });
  
  // Query to fetch unread count
  const {
    data: unreadCount = 0,
    isLoading: isLoadingUnreadCount,
    refetch: refetchUnreadCount
  } = useQuery({
    queryKey: ['unreadCount'],
    queryFn: () => user ? getUnreadNotificationCount(user.id) : Promise.resolve(0),
    enabled: !!user,
    staleTime: 1000 * 60, // 1 minute
    meta: {
      onError: (err: any) => {
        console.error('Error fetching unread count:', err);
      }
    }
  });
  
  // Refresh data manually
  const refreshNotifications = useCallback(() => {
    if (user) {
      refetch();
      refetchUnreadCount();
    }
  }, [user, refetch, refetchUnreadCount]);
  
  // Play notification sound when unread count increases
  useEffect(() => {
    if (playSound && unreadCount > 0) {
      const audio = new Audio('/sounds/notification.mp3');
      audio.play();
      setPlaySound(false);
    }
  }, [unreadCount, playSound]);
  
  // Mark a notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    if (!user) return;
    
    setIsLoadingAction(true);
    try {
      await markNotificationAsRead(notificationId);
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
      
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
      return false;
    } finally {
      setIsLoadingAction(false);
    }
  }, [user, queryClient]);
  
  // Mark all notifications as read
  const markAllAsRead = useCallback(async (options?: { type?: string; category?: string }) => {
    if (!user) return;
    
    setIsLoadingAction(true);
    try {
      await markAllNotificationsAsRead(user.id, options);
      
      toast.success('All notifications marked as read');
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
      
      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to mark all notifications as read');
      return false;
    } finally {
      setIsLoadingAction(false);
    }
  }, [user, queryClient]);
  
  // Remove a notification
  const removeNotification = useCallback(async (notificationId: string) => {
    if (!user) return;
    
    setIsLoadingAction(true);
    try {
      await deleteNotification(notificationId);
      
      toast.success('Notification removed');
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
      
      return true;
    } catch (error) {
      console.error('Error removing notification:', error);
      toast.error('Failed to remove notification');
      return false;
    } finally {
      setIsLoadingAction(false);
    }
  }, [user, queryClient]);
  
  // Toggle read status of a notification
  const toggleReadStatus = useCallback(async (notificationId: string, currentReadStatus: boolean) => {
    if (!user) return;
    
    setIsLoadingAction(true);
    try {
      const success = await updateNotificationReadStatus(notificationId, !currentReadStatus);
      
      if (success) {
        // Invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
        queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
      }
      
      return success;
    } catch (error) {
      console.error('Error toggling notification read status:', error);
      return false;
    } finally {
      setIsLoadingAction(false);
    }
  }, [user, queryClient]);
  
  // Filter notifications by type
  const filterByType = useCallback((type: string) => {
    return notifications.filter(notification => notification.type === type);
  }, [notifications]);
  
  // Filter notifications by category
  const filterByCategory = useCallback((category: string) => {
    return notifications.filter(notification => notification.category === category);
  }, [notifications]);
  
  // Filter notifications by priority
  const filterByPriority = useCallback((priority: string) => {
    return notifications.filter(notification => notification.priority === priority);
  }, [notifications]);
  
  // Group notifications by date
  const groupByDate = useCallback(() => {
    const groups: { [key: string]: Notification[] } = {};
    
    notifications.forEach(notification => {
      const date = new Date(notification.created_at).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(notification);
    });
    
    return groups;
  }, [notifications]);
  
  // Auto-refresh on mount and periodically if refreshInterval is provided
  useEffect(() => {
    if (!user) return;
    
    // Initial fetch
    refreshNotifications();
    
    // Set up periodic refresh if refreshInterval is provided
    if (options.refreshInterval && options.refreshInterval > 0) {
      const intervalId = setInterval(() => {
        refreshNotifications();
      }, options.refreshInterval);
      
      return () => clearInterval(intervalId);
    }
  }, [user, options.refreshInterval, refreshNotifications]);
  
  const notificationsWithReadStatus = notifications.map(notification => ({
    ...notification,
    isRead: notification.is_read,
  }));

  console.log(`Fetched ${notifications.length} notifications, ${unreadCount} unread`);
  
  return {
    notifications: notificationsWithReadStatus,
    unreadCount,
    isLoading: isLoading || isLoadingUnreadCount || isLoadingAction,
    isFetching,
    error,
    refreshNotifications,
    markAsRead,
    markAllAsRead,
    removeNotification,
    toggleReadStatus,
    filterByType,
    filterByCategory,
    filterByPriority,
    groupByDate,
  };
};
