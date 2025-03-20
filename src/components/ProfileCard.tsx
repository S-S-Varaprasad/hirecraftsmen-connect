
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Clock, Briefcase, Eye, BriefcaseBusiness, Upload, Check, X, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { updateWorkerProfilePicture } from '@/services/workerService';
import { useStorage } from '@/hooks/useStorage';
import { toast } from 'sonner';

interface ProfileCardProps {
  id: string;
  name: string;
  profession: string;
  location: string;
  rating: number;
  experience: string;
  hourlyRate: string;
  skills: string[];
  isAvailable: boolean;
  imageUrl: string;
  userId?: string | null;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  id,
  name,
  profession,
  location,
  rating,
  experience,
  hourlyRate,
  skills,
  isAvailable,
  imageUrl,
  userId,
}) => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [editingImage, setEditingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile } = useStorage();

  // Get the initials for the fallback avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Check if the current user owns this worker profile
  const isOwner = user && user.id === userId;

  const handleProfilePictureClick = () => {
    if (isOwner && !uploading) {
      setEditingImage(true);
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `worker_${id}_${Date.now()}.${fileExt}`;
      
      const publicUrl = await uploadFile('public', fileName, file);
      
      if (publicUrl) {
        await updateWorkerProfilePicture(id, publicUrl);
        toast.success('Profile picture updated successfully');
        // Force a refresh of the page to show the new image
        window.location.reload();
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast.error('Failed to update profile picture');
    } finally {
      setUploading(false);
      setEditingImage(false);
    }
  };

  const cancelImageEdit = () => {
    setEditingImage(false);
  };

  return (
    <div className="group relative rounded-xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-card hover:shadow-elevated transition-all duration-300 animate-in">
      <div className="absolute top-4 right-4 z-10">
        <Badge variant={isAvailable ? "default" : "secondary"} className={`flex items-center gap-1 px-2 py-1 text-xs ${isAvailable ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'}`}>
          <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-green-200' : 'bg-gray-300'}`}></span>
          {isAvailable ? 'Available' : 'Unavailable'}
        </Badge>
      </div>
      
      <div className="flex flex-col h-full">
        <div className="relative pt-6 px-6 pb-4 flex flex-col items-center text-center">
          {isOwner && (
            <div className="absolute top-0 right-0 mt-1 mr-1 z-20">
              {editingImage ? (
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 w-7 p-0 rounded-full bg-white shadow-sm"
                    onClick={cancelImageEdit}
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 w-7 p-0 rounded-full bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setEditingImage(true)}
                >
                  <Upload className="h-4 w-4 text-gray-600" />
                </Button>
              )}
            </div>
          )}
          
          <div className="relative">
            <Avatar 
              className={`w-24 h-24 mb-4 border-4 border-primary/10 dark:border-primary/20 ring-2 ring-primary/20 shadow-lg ${isOwner ? 'cursor-pointer hover:opacity-90' : ''}`}
              onClick={isOwner ? handleProfilePictureClick : undefined}
            >
              <AvatarImage 
                src={imageUrl} 
                alt={name}
                className="object-cover"
              />
              <AvatarFallback className="text-lg font-medium bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary/90">
                {getInitials(name)}
              </AvatarFallback>
            </Avatar>
            
            {isOwner && editingImage && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileInputChange}
                />
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-white hover:bg-black/30"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-5 w-5 mr-1" />
                  Upload
                </Button>
              </div>
            )}
            
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full"></div>
              </div>
            )}
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{profession}</p>
          
          <div className="flex items-center mt-2 mb-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star 
                key={i} 
                className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} 
              />
            ))}
            <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">{rating.toFixed(1)}</span>
          </div>

          <div className="flex items-center mt-2 text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{location}</span>
          </div>
        </div>
        
        <div className="flex-1 px-6 pb-4">
          <div className="flex flex-wrap gap-1 mb-4">
            {skills.slice(0, 3).map((skill, i) => (
              <Badge key={i} variant="outline" className="bg-gray-50 dark:bg-gray-800">{skill}</Badge>
            ))}
            {skills.length > 3 && (
              <Badge variant="outline" className="bg-transparent">+{skills.length - 3}</Badge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
            <div className="flex items-center">
              <Briefcase className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">{experience}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">{hourlyRate}/hr</span>
            </div>
          </div>
        </div>
        
        <div className="pt-4 px-6 pb-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="hover:bg-primary/10 hover:text-primary hover:border-primary/20 dark:hover:bg-primary/10 dark:hover:border-primary/30" asChild>
              <Link to={`/message/${id}`}>Message</Link>
            </Button>
            <Button className="bg-primary hover:bg-primary/90" asChild>
              <Link to={`/workers/${id}`}><Eye className="w-4 h-4 mr-1" />View Profile</Link>
            </Button>
            <Button variant="default" className="col-span-2 mt-2 btn-hire-me" asChild>
              <Link to={`/apply/${id}`}><BriefcaseBusiness className="w-4 h-4 mr-1" />Hire Me</Link>
            </Button>
            {isOwner && (
              <>
                <Button variant="outline" className="col-span-1 mt-2 hover:bg-amber-100 hover:text-amber-800 hover:border-amber-300" asChild>
                  <Link to={`/deactivate-worker/${id}`}><AlertCircle className="w-4 h-4 mr-1" />Deactivate</Link>
                </Button>
                <Button variant="outline" className="col-span-1 mt-2 hover:bg-red-100 hover:text-red-800 hover:border-red-300" asChild>
                  <Link to={`/workers/delete/${id}`}><Trash2 className="w-4 h-4 mr-1" />Delete</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
