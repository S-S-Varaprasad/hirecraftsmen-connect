import { supabase } from '@/integrations/supabase/client';

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  type: string;
  related_id: string | null;
  is_read: boolean;
  created_at: string;
  priority?: 'low' | 'medium' | 'high';
  category?: 'job' | 'message' | 'application' | 'system';
  expires_at?: string;
  additional_data?: string | null;
}

export const getNotifications = async (userId: string, options?: {
  type?: string; 
  isRead?: boolean;
  category?: string;
  limit?: number;
  offset?: number;
}) => {
  let query = supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (options?.type) {
    query = query.eq('type', options.type);
  }
  
  if (options?.isRead !== undefined) {
    query = query.eq('is_read', options.isRead);
  }
  
  if (options?.category) {
    query = query.eq('category', options.category);
  }
  
  if (options?.limit) {
    query = query.limit(options.limit);
  }
  
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
  
  return data as Notification[];
};

export const getUnreadNotificationsCount = async (userId: string, options?: { type?: string; category?: string }) => {
  let query = supabase
    .from('notifications')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .eq('is_read', false);
  
  if (options?.type) {
    query = query.eq('type', options.type);
  }
  
  if (options?.category) {
    query = query.eq('category', options.category);
  }
  
  const { count, error } = await query;
  
  if (error) {
    console.error('Error fetching unread notifications count:', error);
    throw error;
  }
  
  return count || 0;
};

