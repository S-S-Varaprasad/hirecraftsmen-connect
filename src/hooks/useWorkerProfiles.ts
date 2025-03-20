
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWorkers, registerWorker, updateWorker, Worker, getWorkerById } from '@/services/workerService';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { useStorage } from '@/hooks/useStorage';
import { createNotification } from '@/services/notificationService';

export const useWorkerProfiles = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { uploadFile } = useStorage();

  // Fetch all workers
  const { data: workers = [], isLoading, error, refetch } = useQuery({
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
        
        console.log('Starting worker profile creation with data:', workerData);
        
        // Upload profile image if provided
        let imageUrl = null;
        if (workerData.profileImage) {
          console.log('Uploading profile image...');
          const fileExt = workerData.profileImage.name.split('.').pop();
          const fileName = `${user.id}-${Date.now()}.${fileExt}`;
          
          // Use the uploadFile function from useStorage hook
          imageUrl = await uploadFile('worker-profiles', fileName, workerData.profileImage);
          
          console.log('Image upload result:', imageUrl);
          
          if (!imageUrl) {
            throw new Error('Failed to upload profile image');
          }
        }
        
        // Parse skills from comma-separated string to array
        const skillsArray = workerData.skills.split(',').map(skill => skill.trim());
        
        console.log('Registering worker with data:', {
          name: workerData.name,
          profession: workerData.profession,
          skills: skillsArray,
          imageUrl
        });
        
        // Register worker with the image URL
        const newWorker = await registerWorker({
          name: workerData.name,
          profession: workerData.profession,
          location: workerData.location,
          experience: workerData.experience,
          hourly_rate: workerData.hourlyRate,
          skills: skillsArray,
          is_available: true,
          image_url: imageUrl,
          about: workerData.about,
          user_id: user.id,
        });
        
        console.log('Worker registered successfully:', newWorker);
        
        // Notify admins about new worker registration
        if (user.id) {
          try {
            await createNotification(
              user.id,
              `Your worker profile has been created successfully!`,
              'profile_created'
            );
            console.log('Profile creation notification sent');
          } catch (notifyError) {
            console.error('Error sending notification:', notifyError);
          }
        }
        
        return newWorker;
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

  // Get a single worker by ID
  const getWorker = async (id: string) => {
    try {
      const worker = await getWorkerById(id);
      return worker;
    } catch (error) {
      console.error('Error fetching worker:', error);
      throw error;
    }
  };

  return {
    workers,
    isLoading,
    error,
    createWorkerProfile,
    getWorkersByCategory,
    getWorkerCountByCategory,
    updateWorkerProfile,
    getWorker,
    refetch
  };
};
