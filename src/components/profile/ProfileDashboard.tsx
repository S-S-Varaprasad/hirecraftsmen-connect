
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';

const ProfileDashboard = () => {
  const { user } = useAuth();

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="mr-2 h-5 w-5 text-app-orange" />
          Personal Information
        </CardTitle>
        <CardDescription>
          Your personal details and contact information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <Avatar className="w-24 h-24 border-4 border-white shadow">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-app-orange text-white text-xl">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          
          <div className="space-y-4 flex-1">
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileDashboard;
