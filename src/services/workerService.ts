
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

export const registerWorker = async (workerData: Omit<Worker, 'id' | 'rating'>) => {
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
