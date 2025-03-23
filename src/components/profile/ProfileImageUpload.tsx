
import React, { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Worker } from '@/services/workerService';

interface ProfileImageUploadProps {
  worker: Worker | null;
  isEditing: boolean;
  onImageUpload: (file: File) => Promise<void>;
  onImageRemove?: () => Promise<void>;
  uploading: boolean;
}

const ProfileImageUpload = ({
  worker,
  isEditing,
  onImageUpload,
  onImageRemove,
  uploading
}: ProfileImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProfilePictureClick = () => {
    if (!isEditing) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    
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
    
    await onImageUpload(file);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="relative mx-auto w-fit">
      <Avatar 
        className={`w-24 h-24 mx-auto mb-4 border-4 border-white shadow ${isEditing ? 'cursor-pointer hover:opacity-90' : ''}`}
        onClick={handleProfilePictureClick}
      >
        <AvatarImage src={worker?.image_url || ''} />
        <AvatarFallback className="bg-app-orange text-white text-xl">
          {worker ? getInitials(worker.name) : 'U'}
        </AvatarFallback>
        {isEditing && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full opacity-0 hover:opacity-100 transition-opacity">
            <Camera className="h-8 w-8 text-white" />
          </div>
        )}
      </Avatar>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      {isEditing && worker?.image_url && onImageRemove && (
        <Button
          variant="outline"
          size="sm"
          className="absolute top-0 right-0 rounded-full p-1 h-6 w-6"
          onClick={(e) => {
            e.stopPropagation();
            onImageRemove();
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      {uploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
          <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full"></div>
        </div>
      )}
      {isEditing && <p className="text-center text-sm text-gray-500 mt-2">Click to change photo</p>}
    </div>
  );
};

export default ProfileImageUpload;
