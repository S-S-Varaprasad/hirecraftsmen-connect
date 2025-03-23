
// Import necessary dependencies
import { supabase } from '@/integrations/supabase/client';

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  type: string;
  category?: string;
  related_id?: string;
  priority?: string;
  is_read: boolean;
  created_at: string;
}

export interface NotificationFilter {
  type?: string;
  category?: string;
  isRead?: boolean;
  limit?: number;
  before?: string;
}

// Fetch notifications for a user with pagination
export const getNotifications = async (
  userId: string,
  filter?: NotificationFilter
): Promise<Notification[]> => {
  try {
    if (!userId) {
      console.warn('No user ID provided for notifications');
      return [];
    }

    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (filter?.type) {
      query = query.eq('type', filter.type);
    }

    if (filter?.category) {
      query = query.eq('category', filter.category);
    }

    if (filter?.isRead !== undefined) {
      query = query.eq('is_read', filter.isRead);
    }

    if (filter?.before) {
      query = query.lt('created_at', filter.before);
    }

    if (filter?.limit) {
      query = query.limit(filter.limit);
    } else {
      query = query.limit(20); // Default limit
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }

    return (data || []) as Notification[];
  } catch (error) {
    console.error('Exception in getNotifications:', error);
    return [];
  }
};

// Delete expired notifications (older than 30 days by default)
export const deleteExpiredNotifications = async (
  userId: string,
  daysToKeep: number = 30
): Promise<void> => {
  try {
    if (!userId) return;
    
    // Calculate the cutoff date (30 days ago by default)
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('user_id', userId)
      .lt('created_at', cutoffDate.toISOString());
    
    if (error) {
      console.error('Error deleting expired notifications:', error);
      throw error;
    }
    
    console.log(`Deleted notifications older than ${daysToKeep} days for user ${userId}`);
  } catch (error) {
    console.error('Exception in deleteExpiredNotifications:', error);
  }
};

// Count unread notifications
export const countUnreadNotifications = async (userId: string): Promise<number> => {
  try {
    if (!userId) return 0;

    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) {
      console.error('Error counting unread notifications:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Exception in countUnreadNotifications:', error);
    return 0;
  }
};

// Mark a notification as read
export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  } catch (error) {
    console.error('Exception in markNotificationAsRead:', error);
    throw error;
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (
  userId: string,
  filter?: NotificationFilter
): Promise<void> => {
  try {
    if (!userId) return;

    let query = supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (filter?.type) {
      query = query.eq('type', filter.type);
    }

    if (filter?.category) {
      query = query.eq('category', filter.category);
    }

    const { error } = await query;

    if (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  } catch (error) {
    console.error('Exception in markAllNotificationsAsRead:', error);
    throw error;
  }
};

// Delete a notification
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
  } catch (error) {
    console.error('Exception in deleteNotification:', error);
    throw error;
  }
};

// Create a notification
export const createNotification = async (notification: {
  user_id: string;
  message: string;
  type: string;
  category?: string;
  related_id?: string;
  priority?: string;
  is_read?: boolean;
}): Promise<Notification> => {
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
  } catch (error) {
    console.error('Exception in createNotification:', error);
    throw error;
  }
};

// Notify workers about a new job
export const notifyWorkersAboutJob = async (
  jobId: string,
  jobTitle: string,
  jobSkills: string[],
  jobCategory: string = 'General',
  sendEmail: boolean = false,
  sendSms: boolean = false
): Promise<{ success: boolean, matched_workers: number }> => {
  try {
    // Call the edge function to notify workers
    const { data, error } = await supabase.functions.invoke('notify-workers', {
      body: {
        jobId,
        jobTitle,
        jobSkills,
        jobCategory,
        sendEmail,
        sendSms
      }
    });

    if (error) {
      console.error('Error notifying workers:', error);
      return { success: false, matched_workers: 0 };
    }

    return { 
      success: true, 
      matched_workers: data?.matched_workers || 0 
    };
  } catch (error) {
    console.error('Exception in notifyWorkersAboutJob:', error);
    return { success: false, matched_workers: 0 };
  }
};

// Wrapper function to maintain compatibility with existing code
export const notifyWorkersAboutJobUpdate = async (
  jobId: string,
  jobTitle: string,
  jobSkills: string[],
  jobCategory?: string,
  sendEmail: boolean = false,
  sendSms: boolean = false
): Promise<{ success: boolean, matched_workers: number }> => {
  return notifyWorkersAboutJob(
    jobId,
    jobTitle,
    jobSkills,
    jobCategory || 'General',
    sendEmail,
    sendSms
  );
};

export interface NotificationSettings {
  email_notifications: boolean;
  sms_notifications: boolean;
  push_notifications: boolean;
  application_updates: boolean;
  job_posted: boolean;
  payment_updates: boolean;
  marketing_emails: boolean;
}

// Since notification_settings table doesn't exist in the database schema, 
// we'll use a dummy implementation that returns default settings
export const getUserNotificationSettings = async (userId: string): Promise<NotificationSettings | null> => {
  try {
    if (!userId) return null;

    // Return default settings
    return {
      email_notifications: true,
      sms_notifications: false,
      push_notifications: true,
      application_updates: true,
      job_posted: true,
      payment_updates: true,
      marketing_emails: false
    };
  } catch (error) {
    console.error('Exception in getUserNotificationSettings:', error);
    return null;
  }
};

// Stub implementation for updateUserNotificationSettings
export const updateUserNotificationSettings = async (
  userId: string,
  settings: Partial<NotificationSettings>
): Promise<NotificationSettings | null> => {
  try {
    if (!userId) return null;
    
    console.log(`Would update notification settings for user ${userId} with:`, settings);
    
    // For now, just return the settings as if they were saved
    return {
      email_notifications: settings.email_notifications ?? true,
      sms_notifications: settings.sms_notifications ?? false,
      push_notifications: settings.push_notifications ?? true,
      application_updates: settings.application_updates ?? true,
      job_posted: settings.job_posted ?? true,
      payment_updates: settings.payment_updates ?? true,
      marketing_emails: settings.marketing_emails ?? false
    };
  } catch (error) {
    console.error('Exception in updateUserNotificationSettings:', error);
    return null;
  }
};
