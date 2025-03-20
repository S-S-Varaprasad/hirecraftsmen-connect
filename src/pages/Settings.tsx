import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  Bell,
  Moon,
  Sun,
  Lock,
  UserCog,
  Trash2,
  AlertTriangle,
  LogOut,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/components/theme-provider';

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState('public');
  const [locationSharing, setLocationSharing] = useState(true);
  const [activityStatus, setActivityStatus] = useState(true);

  // Handle account deactivation
  const handleDeactivateAccount = () => {
    // Implement account deactivation logic here
    toast({
      title: "Account Deactivated",
      description: "Your account has been temporarily deactivated. You can reactivate it by logging in again.",
      variant: "destructive",
    });
    
    setTimeout(() => {
      signOut();
      navigate('/');
    }, 2000);
  };

  // Handle account deletion
  const handleDeleteAccount = () => {
    // Implement account deletion logic here
    toast({
      title: "Account Deleted",
      description: "Your account has been permanently deleted. We're sorry to see you go.",
      variant: "destructive",
    });
    
    setTimeout(() => {
      signOut();
      navigate('/');
    }, 2000);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-orange-50/40 dark:bg-gray-900">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 pt-24">
          <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-center mb-4">Authentication Required</h1>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
              Please log in to access your settings.
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" asChild>
                <Link to="/">Back to Home</Link>
              </Button>
              <Button asChild>
                <Link to="/login">Log In</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-orange-50/40 dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-6">Settings</h1>
              
              <Tabs defaultValue="appearance" className="w-full">
                <TabsList className="grid grid-cols-3 mb-8">
                  <TabsTrigger value="appearance" className="flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    <span className="hidden sm:inline">Appearance</span>
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    <span className="hidden sm:inline">Notifications</span>
                  </TabsTrigger>
                  <TabsTrigger value="privacy" className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    <span className="hidden sm:inline">Privacy</span>
                  </TabsTrigger>
                </TabsList>
                
                {/* Appearance Tab */}
                <TabsContent value="appearance" className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-850 rounded-lg p-6 space-y-6">
                    <h2 className="text-xl font-semibold mb-4">Theme Preferences</h2>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                        <Label htmlFor="dark-mode">Dark Mode</Label>
                      </div>
                      <Switch 
                        id="dark-mode" 
                        checked={theme === 'dark'}
                        onCheckedChange={(checked) => {
                          setTheme(checked ? 'dark' : 'light');
                          toast({
                            title: checked ? "Dark Mode Enabled" : "Light Mode Enabled",
                            description: checked ? "The dark side welcomes you." : "Let there be light!",
                          });
                        }}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                {/* Notifications Tab */}
                <TabsContent value="notifications" className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-850 rounded-lg p-6 space-y-6">
                    <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive updates via email</p>
                      </div>
                      <Switch 
                        checked={emailNotifications} 
                        onCheckedChange={(checked) => {
                          setEmailNotifications(checked);
                          toast({
                            title: checked ? "Email Notifications Enabled" : "Email Notifications Disabled",
                            description: checked ? "You will now receive email notifications." : "You will no longer receive email notifications.",
                          });
                        }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications in browser</p>
                      </div>
                      <Switch 
                        checked={pushNotifications} 
                        onCheckedChange={(checked) => {
                          setPushNotifications(checked);
                          toast({
                            title: checked ? "Push Notifications Enabled" : "Push Notifications Disabled",
                            description: checked ? "You will now receive push notifications." : "You will no longer receive push notifications.",
                          });
                        }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive text messages for urgent updates</p>
                      </div>
                      <Switch 
                        checked={smsNotifications} 
                        onCheckedChange={(checked) => {
                          setSmsNotifications(checked);
                          toast({
                            title: checked ? "SMS Notifications Enabled" : "SMS Notifications Disabled",
                            description: checked ? "You will now receive SMS notifications." : "You will no longer receive SMS notifications.",
                          });
                        }}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                {/* Privacy Tab */}
                <TabsContent value="privacy" className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-850 rounded-lg p-6 space-y-6">
                    <h2 className="text-xl font-semibold mb-4">Privacy Settings</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="profile-visibility" className="block mb-2">Profile Visibility</Label>
                        <Select 
                          value={profileVisibility} 
                          onValueChange={(value) => {
                            setProfileVisibility(value);
                            toast({
                              title: "Privacy Setting Updated",
                              description: `Your profile visibility is now set to ${value}.`,
                            });
                          }}
                        >
                          <SelectTrigger id="profile-visibility" className="w-full">
                            <SelectValue placeholder="Select visibility" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="contacts">Contacts Only</SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4">
                        <div>
                          <p className="font-medium">Location Sharing</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Allow the app to access your location</p>
                        </div>
                        <Switch 
                          checked={locationSharing} 
                          onCheckedChange={(checked) => {
                            setLocationSharing(checked);
                            toast({
                              title: checked ? "Location Sharing Enabled" : "Location Sharing Disabled",
                              description: checked ? "The app can now access your location." : "The app can no longer access your location.",
                            });
                          }}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between pt-4">
                        <div>
                          <p className="font-medium">Activity Status</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Show when you're active on the platform</p>
                        </div>
                        <Switch 
                          checked={activityStatus} 
                          onCheckedChange={(checked) => {
                            setActivityStatus(checked);
                            toast({
                              title: checked ? "Activity Status Enabled" : "Activity Status Disabled",
                              description: checked ? "Others can now see when you're active." : "Others can no longer see when you're active.",
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Account Tab */}
                <TabsContent value="account" className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-850 rounded-lg p-6 space-y-6">
                    <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
                    
                    <div className="space-y-4">
                      <div className="pt-2">
                        <h3 className="text-lg font-medium mb-4 text-red-500">Danger Zone</h3>
                        
                        <div className="space-y-4">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" className="border-red-200 text-red-500 hover:text-red-600 hover:bg-red-50 w-full justify-start">
                                <LogOut className="mr-2 h-4 w-4" />
                                Deactivate Account
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Deactivate Your Account?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Your account will be temporarily deactivated. You can reactivate it at any time by logging in again.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={handleDeactivateAccount}
                                  className="bg-red-500 text-white hover:bg-red-600"
                                >
                                  Deactivate
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" className="border-red-200 text-red-500 hover:text-red-600 hover:bg-red-50 w-full justify-start">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Account
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={handleDeleteAccount}
                                  className="bg-red-500 text-white hover:bg-red-600"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Settings;
