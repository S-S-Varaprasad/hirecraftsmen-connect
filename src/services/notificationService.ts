
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
  const { data, error } = await supabase
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
  const { data, error, count } = await supabase
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

export const createNotification = async (
  userId: string,
  message: string,
  type: string,
  relatedId?: string
) => {
  const { data, error } = await supabase
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
  const { error } = await supabase
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

export const notifyWorkersAboutJob = async (
  jobId: string, 
  jobTitle: string, 
  skills: string[]
) => {
  try {
    // Get workers with matching skills
    const { data: workers, error } = await supabase
      .from('workers')
      .select('id, user_id, skills, profession')
      .filter('is_available', 'eq', true);
    
    if (error) {
      console.error('Error fetching workers for job notification:', error);
      throw error;
    }
    
    if (!workers || workers.length === 0) {
      return [];
    }
    
    const notifications: Notification[] = [];
    const skillsLower = skills.map(s => s.toLowerCase());
    
    // Filter workers with matching skills and send notifications
    for (const worker of workers) {
      if (!worker.user_id) continue;
      
      const workerSkillsLower = worker.skills.map((s: string) => s.toLowerCase());
      const hasMatchingSkill = workerSkillsLower.some((skill: string) => 
        skillsLower.some(jobSkill => skill.includes(jobSkill) || jobSkill.includes(skill))
      );
      
      if (hasMatchingSkill) {
        try {
          const notification = await createNotification(
            worker.user_id,
            `New job posted that matches your skills: ${jobTitle}`,
            'new_job',
            jobId
          );
          notifications.push(notification);
        } catch (notifyError) {
          console.error(`Error creating notification for worker ${worker.id}:`, notifyError);
        }
      }
    }
    
    return notifications;
  } catch (error) {
    console.error('Error notifying workers about job:', error);
    throw error;
  }
};
