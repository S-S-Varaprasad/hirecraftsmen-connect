
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

export const getApplicationsByWorkerId = async (workerId: string) => {
  console.log('Fetching applications for worker ID:', workerId);
  
  try {
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
      console.log('No applications found for this worker');
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
  const { data, error } = await (supabase as any)
    .from('applications')
    .insert([
      {
        job_id: jobId,
        worker_id: workerId,
        message,
      }
    ])
    .select();
  
  if (error) {
    console.error('Error applying to job:', error);
    throw error;
  }
  
  return data?.[0] as Application;
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

// Add a new function to mark jobs as completed (for payment tracking)
export const markApplicationCompleted = async (id: string) => {
  return updateApplicationStatus(id, 'completed');
};

// Add a direct check function to debug if a specific application exists
export const checkApplicationExists = async (jobId: string, workerId: string) => {
  console.log(`Checking if application exists for job ${jobId} and worker ${workerId}`);
  
  const { data, error, count } = await supabase
    .from('applications')
    .select('*', { count: 'exact' })
    .eq('job_id', jobId)
    .eq('worker_id', workerId);
  
  if (error) {
    console.error('Error checking application existence:', error);
    throw error;
  }
  
  console.log(`Found ${count} applications for this job/worker combination`);
  return { exists: count && count > 0, applications: data };
};
