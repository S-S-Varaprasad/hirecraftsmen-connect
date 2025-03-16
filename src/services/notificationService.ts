
import { supabase } from '@/integrations/supabase/client';

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  type: string;
  related_id: string | null;
  is_read: boolean;
  created_at: string;
}

export const getNotifications = async (userId: string) => {
  const { data, error } = await (supabase as any)
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
  
  return data || [] as Notification[];
};

export const getUnreadNotificationsCount = async (userId: string) => {
  const { data, error, count } = await (supabase as any)
    .from('notifications')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .eq('is_read', false);
  
  if (error) {
    console.error('Error fetching unread notifications count:', error);
    throw error;
  }
  
  return count || 0;
};

export const markNotificationAsRead = async (id: string) => {
  const { data, error } = await (supabase as any)
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id)
    .select();
  
  if (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
  
  return data?.[0] as Notification;
};

export const createNotification = async (
  userId: string,
  message: string,
  type: string,
  relatedId?: string
) => {
  const { data, error } = await (supabase as any)
    .from('notifications')
    .insert([
      {
        user_id: userId,
        message,
        type,
        related_id: relatedId || null,
      }
    ])
    .select();
  
  if (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
  
  return data?.[0] as Notification;
};

export const markAllNotificationsAsRead = async (userId: string) => {
  const { error } = await (supabase as any)
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false);
  
  if (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
  
  return true;
};
