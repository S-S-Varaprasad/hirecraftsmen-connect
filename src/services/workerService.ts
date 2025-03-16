
import { supabase } from '@/integrations/supabase/client';

export interface Worker {
  id: string;
  name: string;
  profession: string;
  location: string;
  rating: number;
  experience: string;
  hourly_rate: string;
  skills: string[];
  is_available: boolean;
  image_url: string | null;
  about: string | null;
  user_id: string | null;
  created_at: string;
}

export const getWorkers = async () => {
  // Cast the entire supabase client to any to bypass type checking
  const { data, error } = await (supabase as any)
    .from('workers')
    .select('*');
  
  if (error) {
    console.error('Error fetching workers:', error);
    throw error;
  }
  
  return data || [] as Worker[];
};

export const getWorkersByCategory = async (category: string) => {
  // Cast the entire supabase client to any to bypass type checking
  const { data, error } = await (supabase as any)
    .from('workers')
    .select('*')
    .ilike('profession', `%${category}%`);
  
  if (error) {
    console.error('Error fetching workers by category:', error);
    throw error;
  }
  
  return data || [] as Worker[];
};

export const getWorkerById = async (id: string) => {
  // Cast the entire supabase client to any to bypass type checking
  const { data, error } = await (supabase as any)
    .from('workers')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching worker:', error);
    throw error;
  }
  
  return data as Worker;
};

export const getWorkerByUserId = async (userId: string) => {
  // Cast the entire supabase client to any to bypass type checking
  const { data, error } = await (supabase as any)
    .from('workers')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') { // PGRST116 is the error code for "no rows returned"
    console.error('Error fetching worker by user id:', error);
    throw error;
  }
  
  return data as Worker | null;
};

export const registerWorker = async (workerData: Omit<Worker, 'id' | 'rating' | 'created_at'>) => {
  // Cast the entire supabase client to any to bypass type checking
  const { data, error } = await (supabase as any)
    .from('workers')
    .insert([
      {
        ...workerData,
        rating: 0,
      }
    ])
    .select();
  
  if (error) {
    console.error('Error registering worker:', error);
    throw error;
  }
  
  return data?.[0] as Worker;
};

export const updateWorker = async (id: string, workerData: Partial<Worker>) => {
  // Cast the entire supabase client to any to bypass type checking
  const { data, error } = await (supabase as any)
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
