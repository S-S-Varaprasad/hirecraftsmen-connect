
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Briefcase, Building } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getWorkerByUserId, Worker } from '@/services/workerService';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Import our new components
import ProfileDashboard from '@/components/profile/ProfileDashboard';
import ProfileDisplay from '@/components/profile/ProfileDisplay';
import ProfileEditForm from '@/components/profile/ProfileEditForm';
import PasswordManager from '@/components/profile/PasswordManager';
import { useWorkerProfileStorage } from '@/hooks/useWorkerProfileStorage';
import { ensureStorageBuckets } from '@/services/storageService';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [worker, setWorker] = useState<Worker | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  
  const { 
    uploadProfileImage, 
    removeProfileImage, 
    updateWorkerProfile, 
    uploading 
  } = useWorkerProfileStorage();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const initializeResources = async () => {
      try {
        // Ensure storage buckets exist
        await ensureStorageBuckets();
      } catch (error) {
        console.error('Error initializing resources:', error);
      }
    };

    initializeResources();

    const fetchWorkerProfile = async () => {
      try {
        setLoading(true);
        if (user.id) {
          const workerData = await getWorkerByUserId(user.id);
          setWorker(workerData);
        }
      } catch (error) {
        console.error('Error fetching worker profile:', error);
        toast.error('Failed to load your profile');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkerProfile();
  }, [user, navigate]);

  const handleProfileImageUpload = async (file: File) => {
    if (!worker) return;
    
    const updatedWorker = await uploadProfileImage(worker.id, file);
    if (updatedWorker) {
      setWorker(updatedWorker);
    }
  };

  const handleProfileImageRemove = async () => {
    if (!worker) return;
    
    const updatedWorker = await removeProfileImage(worker.id);
    if (updatedWorker) {
      setWorker(updatedWorker);
    }
  };

  const handleProfileUpdate = async (data: any) => {
    if (!worker) return;
    
    try {
      const skillsArray = data.skills?.split(',').map((skill: string) => skill.trim()).filter(Boolean) || [];
      const languagesArray = data.languages?.split(',').map((language: string) => language.trim()).filter(Boolean) || [];
      
      const updatedWorker = await updateWorkerProfile(worker.id, {
        name: data.name,
        profession: data.profession,
        location: data.location,
        experience: data.experience,
        hourly_rate: data.hourly_rate,
        about: data.about || null,
        skills: skillsArray,
        languages: languagesArray,
        is_available: data.is_available
      });
      
      if (updatedWorker) {
        setWorker(updatedWorker);
        setEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update your profile');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col app-page-background">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">Your Profile</h1>
          
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="bg-white dark:bg-gray-800 p-1 shadow-sm rounded-lg">
              <TabsTrigger value="personal">Personal Information</TabsTrigger>
              <TabsTrigger value="work">Work Profile</TabsTrigger>
              <TabsTrigger value="account">Account Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal" className="space-y-6">
              <ProfileDashboard />
            </TabsContent>
            
            <TabsContent value="work" className="space-y-6">
              {loading ? (
                <Card>
                  <CardContent className="py-10">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-app-orange"></div>
                    </div>
                  </CardContent>
                </Card>
              ) : worker ? (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                      <CardTitle className="flex items-center">
                        <Briefcase className="mr-2 h-5 w-5 text-app-orange" />
                        Work Profile
                      </CardTitle>
                      <CardDescription>
                        Your professional information and skills
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {editing ? (
                      <ProfileEditForm 
                        worker={worker}
                        onSubmit={handleProfileUpdate}
                        onCancel={() => setEditing(false)}
                        onImageUpload={handleProfileImageUpload}
                        onImageRemove={handleProfileImageRemove}
                        uploading={uploading}
                      />
                    ) : (
                      <ProfileDisplay 
                        worker={worker}
                        onEdit={() => setEditing(true)}
                      />
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="py-10 text-center">
                    <Building className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium mb-2">No Worker Profile Found</h3>
                    <p className="text-gray-500 mb-6">You don't have a worker profile yet</p>
                    <Button 
                      onClick={() => navigate('/join-as-worker')} 
                      className="bg-app-orange hover:bg-app-orange/90"
                    >
                      Create Worker Profile
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="account" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="mr-2 h-5 w-5 text-app-orange" />
                    Account Settings
                  </CardTitle>
                  <CardDescription>
                    Manage your account password and security
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PasswordManager />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
