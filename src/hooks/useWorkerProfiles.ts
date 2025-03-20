
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWorkers, registerWorker, updateWorker, Worker } from '@/services/workerService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { useStorage } from '@/hooks/useStorage';

export const useWorkerProfiles = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { uploadFile } = useStorage();

  // Fetch all workers
  const { data: workers = [], isLoading, error } = useQuery({
    queryKey: ['workers'],
    queryFn: getWorkers,
  });

  // Create a new worker profile
  const createWorkerProfile = useMutation({
    mutationFn: async (workerData: {
      name: string;
      email: string;
      phone: string;
      location: string;
      profession: string;
      experience: string;
      hourlyRate: string;
      skills: string;
      about: string;
      profileImage: File | null;
    }) => {
      try {
        if (!user) throw new Error('You must be logged in to create a profile');
        
        // Upload profile image if provided
        let imageUrl = null;
        if (workerData.profileImage) {
          const fileExt = workerData.profileImage.name.split('.').pop();
          const fileName = `${user.id}-${Date.now()}.${fileExt}`;
          
          // Use the uploadFile function from useStorage hook
          imageUrl = await uploadFile('worker-profiles', fileName, workerData.profileImage);
          
          if (!imageUrl) {
            throw new Error('Failed to upload profile image');
          }
        }
        
        // Register worker with the image URL
        return await registerWorker({
          name: workerData.name,
          profession: workerData.profession,
          location: workerData.location,
          experience: workerData.experience,
          hourly_rate: workerData.hourlyRate,
          skills: workerData.skills.split(',').map(skill => skill.trim()),
          is_available: true,
          image_url: imageUrl,
          about: workerData.about,
          user_id: user.id,
        });
      } catch (error: any) {
        console.error('Error creating worker profile:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workers'] });
      toast.success('Worker profile created successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create worker profile: ${error.message}`);
    },
  });

  // Get worker profile by category
  const getWorkersByCategory = (category: string) => {
    return workers.filter(worker => 
      worker.profession.toLowerCase().includes(category.toLowerCase()) ||
      worker.skills.some(skill => skill.toLowerCase().includes(category.toLowerCase()))
    );
  };

  // Get count of workers by category
  const getWorkerCountByCategory = (category: string) => {
    return getWorkersByCategory(category).length;
  };

  // Update worker profile
  const updateWorkerProfile = useMutation({
    mutationFn: async ({ 
      workerId, 
      updateData 
    }: { 
      workerId: string,
      updateData: Partial<Worker>
    }) => {
      return await updateWorker(workerId, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workers'] });
      toast.success('Worker profile updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update worker profile: ${error.message}`);
    },
  });

  return {
    workers,
    isLoading,
    error,
    createWorkerProfile,
    getWorkersByCategory,
    getWorkerCountByCategory,
    updateWorkerProfile
  };
};
