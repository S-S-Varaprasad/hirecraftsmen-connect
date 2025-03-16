
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
  const { data, error } = await (supabase as any)
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
  
  return data || [] as Application[];
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
  const { data, error } = await (supabase as any)
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