export const markNotificationAsRead = async (id: string) => {
  const { data, error } = await supabase
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

export const deleteNotification = async (id: string) => {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
  
  return true;
};

export const createNotification = async (
  userId: string,
  message: string,
  type: string,
  relatedId?: string,
  options?: {
    priority?: 'low' | 'medium' | 'high';
    category?: 'job' | 'message' | 'application' | 'system';
    expiresInDays?: number;
  }
) => {
  const expiresAt = options?.expiresInDays
    ? new Date(Date.now() + options.expiresInDays * 24 * 60 * 60 * 1000).toISOString()
    : null;
    
  const { data, error } = await supabase
    .from('notifications')
    .insert([
      {
        user_id: userId,
        message,
        type,
        related_id: relatedId || null,
        priority: options?.priority || 'medium',
        category: options?.category || 'system',
        expires_at: expiresAt
      }
    ])
    .select();
  
  if (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
  
  return data?.[0] as Notification;
};

export const markAllNotificationsAsRead = async (userId: string, options?: { type?: string; category?: string }) => {
  let query = supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false);
  
  if (options?.type) {
    query = query.eq('type', options.type);
  }
  
  if (options?.category) {
    query = query.eq('category', options.category);
  }
  
  const { error } = await query;
  
  if (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
  
  return true;
};

export const deleteExpiredNotifications = async (userId: string) => {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('user_id', userId)
    .lt('expires_at', new Date().toISOString());
  
  if (error) {
    console.error('Error deleting expired notifications:', error);
    throw error;
  }
  
  return true;
};

export const deleteAllNotifications = async (userId: string, options?: { type?: string; category?: string }) => {
  let query = supabase
    .from('notifications')
    .delete()
    .eq('user_id', userId);
  
  if (options?.type) {
    query = query.eq('type', options.type);
  }
  
  if (options?.category) {
    query = query.eq('category', options.category);
  }
  
  const { error } = await query;
  
  if (error) {
    console.error('Error deleting all notifications:', error);
    throw error;
  }
  
  return true;
};

export const batchCreateNotifications = async (notifications: Array<{
  userId: string;
  message: string;
  type: string;
  relatedId?: string;
  priority?: 'low' | 'medium' | 'high';
  category?: 'job' | 'message' | 'application' | 'system';
  expiresInDays?: number;
}>) => {
  const notificationsToInsert = notifications.map(n => ({
    user_id: n.userId,
    message: n.message,
    type: n.type,
    related_id: n.relatedId || null,
    priority: n.priority || 'medium',
    category: n.category || 'system',
    expires_at: n.expiresInDays
      ? new Date(Date.now() + n.expiresInDays * 24 * 60 * 60 * 1000).toISOString()
      : null
  }));
  
  const { data, error } = await supabase
    .from('notifications')
    .insert(notificationsToInsert)
    .select();
  
  if (error) {
    console.error('Error batch creating notifications:', error);
    throw error;
  }
  
  return data as Notification[];
};

export const createWorkerApplicationNotification = async (
  employerId: string, 
  workerId: string,
  workerName: string,
  jobId: string,
  jobTitle: string
) => {
  return createNotification(
    employerId,
    `${workerName} has applied to your job: ${jobTitle}`,
    'application',
    jobId
  );
};

export const createJobAcceptedNotification = async (
  workerId: string,
  employerName: string,
  jobId: string,
  jobTitle: string
) => {
  return createNotification(
    workerId,
    `${employerName} has accepted your application for: ${jobTitle}`,
    'job_accepted',
    jobId
  );
};

export const createNewJobNotification = async (
  workerId: string,
  jobId: string,
  jobTitle: string,
  jobCategory: string
) => {
  return createNotification(
    workerId,
    `New job posted that matches your skills: ${jobTitle}`,
    'new_job',
    jobId
  );
};

export const createJobUpdatedNotification = async (
  workerId: string,
  jobId: string,
  jobTitle: string
) => {
  return createNotification(
    workerId,
    `A job you might be interested in was updated: ${jobTitle}`,
    'job_updated',
    jobId
  );
};

export const notifyWorkersAboutJob = async (
  jobId: string, 
  jobTitle: string, 
  skills: string[],
  category?: string,
  sendEmail: boolean = false,
  sendSms: boolean = false
) => {
  try {
    console.log('Notifying workers about job:', { jobId, jobTitle, skills, category });
    
    const SUPABASE_URL = "https://myrztsvambwrkusxxatm.supabase.co";
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15cnp0c3ZhbWJ3cmt1c3h4YXRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwMjExMjMsImV4cCI6MjA1NzU5NzEyM30.e4ZArV9YTi84rsQu9hXqVVlGAVCPu2e88_rrng49Yes";
    
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.error('Missing Supabase URL or anon key');
      throw new Error('Configuration error: Missing Supabase credentials');
    }
    
    console.log('Making request to notify-workers function with URL:', SUPABASE_URL);
    
    const response = await fetch(`${SUPABASE_URL}/functions/v1/notify-workers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        jobId,
        jobTitle,
        skills,
        category,
        sendEmail,
        sendSms
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response from notify-workers:', response.status, errorText);
      throw new Error(`Error notifying workers: ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log('Worker notification result:', result);
    return result;
  } catch (error) {
    console.error('Error notifying workers about job:', error);
    throw error;
  }
};

export const notifyWorkersAboutJobUpdate = async (
  jobId: string, 
  jobTitle: string, 
  skills: string[],
  category?: string,
  sendEmail: boolean = false,
  sendSms: boolean = false
) => {
  try {
    const SUPABASE_URL = "https://myrztsvambwrkusxxatm.supabase.co";
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15cnp0c3ZhbWJ3cmt1c3h4YXRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwMjExMjMsImV4cCI6MjA1NzU5NzEyM30.e4ZArV9YTi84rsQu9hXqVVlGAVCPu2e88_rrng49Yes";
    
    const response = await fetch(`${SUPABASE_URL}/functions/v1/notify-workers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        jobId,
        jobTitle,
        skills,
        category,
        sendEmail,
        sendSms,
        isUpdate: true
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error notifying workers about job update: ${response.statusText}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error notifying workers about job update:', error);
    throw error;
  }
};

export const notifyEmployerAboutApplication = async (
  employerId: string, 
  workerId: string,
  workerName: string,
  jobId: string,
  jobTitle: string,
  sendEmail: boolean = false
) => {
  try {
    const notification = await createNotification(
      employerId,
      `${workerName} has applied to your job: ${jobTitle}`,
      'application',
      jobId
    );
    
    if (sendEmail) {
      try {
        const SUPABASE_URL = "https://myrztsvambwrkusxxatm.supabase.co";
        const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15cnp0c3ZhbWJ3cmt1c3h4YXRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwMjExMjMsImV4cCI6MjA1NzU5NzEyM30.e4ZArV9YTi84rsQu9hXqVVlGAVCPu2e88_rrng49Yes";
        
        const response = await fetch(`${SUPABASE_URL}/functions/v1/send-notification`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({
            userId: employerId,
            message: `${workerName} has applied to your job: ${jobTitle}`,
            type: 'application',
            relatedId: jobId,
            sendEmail: true
          })
        });
        
        if (!response.ok) {
          console.error('Error sending email notification:', response.statusText);
        }
      } catch (emailError) {
        console.error('Error with email notification:', emailError);
      }
    }
    
    return notification;
  } catch (error) {
    console.error('Error notifying employer about application:', error);
    throw error;
  }
};
