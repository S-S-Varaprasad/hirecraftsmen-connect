
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
import { 
  User, Mail, MapPin, Phone, Briefcase, Clock, FileEdit, 
  Building, Upload, X, Check, Save, Camera, DollarSign, 
  Award, Hammer, Edit, Loader2, UserCheck, Trash
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getWorkerByUserId, updateWorker, updateWorkerProfilePicture, Worker } from '@/services/workerService';
import { useToast } from '@/hooks/use-toast';
import { useStorage } from '@/hooks/useStorage';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Define schema for validation
const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  profession: z.string().min(2, "Profession is required"),
  location: z.string().min(2, "Location is required"),
  experience: z.string().min(1, "Experience is required"),
  hourly_rate: z.string().min(1, "Hourly rate is required"),
  about: z.string().optional(),
  skills: z.string().optional(),
  is_available: z.boolean().default(true)
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  const [worker, setWorker] = useState<Worker | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isPasswordChanging, setIsPasswordChanging] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showDeleteSkillModal, setShowDeleteSkillModal] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, isLoading: isUploadLoading, error: uploadError } = useStorage();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      profession: '',
      location: '',
      experience: '',
      hourly_rate: '',
      about: '',
      skills: '',
      is_available: true
    }
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
            form.reset({
              name: workerData.name,
              profession: workerData.profession,
              location: workerData.location,
              experience: workerData.experience,
              hourly_rate: workerData.hourly_rate,
              about: workerData.about || '',
              skills: workerData.skills.join(', '),
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
  }, [user, navigate, form]);

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

  const onSubmit = async (data: ProfileFormValues) => {
    if (!worker) return;
    
    try {
      const skillsArray = data.skills?.split(',').map(skill => skill.trim()).filter(Boolean) || [];
      
      const updatedWorker = await updateWorker(worker.id, {
        name: data.name,
        profession: data.profession,
        location: data.location,
        experience: data.experience,
        hourly_rate: data.hourly_rate,
        about: data.about || null,
        skills: skillsArray,
        is_available: data.is_available
      });
      
      setWorker(updatedWorker);
      setEditing(false);
      toast.success('Your profile has been updated');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update your profile');
    }
  };

  const handlePasswordChange = async () => {
    setIsPasswordChanging(true);
    
    try {
      if (newPassword !== confirmPassword) {
        toast.error("New passwords don't match");
        return;
      }
      
      // In a real implementation, you would call an API to update the password
      // For now, we'll just show a success message
      setTimeout(() => {
        toast.success("Password updated successfully");
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setIsPasswordChanging(false);
      }, 1000);
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password");
      setIsPasswordChanging(false);
    }
  };

  const handleDeleteSkill = (skill: string) => {
    setSkillToDelete(skill);
    setShowDeleteSkillModal(true);
  };

  const confirmDeleteSkill = async () => {
    if (!worker || !skillToDelete) return;
    
    try {
      const updatedSkills = worker.skills.filter(s => s !== skillToDelete);
      const updatedWorker = await updateWorker(worker.id, { skills: updatedSkills });
      setWorker(updatedWorker);
      
      // Update form values
      form.setValue('skills', updatedSkills.join(', '));
      
      toast.success(`Skill "${skillToDelete}" removed`);
      setShowDeleteSkillModal(false);
    } catch (error) {
      console.error('Error deleting skill:', error);
      toast.error('Failed to delete skill');
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
                    <User className="mr-2 h-5 w-5 text-app-orange" />
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
                        <AvatarFallback className="bg-app-orange text-white text-xl">
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
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                          <div className="relative mx-auto w-fit">
                            <Avatar 
                              className="w-24 h-24 mx-auto mb-4 border-4 border-white shadow cursor-pointer hover:opacity-90"
                              onClick={handleProfilePictureClick}
                            >
                              <AvatarImage src={worker.image_url || ''} />
                              <AvatarFallback className="bg-app-orange text-white text-xl">
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
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Full Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="profession"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Profession</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="location"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Location</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="experience"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Years of Experience</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="hourly_rate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Hourly Rate</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="skills"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Skills (comma separated)</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormDescription>
                                    Enter skills separated by commas
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="about"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>About</FormLabel>
                                <FormControl>
                                  <Textarea {...field} rows={4} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="is_available"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <input
                                    type="checkbox"
                                    checked={field.value}
                                    onChange={field.onChange}
                                    id="is_available"
                                    className="rounded border-gray-300"
                                  />
                                </FormControl>
                                <FormLabel htmlFor="is_available" className="!mt-0">Available for work</FormLabel>
                              </FormItem>
                            )}
                          />
                          
                          <div className="flex justify-end gap-2">
                            <Button 
                              type="button"
                              variant="outline" 
                              onClick={() => setEditing(false)}
                            >
                              Cancel
                            </Button>
                            <Button 
                              type="submit"
                              variant="orange" 
                              className="flex items-center gap-1"
                            >
                              <Save className="h-4 w-4" />
                              Save Changes
                            </Button>
                          </div>
                        </form>
                      </Form>
                    ) : (
                      <div className="space-y-6">
                        <div className="flex justify-center mb-6">
                          <Avatar className="w-32 h-32 border-4 border-white shadow">
                            <AvatarImage 
                              src={worker.image_url || ''} 
                              alt={worker.name}
                            />
                            <AvatarFallback className="bg-app-orange text-white text-2xl">
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
                            <div className="mt-1 flex items-center">
                              <DollarSign className="w-4 h-4 mr-1 text-gray-500" />
                              <span>{worker.hourly_rate}</span>
                            </div>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Availability</h3>
                            <p className="mt-1">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                worker.is_available ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {worker.is_available ? (
                                  <>
                                    <UserCheck className="w-3 h-3 mr-1" />
                                    Available
                                  </>
                                ) : (
                                  'Not Available'
                                )}
                              </span>
                            </p>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-2">Skills</h3>
                          <div className="flex flex-wrap gap-2">
                            {worker.skills.map((skill, index) => (
                              <span 
                                key={index} 
                                className="bg-app-orange/10 text-app-orange text-xs font-medium px-3 py-1 rounded-full flex items-center"
                              >
                                <Award className="w-3 h-3 mr-1" />
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
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input 
                      type="password" 
                      id="current-password" 
                      placeholder="••••••••" 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input 
                      type="password" 
                      id="new-password" 
                      placeholder="••••••••" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input 
                      type="password" 
                      id="confirm-password" 
                      placeholder="••••••••" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <Button 
                    className="bg-app-orange hover:bg-app-orange/90 mt-2"
                    onClick={handlePasswordChange}
                    disabled={isPasswordChanging || !currentPassword || !newPassword || !confirmPassword}
                  >
                    {isPasswordChanging ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Updating Password...
                      </>
                    ) : (
                      'Update Password'
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />

      {/* Delete Skill Confirmation Dialog */}
      <AlertDialog open={showDeleteSkillModal} onOpenChange={setShowDeleteSkillModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Skill</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove "{skillToDelete}" from your skills? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={confirmDeleteSkill}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Profile;
