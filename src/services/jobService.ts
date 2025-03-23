import { supabase } from '@/integrations/supabase/client';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  job_type: string;
  rate: string;
  urgency: 'Low' | 'Medium' | 'High';
  skills: string[];
  description: string;
  posted_date?: string;
  employer_id?: string;
  created_at?: string;
}

export const getJobs = async (): Promise<Job[]> => {
  try {
    // First, get all job IDs that have accepted applications
    const { data: acceptedApplications, error: appError } = await supabase
      .from('applications')
      .select('job_id')
      .eq('status', 'accepted');
    
    if (appError) {
      console.error('Error fetching accepted applications:', appError);
      throw appError;
    }
    
    // Extract job IDs with accepted applications
    const acceptedJobIds = acceptedApplications.map(app => app.job_id);
    console.log('Jobs with accepted applications:', acceptedJobIds);
    
    // Fetch all jobs that don't have accepted applications
    let query = supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });
    
    // If there are accepted jobs, exclude them
    if (acceptedJobIds.length > 0) {
      query = query.not('id', 'in', `(${acceptedJobIds.map(id => `'${id}'`).join(',')})`);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
    
    return data as Job[];
  } catch (error) {
    console.error('Exception in getJobs:', error);
    throw error;
  }
};

export const getJobById = async (id: string): Promise<Job | null> => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching job:', error);
      throw error;
    }
    
    return data as Job;
  } catch (error) {
    console.error('Exception in getJobById:', error);
    return null;
  }
};

export const createJob = async (job: Omit<Job, 'id' | 'posted_date'>): Promise<Job> => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .insert([job])
      .select();
    
    if (error) {
      console.error('Error creating job:', error);
      throw error;
    }
    
    return data?.[0] as Job;
  } catch (error) {
    console.error('Exception in createJob:', error);
    throw error;
  }
};

export const updateJob = async (id: string, job: Partial<Job>): Promise<Job> => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .update(job)
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Error updating job:', error);
      throw error;
    }
    
    return data?.[0] as Job;
  } catch (error) {
    console.error('Exception in updateJob:', error);
    throw error;
  }
};

export const deleteJob = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  } catch (error) {
    console.error('Exception in deleteJob:', error);
    throw error;
  }
};

export const getJobsByEmployerId = async (employerId: string): Promise<Job[]> => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('employer_id', employerId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching jobs by employer ID:', error);
      throw error;
    }
    
    return data as Job[];
  } catch (error) {
    console.error('Exception in getJobsByEmployerId:', error);
    return [];
  }
};

export const getJobsBySearch = async (searchParams: any): Promise<Job[]> => {
  try {
    // First, get all job IDs that have accepted applications
    const { data: acceptedApplications, error: appError } = await supabase
      .from('applications')
      .select('job_id')
      .eq('status', 'accepted');
    
    if (appError) {
      console.error('Error fetching accepted applications:', appError);
      throw appError;
    }
    
    // Extract job IDs with accepted applications
    const acceptedJobIds = acceptedApplications.map(app => app.job_id);
    
    // Start building the query
    let query = supabase
      .from('jobs')
      .select('*');
    
    // If there are accepted jobs, exclude them
    if (acceptedJobIds.length > 0) {
      query = query.not('id', 'in', `(${acceptedJobIds.map(id => `'${id}'`).join(',')})`);
    }
    
    // Apply search filters
    if (searchParams.searchTerm) {
      query = query.or(`title.ilike.%${searchParams.searchTerm}%,description.ilike.%${searchParams.searchTerm}%,company.ilike.%${searchParams.searchTerm}%`);
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
    
    if (searchParams.skills && searchParams.skills.length > 0) {
      // For skills, which is an array column, we need a more complex query
      const skillsFilter = searchParams.skills
        .map((skill: string) => `skills.cs.{${skill}}`)
        .join(',');
      
      query = query.or(skillsFilter);
    }
    
    // Order by created_at
    query = query.order('created_at', { ascending: false });
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error searching jobs:', error);
      throw error;
    }
    
    return data as Job[];
  } catch (error) {
    console.error('Exception in getJobsBySearch:', error);
    throw error;
  }
};
