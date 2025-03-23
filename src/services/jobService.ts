import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

// Helper function to ensure urgency is one of the allowed values
const validateUrgency = (urgency: string): 'Low' | 'Medium' | 'High' => {
  if (urgency === 'Low' || urgency === 'Medium' || urgency === 'High') {
    return urgency;
  }
  // Default to Medium if value doesn't match expected values
  console.warn(`Invalid urgency value: ${urgency}, defaulting to Medium`);
  return 'Medium';
};

// Helper function to convert database job records to Job type
const convertToJob = (job: any): Job => {
  return {
    ...job,
    urgency: validateUrgency(job.urgency)
  };
};

// Helper function to filter out jobs with accepted applications
const filterJobsWithAcceptedApplications = async (jobs: Job[]): Promise<Job[]> => {
  try {
    // Get list of jobs with accepted applications
    const { data: acceptedApplicationJobs, error: appError } = await supabase
      .from('applications')
      .select('job_id')
      .eq('status', 'accepted');
    
    if (appError) {
      console.error('Error fetching accepted applications:', appError);
      return jobs; // Return all jobs if we can't determine which have accepted applications
    }
    
    // Get the job IDs that have accepted applications
    const jobIdsWithAcceptedApplications = (acceptedApplicationJobs || []).map(app => app.job_id);
    console.log('Jobs with accepted applications:', jobIdsWithAcceptedApplications);
    
    // Filter out jobs with accepted applications
    if (jobIdsWithAcceptedApplications.length > 0) {
      return jobs.filter(job => !jobIdsWithAcceptedApplications.includes(job.id));
    }
    
    return jobs;
  } catch (error) {
    console.error('Error in filterJobsWithAcceptedApplications:', error);
    return jobs; // Return all jobs in case of error
  }
};

export const getJobs = async (): Promise<Job[]> => {
  try {
    // Fetch all jobs
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
    
    // Convert data to Job type
    const jobList = (data || []).map(convertToJob) as Job[];
    
    // Filter out jobs with accepted applications
    return await filterJobsWithAcceptedApplications(jobList);
  } catch (error) {
    console.error('Exception in getJobs:', error);
    // Return empty array instead of throwing to avoid cascading errors
    return [];
  }
};

export const getJobsBySearch = async (searchParams: {
  searchTerm?: string;
  location?: string;
  jobTypes?: string[];
  urgency?: string[];
}): Promise<Job[]> => {
  try {
    // Start building the query
    let query = supabase
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
    
    // Convert data to Job type
    const jobList = (data || []).map(convertToJob) as Job[];
    
    // Filter out jobs with accepted applications
    return await filterJobsWithAcceptedApplications(jobList);
  } catch (error) {
    console.error('Exception in getJobsBySearch:', error);
    // Return empty array instead of throwing
    return [];
  }
};

export const getJobById = async (jobId: string) => {
  try {
    console.log(`Getting job by ID: ${jobId}`);
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (error) {
      console.error('Error in getJobById:', error);
      throw new Error(error.message);
    }

    if (!data) {
      console.error('No job found with ID:', jobId);
      throw new Error('Job not found');
    }

    console.log('Job found:', data);
    return data;
  } catch (error) {
    console.error('Error in getJobById:', error);
    throw error;
  }
};

export const createJob = async (jobData: Omit<Job, 'id' | 'posted_date' | 'created_at'>) => {
  // Validate urgency field before inserting
  const validatedJobData = {
    ...jobData,
    urgency: validateUrgency(jobData.urgency),
    posted_date: new Date().toISOString() // Explicitly set posted_date to current time
  };

  const { data, error } = await supabase
    .from('jobs')
    .insert([validatedJobData])
    .select();
  
  if (error) {
    console.error('Error creating job:', error);
    throw error;
  }
  
  return convertToJob(data?.[0]) as Job;
};

export const updateJob = async (id: string, jobData: Partial<Job>) => {
  // Validate urgency field if it's being updated
  const dataToUpdate = { ...jobData };
  if (dataToUpdate.urgency) {
    dataToUpdate.urgency = validateUrgency(dataToUpdate.urgency);
  }

  const { data, error } = await supabase
    .from('jobs')
    .update(dataToUpdate)
    .eq('id', id)
    .select();
  
  if (error) {
    console.error('Error updating job:', error);
    throw error;
  }
  
  return convertToJob(data?.[0]) as Job;
};

export const deleteJob = async (id: string) => {
  const { error } = await supabase
    .from('jobs')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting job:', error);
    throw error;
  }
  
  return true;
};
