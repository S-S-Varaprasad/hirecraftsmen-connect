
import React, { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Camera, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileImageUploadProps {
  profileImagePreview: string | null;
  setProfileImagePreview: (preview: string | null) => void;
  setProfileImage: (file: File | null) => void;
}

const ProfileImageUpload = ({ 
  profileImagePreview, 
  setProfileImagePreview, 
  setProfileImage 
}: ProfileImageUploadProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];

    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Profile image must be smaller than 5MB');
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('File must be an image');
        return;
      }
      
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="flex justify-center mb-6">
        <div className="relative group cursor-pointer">
          <Avatar className="w-24 h-24 border-4 border-gray-100">
            {profileImagePreview ? (
              <AvatarImage src={profileImagePreview} alt="Profile Preview" />
            ) : (
              <AvatarFallback className="bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <Camera className="h-8 w-8 text-gray-400" />
              </AvatarFallback>
            )}
          </Avatar>
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Upload className="h-6 w-6 text-white" />
          </div>
          <input
            type="file"
            id="profileImage"
            name="profileImage"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>
      <p className="text-center text-sm text-gray-500 mb-6">Click the avatar to upload your profile picture</p>
    </>
  );
};

export default ProfileImageUpload;
