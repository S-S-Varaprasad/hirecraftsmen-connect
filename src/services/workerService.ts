
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
  const { data, error } = await (supabase
    .from('workers')
    .select('*') as unknown as Promise<{ data: Worker[] | null, error: any }>);
  
  if (error) {
    console.error('Error fetching workers:', error);
    throw error;
  }
  
  return data || [];
};

export const getWorkersByCategory = async (category: string) => {
  const { data, error } = await (supabase
    .from('workers')
    .select('*')
    .ilike('profession', `%${category}%`) as unknown as Promise<{ data: Worker[] | null, error: any }>);
  
  if (error) {
    console.error('Error fetching workers by category:', error);
    throw error;
  }
  
  return data || [];
};

export const getWorkerById = async (id: string) => {
  const { data, error } = await (supabase
    .from('workers')
    .select('*')
    .eq('id', id)
    .single() as unknown as Promise<{ data: Worker | null, error: any }>);
  
  if (error) {
    console.error('Error fetching worker:', error);
    throw error;
  }
  
  return data;
};

export const registerWorker = async (workerData: Omit<Worker, 'id' | 'rating'>) => {
  const { data, error } = await (supabase
    .from('workers')
    .insert([
      {
        ...workerData,
        rating: 0,
      }
    ])
    .select() as unknown as Promise<{ data: Worker[] | null, error: any }>);
  
  if (error) {
    console.error('Error registering worker:', error);
    throw error;
  }
  
  return data?.[0];
};
