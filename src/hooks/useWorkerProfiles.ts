import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getWorkers, 
  registerWorker, 
  updateWorker, 
  deactivateWorker, 
  deleteWorker, 
  Worker, 
  getWorkerById,
  notifyWorkersAboutJob
} from '@/services/workerService';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { useStorage } from '@/hooks/useStorage';
import { createNotification } from '@/services/notificationService';
import { ensureStorageBuckets } from '@/services/storageService';
import { addSampleWorkers, forceAddSampleWorkers } from '@/utils/sampleWorkers';

export const useWorkerProfiles = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { uploadFile } = useStorage();

  const initializeBuckets = async () => {
    try {
      await ensureStorageBuckets();
    } catch (error) {
      console.error('Error ensuring storage buckets:', error);
    }
  };
  
  initializeBuckets();

  const { data: workers = [], isLoading, error, refetch } = useQuery({
    queryKey: ['workers'],
    queryFn: getWorkers,
  });

  const addSampleWorkersIfNeeded = async () => {
    try {
      if (workers.length < 3) {
        const added = await addSampleWorkers();
        if (added) {
          toast.success('Sample workers added successfully');
          queryClient.invalidateQueries({ queryKey: ['workers'] });
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error adding sample workers:', error);
      toast.error('Failed to add sample workers');
      return false;
    }
  };

  const forceSampleWorkers = async () => {
    try {
      const added = await forceAddSampleWorkers();
      if (added) {
        toast.success('Sample workers force-added successfully');
        queryClient.invalidateQueries({ queryKey: ['workers'] });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error force-adding sample workers:', error);
      toast.error('Failed to force-add sample workers');
      return false;
    }
  };

  const createWorkerProfile = useMutation({
    mutationFn: async (workerData: {
      name: string;
      profession: string;
      location: string;
      experience: string;
      hourlyRate: string;
      skills: string;
      languages: string;
      about: string;
      profileImage: File | null;
      resume: File | null;
    }) => {
      try {
        if (!user) throw new Error('You must be logged in to create a profile');
        
        console.log('Starting worker profile creation with data:', workerData);
        
        let imageUrl = null;
        if (workerData.profileImage) {
          console.log('Uploading profile image...', workerData.profileImage);
          const fileExt = workerData.profileImage.name.split('.').pop();
          const fileName = `${user.id}-${Date.now()}.${fileExt}`;
          
          imageUrl = await uploadFile('worker-profiles', fileName, workerData.profileImage);
          
          console.log('Image upload result:', imageUrl);
          
          if (!imageUrl) {
            throw new Error('Failed to upload profile image');
          }
        }
        
        let resumeUrl = null;
        if (workerData.resume) {
          console.log('Uploading resume...');
          const fileExt = workerData.resume.name.split('.').pop();
          const fileName = `${user.id}-resume-${Date.now()}.${fileExt}`;
          
          resumeUrl = await uploadFile('resumes', fileName, workerData.resume);
          
          console.log('Resume upload result:', resumeUrl);
        }
        
        const skillsArray = workerData.skills.split(',').map(skill => skill.trim()).filter(Boolean);
        
        const languagesArray = workerData.languages.split(',').map(language => language.trim()).filter(Boolean);
        
        console.log('Registering worker with data:', {
          name: workerData.name,
          profession: workerData.profession,
          skills: skillsArray,
          languages: languagesArray,
          imageUrl
        });
        
        const newWorker = await registerWorker({
          name: workerData.name,
          profession: workerData.profession,
          location: workerData.location,
          experience: workerData.experience,
          hourly_rate: workerData.hourlyRate,
          skills: skillsArray,
          languages: languagesArray,
          is_available: true,
          image_url: imageUrl,
          about: workerData.about,
          user_id: user.id,
        });
        
        console.log('Worker registered successfully:', newWorker);
        
        if (user.id) {
          try {
            await createNotification({
              user_id: user.id,
              message: `Your worker profile has been created successfully!`,
              type: 'profile_created',
              is_read: false
            });
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

  const updateProfileImage = useMutation({
    mutationFn: async ({ 
      workerId, 
      imageFile 
    }: { 
      workerId: string,
      imageFile: File
    }) => {
      if (!user) throw new Error('You must be logged in to update your profile');
      
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      
      const imageUrl = await uploadFile('worker-profiles', fileName, imageFile);
      
      if (!imageUrl) {
        throw new Error('Failed to upload profile image');
      }
      
      return await updateWorker(workerId, { image_url: imageUrl });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workers'] });
      toast.success('Profile image updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update profile image: ${error.message}`);
    },
  });

  const getWorkersByCategory = (category: string) => {
    return workers.filter(worker => 
      worker.profession.toLowerCase().includes(category.toLowerCase()) ||
      worker.skills.some(skill => skill.toLowerCase().includes(category.toLowerCase()))
    );
  };

  const getWorkerCountByCategory = (category: string) => {
    return getWorkersByCategory(category).length;
  };

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

  const deactivateWorkerProfile = useMutation({
    mutationFn: async (workerId: string) => {
      return await deactivateWorker(workerId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workers'] });
      toast.success('Worker profile deactivated. You can reactivate it anytime.');
    },
    onError: (error: Error) => {
      toast.error(`Failed to deactivate worker profile: ${error.message}`);
    },
  });

  const deleteWorkerProfile = useMutation({
    mutationFn: async (workerId: string) => {
      return await deleteWorker(workerId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workers'] });
      toast.success('Worker profile has been permanently deleted.');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete worker profile: ${error.message}`);
    },
  });

  const getWorker = async (id: string) => {
    try {
      const worker = await getWorkerById(id);
      return worker;
    } catch (error) {
      console.error('Error fetching worker:', error);
      throw error;
    }
  };

  const notifyWorkers = async (jobId: string, jobTitle: string, jobSkills: string[]) => {
    try {
      if (!user) return;
      
      const result = await notifyWorkersAboutJob(jobId, jobTitle, jobSkills);
      return result;
    } catch (error) {
      console.error('Error notifying workers:', error);
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
    deactivateWorkerProfile,
    deleteWorkerProfile,
    getWorker,
    notifyWorkers,
    refetch,
    addSampleWorkersIfNeeded,
    forceSampleWorkers,
    updateProfileImage
  };
};
