
import { supabase } from '@/integrations/supabase/client';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  job_type: string;
  rate: string;
  urgency: 'Low' | 'Medium' | 'High';
  posted_date: string;
  skills: string[];
  description: string;
  employer_id: string | null;
  created_at: string;
}

export const getJobs = async () => {
  const { data, error } = await (supabase as any)
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
  
  return data || [] as Job[];
};

export const getJobsBySearch = async (searchParams: {
  searchTerm?: string;
  location?: string;
  jobTypes?: string[];
  urgency?: string[];
}) => {
  let query = (supabase as any)
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (searchParams.searchTerm) {
    const term = searchParams.searchTerm.toLowerCase();
    query = query.or(`title.ilike.%${term}%,description.ilike.%${term}%,company.ilike.%${term}%`);
  }
  
  if (searchParams.location) {
    query = query.ilike('location', `%${searchParams.location}%`);
  }
  
  if (searchParams.jobTypes && searchParams.jobTypes.length > 0) {
    query = query.in('job_type', searchParams.jobTypes);
  }
  
  if (searchParams.urgency && searchParams.urgency.length > 0) {
    query = query.in('urgency', searchParams.urgency);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error searching jobs:', error);
    throw error;
  }
  
  return data || [] as Job[];
};

export const getJobById = async (id: string) => {
  const { data, error } = await (supabase as any)
    .from('jobs')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching job:', error);
    throw error;
  }
  
  return data as Job;
};

export const createJob = async (jobData: Omit<Job, 'id' | 'posted_date' | 'created_at'>) => {
  const { data, error } = await (supabase as any)
    .from('jobs')
    .insert([jobData])
    .select();
  
  if (error) {
    console.error('Error creating job:', error);
    throw error;
  }
  
  return data?.[0] as Job;
};

export const updateJob = async (id: string, jobData: Partial<Job>) => {
  const { data, error } = await (supabase as any)
    .from('jobs')
    .update(jobData)
    .eq('id', id)
    .select();
  
  if (error) {
    console.error('Error updating job:', error);
    throw error;
  }
  
  return data?.[0] as Job;
};

export const deleteJob = async (id: string) => {
  const { error } = await (supabase as any)
    .from('jobs')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting job:', error);
    throw error;
  }
  
  return true;
};
