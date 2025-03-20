
import { supabase } from '@/integrations/supabase/client';
import { getIndianWorkers } from '@/utils/workerFilters';

export interface Worker {
  id: string;
  name: string;
  profession: string;
  location: string;
  rating: number;
  experience: string;
  hourly_rate: string;
  skills: string[];
  languages: string[];
  is_available: boolean;
  image_url: string | null;
  about: string | null;
  user_id: string | null;
  created_at: string;
}

export const getWorkers = async () => {
  const { data, error } = await supabase
    .from('workers')
    .select('*');
  
  if (error) {
    console.error('Error fetching workers:', error);
    throw error;
  }
  
  const workersWithLanguages = data?.map(worker => ({
    ...worker,
    languages: (worker as any).languages || []
  })) || [];
  
  return workersWithLanguages as Worker[];
};

export const getWorkersByCategory = async (category: string) => {
  const { data, error } = await supabase
    .from('workers')
    .select('*')
    .ilike('profession', `%${category}%`);
  
  if (error) {
    console.error('Error fetching workers by category:', error);
    throw error;
  }
  
  const workersWithLanguages = data?.map(worker => ({
    ...worker,
    languages: (worker as any).languages || []
  })) || [];
  
  return workersWithLanguages as Worker[];
};

export const getWorkerById = async (id: string) => {
  const { data, error } = await supabase
    .from('workers')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching worker:', error);
    throw error;
  }
  
  const workerWithLanguages = {
    ...data,
    languages: (data as any).languages || []
  };
  
  return workerWithLanguages as Worker;
};

export const getWorkerByUserId = async (userId: string) => {
  const { data, error } = await supabase
    .from('workers')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching worker by user id:', error);
    throw error;
  }
  
  const workerWithLanguages = data ? {
    ...data,
    languages: (data as any).languages || []
  } : null;
  
  return workerWithLanguages as Worker | null;
};

export const registerWorker = async (workerData: Omit<Worker, 'id' | 'rating' | 'created_at'>) => {
  // Validate location to ensure it's in India
  const indiaLocationTerms = ['india', 'mumbai', 'delhi', 'bangalore', 'chennai', 'kolkata', 'hyderabad'];
  const isIndianLocation = indiaLocationTerms.some(term => 
    workerData.location.toLowerCase().includes(term.toLowerCase())
  );
  
  // If not an Indian location, append "India" to the location
  if (!isIndianLocation) {
    workerData.location = `${workerData.location}, India`;
  }
  
  const dataToSend = {
    ...workerData,
    languages: workerData.languages || [],
    rating: 0
  };

  const { data, error } = await supabase
    .from('workers')
    .insert([dataToSend])
    .select();
  
  if (error) {
    console.error('Error registering worker:', error);
    throw error;
  }
  
  return data?.[0] as Worker;
};

export const updateWorker = async (id: string, workerData: Partial<Worker>) => {
  const { data, error } = await supabase
    .from('workers')
    .update(workerData)
    .eq('id', id)
    .select();
  
  if (error) {
    console.error('Error updating worker:', error);
    throw error;
  }
  
  return data?.[0] as Worker;
};

export const updateWorkerProfilePicture = async (id: string, imageUrl: string) => {
  return updateWorker(id, { image_url: imageUrl });
};

export const deactivateWorker = async (id: string) => {
  const { data, error } = await supabase
    .from('workers')
    .update({ is_available: false })
    .eq('id', id)
    .select();
  
  if (error) {
    console.error('Error deactivating worker:', error);
    throw error;
  }
  
  return data?.[0] as Worker;
};

export const deleteWorker = async (id: string) => {
  const { error } = await supabase
    .from('workers')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting worker:', error);
    throw error;
  }
  
  return true;
};

export const searchWorkers = async (searchTerm: string) => {
  const { data, error } = await supabase
    .from('workers')
    .select('*')
    .or(`name.ilike.%${searchTerm}%,profession.ilike.%${searchTerm}%,skills.cs.{${searchTerm}}`);
  
  if (error) {
    console.error('Error searching workers:', error);
    throw error;
  }
  
  const workersWithLanguages = data?.map(worker => ({
    ...worker,
    languages: (worker as any).languages || []
  })) || [];
  
  return workersWithLanguages as Worker[];
};

export const notifyWorkersAboutJob = async (
  jobId: string,
  jobTitle: string,
  skills: string[],
  category?: string,
  sendEmail?: boolean,
  sendSms?: boolean,
  employerId?: string
) => {
  try {
    const response = await fetch(`${process.env.SUPABASE_URL}/functions/v1/notify-workers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        jobId,
        jobTitle,
        skills,
        category,
        sendEmail,
        sendSms,
        employerId
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to notify workers');
    }

    return await response.json();
  } catch (error) {
    console.error('Error notifying workers:', error);
    throw error;
  }
};
