
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Notification, 
  getNotifications, 
  markNotificationAsRead,
  deleteNotification,
  deleteExpiredNotifications,
  markAllNotificationsAsRead
} from '@/services/notificationService';

// Sound notification
const NOTIFICATION_SOUNDS = {
  default: '/sounds/notification.mp3',
  critical: '/sounds/notification-critical.mp3'
};

export interface NotificationOptions {
  type?: string;
  isRead?: boolean;
  category?: string;
  limit?: number;
  offset?: number;
}

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState<NotificationOptions>({});
  const [soundEnabled, setSoundEnabled] = useState<boolean>(
    localStorage.getItem('notificationSoundEnabled') !== 'false'
  );
  const notificationSound = useRef<HTMLAudioElement | null>(null);
  const criticalSound = useRef<HTMLAudioElement | null>(null);

  // Initialize audio elements for notification sounds
  useEffect(() => {
    if (typeof window !== 'undefined') {
      notificationSound.current = new Audio(NOTIFICATION_SOUNDS.default);
      criticalSound.current = new Audio(NOTIFICATION_SOUNDS.critical);
    }
    
    return () => {
      notificationSound.current = null;
      criticalSound.current = null;
    };
  }, []);

  // Toggle notification sound
  const toggleSound = useCallback(() => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    localStorage.setItem('notificationSoundEnabled', String(newValue));
  }, [soundEnabled]);

  // Play notification sound based on priority
  const playNotificationSound = useCallback((priority: string = 'medium') => {
    if (!soundEnabled) return;
    
    try {
      if (priority === 'high' && criticalSound.current) {
        criticalSound.current.play();
      } else if (notificationSound.current) {
        notificationSound.current.play();
      }
    } catch (error) {
      console.error('Error playing notification sound:', error);
    }
  }, [soundEnabled]);

  // Update filters and refetch notifications
  const updateFilters = useCallback((newFilters: NotificationOptions) => {
    setFilter(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilter({});
  }, []);

  // Apply filters to notifications
  useEffect(() => {
    if (!notifications.length) {
      setFilteredNotifications([]);
      return;
    }

    let filtered = [...notifications];
    
    if (filter.type) {
      filtered = filtered.filter(n => n.type === filter.type);
    }
    
    if (filter.category) {
      filtered = filtered.filter(n => n.category === filter.category);
    }
    
    if (filter.isRead !== undefined) {
      filtered = filtered.filter(n => n.is_read === filter.isRead);
    }
    
    setFilteredNotifications(filtered);
  }, [notifications, filter]);

  // Fetch notifications when user logs in or filters change
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setFilteredNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    const fetchNotifications = async () => {
      try {
        setLoading(true);
        
        // Cleanup expired notifications first
        await deleteExpiredNotifications(user.id);
        
        // Use our service with filter options
        const options = {
          ...filter,
          limit: 20, // Default limit
          offset: 0  // Initial offset
        };
        
        const notificationsList = await getNotifications(user.id, options);
        
        setNotifications(notificationsList);
        setHasMore(notificationsList.length === options.limit);
        
        // Count unread notifications
        const unread = notificationsList.filter(n => !n.is_read).length;
        setUnreadCount(unread);
        
        console.log(`Fetched ${notificationsList.length} notifications, ${unread} unread`);
      } catch (error: any) {
        console.error('Error fetching notifications:', error);
        toast.error('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // Set up real-time subscription for new notifications
    const channel = supabase
      .channel('public:notifications')
      .on(
        'postgres_changes' as any, 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${user.id}` 
        },
        (payload: { new: Notification }) => {
          console.log('New notification received:', payload.new);
          setNotifications(prev => [payload.new, ...prev]);
          setUnreadCount(prev => prev + 1);
          
          // Play sound based on notification priority
          playNotificationSound(payload.new.priority);
          
          // Show toast notification
          toast.info(payload.new.message, {
            description: new Date(payload.new.created_at).toLocaleString(),
            action: {
              label: "View",
              onClick: () => markAsRead(payload.new.id)
            }
          });
        }
      )
      .subscribe();

    // Subscription for when notifications are marked as read or deleted
    const updateChannel = supabase
      .channel('public:notifications:updates')
      .on(
        'postgres_changes' as any, 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${user.id}` 
        },
        (payload: { new: Notification, old: Notification }) => {
          console.log('Notification updated:', payload.new);
          
          // Update the notification in our state
          setNotifications(prev => 
            prev.map(n => n.id === payload.new.id ? payload.new : n)
          );
          
          // If it was marked as read, update the unread count
          if (!payload.old.is_read && payload.new.is_read) {
            setUnreadCount(prev => Math.max(0, prev - 1));
          }
        }
      )
      .subscribe();

    // Subscription for when notifications are deleted
    const deleteChannel = supabase
      .channel('public:notifications:deletes')
      .on(
        'postgres_changes' as any, 
        { 
          event: 'DELETE', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${user.id}` 
        },
        (payload: { old: Notification }) => {
          console.log('Notification deleted:', payload.old);
          
          // Remove the deleted notification from our state
          setNotifications(prev => 
            prev.filter(n => n.id !== payload.old.id)
          );
          
          // If it was unread, update the unread count
          if (!payload.old.is_read) {
            setUnreadCount(prev => Math.max(0, prev - 1));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(updateChannel);
      supabase.removeChannel(deleteChannel);
    };
  }, [user, filter, playNotificationSound]);

  // Load more notifications (for infinite scrolling)
  const loadMore = useCallback(async () => {
    if (!user || loading || !hasMore) return;
    
    try {
      setLoading(true);
      
      const options = {
        ...filter,
        limit: 20,
        offset: notifications.length
      };
      
      const moreNotifications = await getNotifications(user.id, options);
      
      if (moreNotifications.length === 0) {
        setHasMore(false);
      } else {
        setNotifications(prev => [...prev, ...moreNotifications]);
        setHasMore(moreNotifications.length === options.limit);
      }
    } catch (error: any) {
      console.error('Error loading more notifications:', error);
      toast.error('Failed to load more notifications');
    } finally {
      setLoading(false);
    }
  }, [user, filter, notifications.length, loading, hasMore]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      if (!user) return;
      
      await markNotificationAsRead(notificationId);

      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      );
      
      // Only decrement if it was previously unread
      const notification = notifications.find(n => n.id === notificationId);
      if (notification && !notification.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  }, [user, notifications]);

  // Delete notification
  const removeNotification = useCallback(async (notificationId: string) => {
    try {
      if (!user) return;
      
      // Get notification before deletion to check if it's unread
      const notification = notifications.find(n => n.id === notificationId);
      
      await deleteNotification(notificationId);

      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      // If it was unread, decrement the counter
      if (notification && !notification.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      toast.success('Notification removed');
    } catch (error: any) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  }, [user, notifications]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async (options?: { type?: string; category?: string }) => {
    try {
      if (!user || unreadCount === 0) return;
      
      await markAllNotificationsAsRead(user.id, options);

      setNotifications(prev => 
        prev.map(n => {
          // Apply filters if provided
          if (options?.type && n.type !== options.type) return n;
          if (options?.category && n.category !== options.category) return n;
          
          return { ...n, is_read: true };
        })
      );
      
      // If filters are applied, only count notifications that match the filters
      if (options?.type || options?.category) {
        let count = 0;
        notifications.forEach(n => {
          if (!n.is_read && 
              (!options.type || n.type === options.type) && 
              (!options.category || n.category === options.category)) {
            count++;
          }
        });
        setUnreadCount(prev => Math.max(0, prev - count));
      } else {
        setUnreadCount(0);
      }
      
      return true;
    } catch (error: any) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to mark all notifications as read');
      throw error;
    }
  }, [user, unreadCount, notifications]);

  return {
    notifications: filteredNotifications,
    allNotifications: notifications,
    unreadCount,
    loading,
    hasMore,
    filter,
    soundEnabled,
    markAsRead,
    markAllAsRead,
    updateFilters,
    resetFilters,
    loadMore,
    removeNotification,
    toggleSound
  };
};

export type { Notification };
