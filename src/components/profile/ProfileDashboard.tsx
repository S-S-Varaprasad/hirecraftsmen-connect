
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User, FileEdit, Check, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUserProfileStorage } from '@/hooks/useUserProfileStorage';

const ProfileDashboard = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.user_metadata?.name || '');
  const [phone, setPhone] = useState(user?.user_metadata?.phone || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const { 
    uploadProfileImage, 
    removeProfileImage, 
    updateUserProfile,
    uploading 
  } = useUserProfileStorage();

  // Get user initials for the avatar fallback
  const getInitials = () => {
    if (!user) return 'U';
    const name = user.user_metadata?.name || user.email || '';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Profile image must be smaller than 5MB');
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('File must be an image');
        return;
      }
      
      setSelectedFile(file);
      
      // Create preview URL
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  };

  const handleRemoveProfilePicture = async () => {
    await removeProfileImage();
    setPreviewUrl(null);
    setSelectedFile(null);
  };

  const handleSaveChanges = async () => {
    // Upload profile picture if selected
    if (selectedFile) {
      await uploadProfileImage(selectedFile);
    }
    
    // Update user profile data
    const success = await updateUserProfile({
      name,
      phone
    });
    
    if (success) {
      setIsEditing(false);
      setPreviewUrl(null);
      setSelectedFile(null);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setName(user?.user_metadata?.name || '');
    setPhone(user?.user_metadata?.phone || '');
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <User className="mr-2 h-5 w-5 text-app-orange" />
            Personal Information
          </CardTitle>
          {!isEditing ? (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1"
            >
              <FileEdit className="h-4 w-4" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleCancelEdit}
                className="flex items-center gap-1"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button 
                variant="orange" 
                size="sm"
                onClick={handleSaveChanges}
                disabled={uploading}
                className="flex items-center gap-1"
              >
                <Check className="h-4 w-4" />
                Save
              </Button>
            </div>
          )}
        </div>
        <CardDescription>
          Your personal details and contact information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <div className="relative">
            <Avatar className="w-24 h-24 border-4 border-white shadow">
              <AvatarImage src={previewUrl || user?.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-app-orange text-white text-xl">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            
            {isEditing && (
              <div className="mt-2 flex flex-col gap-2">
                <label 
                  htmlFor="profile-image" 
                  className="cursor-pointer text-center px-2 py-1 text-xs bg-app-orange text-white rounded hover:bg-app-orange/90 transition"
                >
                  Select Image
                </label>
                <input 
                  id="profile-image" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleProfilePictureChange}
                />
                
                {(user?.user_metadata?.avatar_url || previewUrl) && (
                  <button 
                    onClick={handleRemoveProfilePicture}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Remove Image
                  </button>
                )}
              </div>
            )}
            
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full"></div>
              </div>
            )}
          </div>
          
          <div className="space-y-4 flex-1">
            {isEditing ? (
              <>
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="mt-1 text-gray-600">{user?.email}</p>
                  <p className="text-xs text-gray-500 mt-1">Email can't be changed</p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="mt-1 text-gray-600">{user?.email}</p>
                </div>
                
                {user?.user_metadata?.phone && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                    <p className="mt-1 text-gray-600">{user.user_metadata.phone}</p>
                  </div>
                )}
                
                {user?.user_metadata?.name && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Name</h3>
                    <p className="mt-1 text-gray-600">{user.user_metadata.name}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileDashboard;
