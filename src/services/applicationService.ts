import { supabase } from '@/integrations/supabase/client';
import { Job } from './jobService';
import { Worker } from './workerService';

export interface Application {
  id: string;
  job_id: string;
  worker_id: string;
  status: 'applied' | 'accepted' | 'rejected' | 'completed';
  message: string | null;
  created_at: string;
  updated_at: string;
  // Added fields when joined with other tables
  job?: Job;
  worker?: Worker;
}

// Status descriptions for user-friendly display
export const APPLICATION_STATUS_DESCRIPTIONS = {
  applied: "Your application is awaiting review by the employer.",
  accepted: "Your application has been accepted! You can now start working on this job.",
  rejected: "Your application was not accepted for this position.",
  completed: "This job has been marked as completed and payment has been processed."
};

export const getApplicationsByWorkerId = async (workerId: string) => {
  console.log('Fetching applications for worker ID:', workerId);
  
  try {
    // Explicitly check worker ID to avoid empty queries
    if (!workerId) {
      console.error('Worker ID is empty or undefined');
      throw new Error('Worker ID is required');
    }

    // First, check if any applications exist for this worker
    const { count, error: countError } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .eq('worker_id', workerId);
    
    if (countError) {
      console.error('Error checking application count:', countError);
      throw countError;
    }
    
    console.log(`Found ${count} applications for worker ID: ${workerId}`);
    
    // Now get the full application data with job details
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        job:jobs(*)
      `)
      .eq('worker_id', workerId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching worker applications:', error);
      throw error;
    }
    
    // Force data refresh and logging of results
    console.log('Applications fetched successfully:', data?.length || 0, 'applications found');
    if (data?.length) {
      console.log('First application details:', JSON.stringify(data[0], null, 2));
    } else {
      console.log('No applications found for worker ID:', workerId);
      
      // Debug: Check if worker exists in the workers table
      const { data: workerData, error: workerError } = await supabase
        .from('workers')
        .select('id, name')
        .eq('id', workerId)
        .single();
      
      if (workerError) {
        console.error('Error checking worker:', workerError);
      } else if (workerData) {
        console.log('Worker exists:', workerData);
      } else {
        console.log('Worker not found in workers table, may be using user_id instead');
        
        // Try to find worker with user_id instead
        const { data: workerByUserId, error: userIdError } = await supabase
          .from('workers')
          .select('id, name, user_id')
          .eq('user_id', workerId)
          .single();
        
        if (userIdError) {
          console.error('Error checking worker by user_id:', userIdError);
        } else if (workerByUserId) {
          console.log('Found worker by user_id:', workerByUserId);
          console.log('Should be using worker.id instead of user_id for applications');
        }
      }
    }
    
    return data || [] as Application[];
  } catch (err) {
    console.error('Exception fetching applications:', err);
    throw err;
  }
};

export const getApplicationsByJobId = async (jobId: string) => {
  const { data, error } = await (supabase as any)
    .from('applications')
    .select(`
      *,
      worker:workers(*)
    `)
    .eq('job_id', jobId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching job applications:', error);
    throw error;
  }
  
  return data || [] as Application[];
};

export const getApplicationById = async (id: string) => {
  const { data, error } = await (supabase as any)
    .from('applications')
    .select(`
      *,
      job:jobs(*),
      worker:workers(*)
    `)
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching application:', error);
    throw error;
  }
  
  return data as Application;
};

export const applyToJob = async (
  jobId: string,
  workerId: string,
  message: string
) => {
  console.log(`Applying to job: ${jobId} with worker: ${workerId}`);
  
  // Validate inputs
  if (!jobId || !workerId) {
    console.error('Invalid job or worker ID:', { jobId, workerId });
    throw new Error('Job ID and worker ID are required');
  }
  
  try {
    // Check if job exists first
    const { data: jobExists, error: jobError } = await supabase
      .from('jobs')
      .select('id, title')
      .eq('id', jobId)
      .single();
      
    if (jobError) {
      console.error('Error checking job existence:', jobError);
      throw new Error(`Job not found: ${jobId}`);
    }
    
    console.log('Job exists:', jobExists);
    
    // Check if worker exists
    const { data: workerExists, error: workerError } = await supabase
      .from('workers')
      .select('id, name')
      .eq('id', workerId)
      .single();
      
    if (workerError) {
      console.error('Error checking worker existence:', workerError);
      throw new Error(`Worker not found: ${workerId}`);
    }
    
    console.log('Worker exists:', workerExists);
    
    // Now create the application
    const { data, error } = await supabase
      .from('applications')
      .insert([
        {
          job_id: jobId,
          worker_id: workerId,
          message,
          status: 'applied',
        }
      ])
      .select();
    
    if (error) {
      console.error('Error applying to job:', error);
      throw error;
    }
    
    console.log('Application created successfully:', data?.[0]);
    return data?.[0] as Application;
  } catch (err) {
    console.error('Exception in applyToJob:', err);
    throw err;
  }
};

export const updateApplicationStatus = async (
  id: string,
  status: 'applied' | 'accepted' | 'rejected' | 'completed'
) => {
  const { data, error } = await supabase
    .from('applications')
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select();
  
  if (error) {
    console.error('Error updating application status:', error);
    throw error;
  }
  
  return data?.[0] as Application;
};

export const markApplicationCompleted = async (id: string) => {
  return updateApplicationStatus(id, 'completed');
};

// Modify checkApplicationExists to cast status to the correct type
export const checkApplicationExists = async (jobId: string, workerId: string) => {
  console.log(`Checking if application exists for job ${jobId} and worker ${workerId}`);
  
  try {
    const { data, error, count } = await supabase
      .from('applications')
      .select('*', { count: 'exact' })
      .eq('job_id', jobId)
      .eq('worker_id', workerId);
    
    if (error) {
      console.error('Error checking if application exists:', error);
      
      // Special handling for no records found
      if (error.code === 'PGRST116') {
        return { exists: false, applications: [] };
      }
      
      throw error;
    }
    
    // Cast the data to ensure status is of the correct type
    const typedApplications = data?.map(app => ({
      ...app,
      status: app.status as 'applied' | 'accepted' | 'rejected' | 'completed'
    })) || [];
    
    console.log(`Found ${count} applications for this job/worker combination`);
    return { exists: count && count > 0, applications: typedApplications };
  } catch (err) {
    console.error('Exception checking application existence:', err);
    return { exists: false, applications: [] };
  }
};

export const getApplicationStatusDescription = (status: string): string => {
  return APPLICATION_STATUS_DESCRIPTIONS[status as keyof typeof APPLICATION_STATUS_DESCRIPTIONS] || 
    "Status information unavailable";
};
