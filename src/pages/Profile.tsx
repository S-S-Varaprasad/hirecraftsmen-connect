
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Mail, MapPin, Phone, Briefcase, Clock, FileEdit, Building, Upload, X, Check, Save, Camera } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getWorkerByUserId, updateWorker, updateWorkerProfilePicture } from '@/services/workerService';
import { Worker } from '@/services/workerService';
import { useToast } from '@/hooks/use-toast';
import { useStorage } from '@/hooks/useStorage';
import { toast } from 'sonner';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  const [worker, setWorker] = useState<Worker | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, isLoading: isUploadLoading, error: uploadError } = useStorage();
  
  const [formData, setFormData] = useState({
    name: '',
    profession: '',
    location: '',
    experience: '',
    hourly_rate: '',
    about: '',
    skills: [] as string[],
    is_available: true
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchWorkerProfile = async () => {
      try {
        setLoading(true);
        if (user.id) {
          const workerData = await getWorkerByUserId(user.id);
          setWorker(workerData);
          if (workerData) {
            setFormData({
              name: workerData.name,
              profession: workerData.profession,
              location: workerData.location,
              experience: workerData.experience,
              hourly_rate: workerData.hourly_rate,
              about: workerData.about || '',
              skills: workerData.skills,
              is_available: workerData.is_available
            });
          }
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skillsArray = e.target.value.split(',').map(skill => skill.trim());
    setFormData({ ...formData, skills: skillsArray });
  };

  const handleAvailabilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, is_available: e.target.checked });
  };

  const handleProfilePictureClick = () => {
    if (!editing || !worker) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!worker || !e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `worker_${worker.id}_${Date.now()}.${fileExt}`;
      
      const publicUrl = await uploadFile('public', fileName, file);
      
      if (publicUrl) {
        const updatedWorker = await updateWorkerProfilePicture(worker.id, publicUrl);
        setWorker(updatedWorker);
        toast.success('Profile picture updated successfully');
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast.error('Failed to update profile picture');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!worker) return;
    
    try {
      const updatedWorker = await updateWorker(worker.id, {
        name: formData.name,
        profession: formData.profession,
        location: formData.location,
        experience: formData.experience,
        hourly_rate: formData.hourly_rate,
        about: formData.about,
        skills: formData.skills,
        is_available: formData.is_available
      });
      
      setWorker(updatedWorker);
      setEditing(false);
      toast.success('Your profile has been updated');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update your profile');
    }
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="mr-2 h-5 w-5 text-orange-500" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Your personal details and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                    <div className="relative">
                      <Avatar 
                        className={`w-24 h-24 border-4 border-white shadow ${editing ? 'cursor-pointer hover:opacity-90' : ''}`}
                        onClick={handleProfilePictureClick}
                      >
                        <AvatarImage src={user.user_metadata?.avatar_url} />
                        <AvatarFallback className="bg-orange-100 text-orange-800 text-xl">
                          {user.email ? getInitials(user.email) : "U"}
                        </AvatarFallback>
                        {editing && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full opacity-0 hover:opacity-100 transition-opacity">
                            <Upload className="h-8 w-8 text-white" />
                          </div>
                        )}
                      </Avatar>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept="image/*" 
                        className="hidden" 
                      />
                      {uploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                          <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full"></div>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-4 flex-1">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <div className="flex items-center mt-1 gap-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600 dark:text-gray-400">{user.email}</span>
                        </div>
                      </div>
                      
                      {user.user_metadata?.phone && (
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <div className="flex items-center mt-1 gap-2">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-600 dark:text-gray-400">{user.user_metadata.phone}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="work" className="space-y-6">
              {loading ? (
                <Card>
                  <CardContent className="py-10">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
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
                    <Button 
                      variant={editing ? "outline" : "orange"}
                      size="sm" 
                      onClick={() => setEditing(!editing)}
                      className="flex items-center gap-1"
                    >
                      {editing ? (
                        <>
                          <X className="h-4 w-4" />
                          Cancel
                        </>
                      ) : (
                        <>
                          <FileEdit className="h-4 w-4" />
                          Edit Profile
                        </>
                      )}
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {editing ? (
                      <div className="space-y-4">
                        <div className="relative mx-auto w-fit">
                          <Avatar 
                            className="w-24 h-24 mx-auto mb-4 border-4 border-white shadow cursor-pointer hover:opacity-90"
                            onClick={handleProfilePictureClick}
                          >
                            <AvatarImage src={worker.image_url || ''} />
                            <AvatarFallback className="bg-app-orange/10 text-app-orange text-xl">
                              {getInitials(worker.name)}
                            </AvatarFallback>
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full opacity-0 hover:opacity-100 transition-opacity">
                              <Camera className="h-8 w-8 text-white" />
                            </div>
                          </Avatar>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                          {worker.image_url && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="absolute top-0 right-0 rounded-full p-1 h-6 w-6"
                              onClick={async (e) => {
                                e.stopPropagation();
                                await updateWorkerProfilePicture(worker.id, '');
                                setWorker({...worker, image_url: null});
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
                          <p className="text-center text-sm text-gray-500 mt-2">Click to change photo</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="profession">Profession</Label>
                            <Input
                              id="profession"
                              name="profession"
                              value={formData.profession}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                              id="location"
                              name="location"
                              value={formData.location}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="experience">Years of Experience</Label>
                            <Input
                              id="experience"
                              name="experience"
                              value={formData.experience}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="hourly_rate">Hourly Rate</Label>
                            <Input
                              id="hourly_rate"
                              name="hourly_rate"
                              value={formData.hourly_rate}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="skills">Skills (comma separated)</Label>
                            <Input
                              id="skills"
                              name="skills"
                              value={formData.skills.join(', ')}
                              onChange={handleSkillsChange}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="about">About</Label>
                          <Textarea
                            id="about"
                            name="about"
                            value={formData.about}
                            onChange={handleInputChange}
                            rows={4}
                          />
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="is_available"
                            checked={formData.is_available}
                            onChange={handleAvailabilityChange}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor="is_available">Available for work</Label>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="flex justify-center mb-6">
                          <Avatar className="w-32 h-32 border-4 border-white shadow">
                            <AvatarImage 
                              src={worker.image_url || ''} 
                              alt={worker.name}
                            />
                            <AvatarFallback className="bg-orange-100 text-orange-800 text-2xl">
                              {getInitials(worker.name)}
                            </AvatarFallback>
                          </Avatar>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                            <p className="mt-1 text-base font-medium">{worker.name}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Profession</h3>
                            <p className="mt-1 text-base font-medium">{worker.profession}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Location</h3>
                            <div className="mt-1 flex items-center">
                              <MapPin className="w-4 h-4 mr-1 text-gray-500" />
                              <span>{worker.location}</span>
                            </div>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Experience</h3>
                            <div className="mt-1 flex items-center">
                              <Clock className="w-4 h-4 mr-1 text-gray-500" />
                              <span>{worker.experience}</span>
                            </div>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Hourly Rate</h3>
                            <p className="mt-1 text-base font-medium">{worker.hourly_rate}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Availability</h3>
                            <p className="mt-1">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                worker.is_available ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {worker.is_available ? 'Available' : 'Not Available'}
                              </span>
                            </p>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Skills</h3>
                          <div className="mt-1 flex flex-wrap gap-2">
                            {worker.skills.map((skill, index) => (
                              <span 
                                key={index} 
                                className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {worker.about && (
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">About</h3>
                            <p className="mt-1 text-gray-600 dark:text-gray-400">{worker.about}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                  {editing && (
                    <CardFooter className="flex justify-end pt-4 gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setEditing(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        variant="orange" 
                        onClick={handleSave}
                        className="flex items-center gap-1"
                      >
                        <Save className="h-4 w-4" />
                        Save Changes
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              ) : (
                <Card>
                  <CardContent className="py-10 text-center">
                    <Building className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium mb-2">No Worker Profile Found</h3>
                    <p className="text-gray-500 mb-6">You don't have a worker profile yet</p>
                    <Button 
                      onClick={() => navigate('/join-as-worker')} 
                      className="bg-orange-500 hover:bg-orange-600"
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
                    <User className="mr-2 h-5 w-5 text-orange-500" />
                    Account Settings
                  </CardTitle>
                  <CardDescription>
                    Manage your account settings and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input type="password" id="current-password" placeholder="••••••••" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input type="password" id="new-password" placeholder="••••••••" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input type="password" id="confirm-password" placeholder="••••••••" />
                  </div>
                  <Button className="bg-orange-500 hover:bg-orange-600 mt-2">
                    Update Password
                  </Button>
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
