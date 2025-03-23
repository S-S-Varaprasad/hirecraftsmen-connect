
import { useState } from 'react';
import { useStorage } from '@/hooks/useStorage';
import { updateWorker, updateWorkerProfilePicture, Worker } from '@/services/workerService';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

export function useWorkerProfileStorage() {
  const [uploading, setUploading] = useState(false);
  const { uploadFile } = useStorage();
  const { user } = useAuth();

  const uploadProfileImage = async (workerId: string, imageFile: File): Promise<Worker | null> => {
    if (!user) {
      toast.error('You must be logged in to update your profile');
      return null;
    }

    try {
      setUploading(true);
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `worker_${workerId}_${Date.now()}.${fileExt}`;
      
      const publicUrl = await uploadFile('worker-profiles', fileName, imageFile);
      
      if (!publicUrl) {
        throw new Error('Failed to upload profile image');
      }
      
      const updatedWorker = await updateWorkerProfilePicture(workerId, publicUrl);
      toast.success('Profile picture updated successfully');
      return updatedWorker;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast.error('Failed to update profile picture');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const removeProfileImage = async (workerId: string): Promise<Worker | null> => {
    try {
      setUploading(true);
      const updatedWorker = await updateWorkerProfilePicture(workerId, '');
      toast.success('Profile picture removed successfully');
      return updatedWorker;
    } catch (error) {
      console.error('Error removing profile picture:', error);
      toast.error('Failed to remove profile picture');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const updateWorkerProfile = async (
    workerId: string, 
    profileData: Partial<Worker>
  ): Promise<Worker | null> => {
    try {
      const updatedWorker = await updateWorker(workerId, profileData);
      toast.success('Profile updated successfully');
      return updatedWorker;
    } catch (error) {
      console.error('Error updating worker profile:', error);
      toast.error('Failed to update profile');
      return null;
    }
  };

  return {
    uploadProfileImage,
    removeProfileImage,
    updateWorkerProfile,
    uploading
  };
}
