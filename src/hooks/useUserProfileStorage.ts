
import { useState } from 'react';
import { useStorage } from '@/hooks/useStorage';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

export function useUserProfileStorage() {
  const [uploading, setUploading] = useState(false);
  const { uploadFile } = useStorage();
  const { user } = useAuth();

  const uploadProfileImage = async (imageFile: File): Promise<string | null> => {
    if (!user) {
      toast.error('You must be logged in to update your profile');
      return null;
    }

    try {
      setUploading(true);
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `user_${user.id}_${Date.now()}.${fileExt}`;
      
      const publicUrl = await uploadFile('user-profiles', fileName, imageFile);
      
      if (!publicUrl) {
        throw new Error('Failed to upload profile image');
      }
      
      // Update the user metadata with the new avatar URL
      const { error } = await supabase.auth.updateUser({
        data: {
          avatar_url: publicUrl
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('Profile picture updated successfully');
      return publicUrl;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast.error('Failed to update profile picture');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const removeProfileImage = async (): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to update your profile');
      return false;
    }

    try {
      setUploading(true);
      
      // Update the user metadata to remove the avatar URL
      const { error } = await supabase.auth.updateUser({
        data: {
          avatar_url: null
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('Profile picture removed successfully');
      return true;
    } catch (error) {
      console.error('Error removing profile picture:', error);
      toast.error('Failed to remove profile picture');
      return false;
    } finally {
      setUploading(false);
    }
  };

  const updateUserProfile = async (
    profileData: { name?: string; phone?: string }
  ): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to update your profile');
      return false;
    }

    try {
      // Get current metadata
      const currentMetadata = user.user_metadata || {};
      
      // Update the user metadata
      const { error } = await supabase.auth.updateUser({
        data: {
          ...currentMetadata,
          ...profileData
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating user profile:', error);
      toast.error('Failed to update profile');
      return false;
    }
  };

  return {
    uploadProfileImage,
    removeProfileImage,
    updateUserProfile,
    uploading
  };
}
