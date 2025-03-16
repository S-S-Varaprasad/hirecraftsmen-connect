
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  type: string;
  related_id: string | null;
  is_read: boolean;
  created_at: string;
}

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch notifications when user logs in
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const { data, error } = await (supabase as any)
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setNotifications(data || []);
      } catch (error: any) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // Set up real-time subscription for new notifications
    const channel = (supabase as any)
      .channel('public:notifications')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${user.id}` 
        },
        (payload: { new: Notification }) => {
          setNotifications(prev => [payload.new, ...prev]);
          // Show toast notification
          toast.info(payload.new.message, {
            description: new Date(payload.new.created_at).toLocaleString(),
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await (supabase as any)
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      );
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Create a new notification
  const createNotification = async (message: string, type: string, relatedId?: string) => {
    if (!user) return null;
    
    try {
      const { data, error } = await (supabase as any)
        .from('notifications')
        .insert([
          {
            user_id: user.id,
            message,
            type,
            related_id: relatedId || null
          }
        ])
        .select();

      if (error) throw error;
      return data?.[0];
    } catch (error: any) {
      console.error('Error creating notification:', error);
      return null;
    }
  };

  return {
    notifications,
    loading,
    markAsRead,
    createNotification
  };
};
