
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
  related_id?: string;
  additional_data?: any;
}

/**
 * Get notifications for a specific user
 */
export const getNotifications = async (userId: string): Promise<Notification[]> => {
  try {
    console.log(`Fetching notifications for user ${userId}`);
    
    // First, delete old notifications (older than 30 days)
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { error: deleteError } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', userId)
        .lt('created_at', thirtyDaysAgo.toISOString());
      
      if (deleteError) {
        console.error('Error deleting old notifications:', deleteError);
      } else {
        console.log(`Deleted notifications older than 30 days for user ${userId}`);
      }
    } catch (err) {
      console.error('Error in notification cleanup:', err);
      // Continue with fetching even if cleanup fails
    }
    
    const { data, error } = await (supabase as any)
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
    
    return data || [];
  } catch (err) {
    console.error('Exception in getNotifications:', err);
    // Return empty array instead of throwing to avoid cascading errors
    return [];
  }
};

/**
 * Get unread notification count for a specific user
 */
export const getUnreadNotificationCount = async (userId: string): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);
    
    if (error) {
      console.error('Error fetching unread notification count:', error);
      throw error;
    }
    
    return count || 0;
  } catch (err) {
    console.error('Exception in getUnreadNotificationCount:', err);
    return 0;
  }
};

/**
 * Create a new notification
 */
export const createNotification = async (notification: Omit<Notification, 'id' | 'created_at'>): Promise<Notification> => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert([notification])
      .select();
    
    if (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
    
    return data?.[0] as Notification;
  } catch (err) {
    console.error('Exception in createNotification:', err);
    throw err;
  }
};

/**
 * Mark a specific notification as read
 */
export const markNotificationAsRead = async (notificationId: string): Promise<Notification> => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .select();
    
    if (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
    
    return data?.[0] as Notification;
  } catch (err) {
    console.error('Exception in markNotificationAsRead:', err);
    throw err;
  }
};

/**
 * Mark all notifications for a user as read
 */
export const markAllNotificationsAsRead = async (userId: string): Promise<void> => {
  try {
    const { error } = await (supabase as any)
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  } catch (err) {
    console.error('Exception in markAllNotificationsAsRead:', err);
    throw err;
  }
};

/**
 * Delete a specific notification
 */
export const deleteNotification = async (notificationId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);
    
    if (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  } catch (err) {
    console.error('Exception in deleteNotification:', err);
    throw err;
  }
};

/**
 * Delete all notifications for a user
 */
export const deleteAllNotifications = async (userId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error deleting all notifications:', error);
      throw error;
    }
  } catch (err) {
    console.error('Exception in deleteAllNotifications:', err);
    throw err;
  }
};

/**
 * Update notification read status with error handling and user feedback
 */
export const updateNotificationReadStatus = async (
  notificationId: string,
  isRead: boolean,
  showToast: boolean = true
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: isRead })
      .eq('id', notificationId);
    
    if (error) {
      console.error('Error updating notification status:', error);
      if (showToast) {
        toast.error(`Failed to mark notification as ${isRead ? 'read' : 'unread'}`);
      }
      return false;
    }
    
    if (showToast) {
      toast.success(`Notification marked as ${isRead ? 'read' : 'unread'}`);
    }
    
    return true;
  } catch (err) {
    console.error('Exception in updateNotificationReadStatus:', err);
    if (showToast) {
      toast.error(`Failed to mark notification as ${isRead ? 'read' : 'unread'}`);
    }
    return false;
  }
};

/**
 * Delete notifications by type for a user
 */
export const deleteNotificationsByType = async (userId: string, type: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('user_id', userId)
      .eq('type', type);
    
    if (error) {
      console.error(`Error deleting notifications of type ${type}:`, error);
      throw error;
    }
  } catch (err) {
    console.error(`Exception in deleteNotificationsByType for type ${type}:`, err);
    throw err;
  }
};
