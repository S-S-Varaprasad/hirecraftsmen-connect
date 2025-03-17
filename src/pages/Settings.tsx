
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings as SettingsIcon, Bell, Lock, UserCog, Palette, Moon, Sun, Globe } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';

const Settings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  
  const [notifications, setNotifications] = useState({
    email: true,
    app: true,
    jobUpdates: true,
    messages: true,
    marketing: false
  });
  
  const [appearance, setAppearance] = useState({
    darkMode: false,
    highContrast: false,
    fontSize: 'medium'
  });
  
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    activityStatus: true,
    contactInfo: 'authenticated'
  });

  // Save settings to localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      if (parsedSettings.notifications) setNotifications(parsedSettings.notifications);
      if (parsedSettings.appearance) setAppearance(parsedSettings.appearance);
      if (parsedSettings.privacy) setPrivacy(parsedSettings.privacy);
    }
  }, []);

  // Save settings when they change
  useEffect(() => {
    localStorage.setItem('userSettings', JSON.stringify({
      notifications,
      appearance,
      privacy
    }));
  }, [notifications, appearance, privacy]);

  // Handle toggles for notification settings
  const handleNotificationChange = (setting: keyof typeof notifications) => {
    setNotifications(prev => {
      const updated = {
        ...prev,
        [setting]: !prev[setting]
      };

      toast.success("Notification settings updated");
      return updated;
    });
  };
  
  // Handle toggles for appearance settings
  const handleAppearanceChange = (setting: keyof typeof appearance, value: any) => {
    setAppearance(prev => {
      const updated = {
        ...prev,
        [setting]: typeof value === 'boolean' ? value : value
      };

      // Apply dark mode immediately if changed
      if (setting === 'darkMode') {
        document.documentElement.classList.toggle('dark', value);
      }

      toast.success("Appearance settings updated");
      return updated;
    });
  };
  
  // Handle toggles for privacy settings
  const handlePrivacyChange = (setting: keyof typeof privacy, value: any) => {
    setPrivacy(prev => {
      const updated = {
        ...prev,
        [setting]: value
      };

      toast.success("Privacy settings updated");
      return updated;
    });
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 dark:bg-gray-900 pt-32 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">Settings</h1>
          
          <Tabs defaultValue="notifications" className="space-y-6">
            <TabsList className="bg-white dark:bg-gray-800 p-1 shadow-sm rounded-lg">
              <TabsTrigger value="notifications" className="flex items-center gap-1.5">
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-1.5">
                <Palette className="h-4 w-4" />
                Appearance
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-1.5">
                <Lock className="h-4 w-4" />
                Privacy
              </TabsTrigger>
              <TabsTrigger value="account" className="flex items-center gap-1.5">
                <UserCog className="h-4 w-4" />
                Account
              </TabsTrigger>
            </TabsList>
            
            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="mr-2 h-5 w-5 text-orange-500" />
                    Notification Settings
                  </CardTitle>
                  <CardDescription>
                    Manage how you receive notifications and updates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Email Notifications</h4>
                        <p className="text-sm text-gray-500">Receive notifications via email</p>
                      </div>
                      <Switch 
                        checked={notifications.email} 
                        onCheckedChange={() => handleNotificationChange('email')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">App Notifications</h4>
                        <p className="text-sm text-gray-500">Receive notifications in the app</p>
                      </div>
                      <Switch 
                        checked={notifications.app} 
                        onCheckedChange={() => handleNotificationChange('app')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Job Updates</h4>
                        <p className="text-sm text-gray-500">Get notified about new jobs and applications</p>
                      </div>
                      <Switch 
                        checked={notifications.jobUpdates} 
                        onCheckedChange={() => handleNotificationChange('jobUpdates')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Messages</h4>
                        <p className="text-sm text-gray-500">Receive notifications for new messages</p>
                      </div>
                      <Switch 
                        checked={notifications.messages} 
                        onCheckedChange={() => handleNotificationChange('messages')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Marketing & Promotions</h4>
                        <p className="text-sm text-gray-500">Receive news and promotional content</p>
                      </div>
                      <Switch 
                        checked={notifications.marketing} 
                        onCheckedChange={() => handleNotificationChange('marketing')}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Appearance Tab */}
            <TabsContent value="appearance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Palette className="mr-2 h-5 w-5 text-orange-500" />
                    Appearance Settings
                  </CardTitle>
                  <CardDescription>
                    Customize how the app looks and feels
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Moon className="h-5 w-5 text-gray-600" />
                        <div>
                          <h4 className="font-medium">Dark Mode</h4>
                          <p className="text-sm text-gray-500">Switch between light and dark themes</p>
                        </div>
                      </div>
                      <Switch 
                        checked={appearance.darkMode} 
                        onCheckedChange={(value) => handleAppearanceChange('darkMode', value)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">High Contrast</h4>
                        <p className="text-sm text-gray-500">Increase contrast for better readability</p>
                      </div>
                      <Switch 
                        checked={appearance.highContrast} 
                        onCheckedChange={(value) => handleAppearanceChange('highContrast', value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Font Size</h4>
                      <div className="flex space-x-4">
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            id="font-small" 
                            name="fontSize" 
                            value="small"
                            checked={appearance.fontSize === 'small'}
                            onChange={() => handleAppearanceChange('fontSize', 'small')}
                            className="mr-2"
                          />
                          <Label htmlFor="font-small">Small</Label>
                        </div>
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            id="font-medium" 
                            name="fontSize" 
                            value="medium"
                            checked={appearance.fontSize === 'medium'}
                            onChange={() => handleAppearanceChange('fontSize', 'medium')}
                            className="mr-2"
                          />
                          <Label htmlFor="font-medium">Medium</Label>
                        </div>
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            id="font-large" 
                            name="fontSize" 
                            value="large"
                            checked={appearance.fontSize === 'large'}
                            onChange={() => handleAppearanceChange('fontSize', 'large')}
                            className="mr-2"
                          />
                          <Label htmlFor="font-large">Large</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Privacy Tab */}
            <TabsContent value="privacy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lock className="mr-2 h-5 w-5 text-orange-500" />
                    Privacy Settings
                  </CardTitle>
                  <CardDescription>
                    Manage your privacy and security preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Profile Visibility</h4>
                      <div className="flex space-x-4">
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            id="visibility-public" 
                            name="profileVisibility" 
                            value="public"
                            checked={privacy.profileVisibility === 'public'}
                            onChange={() => handlePrivacyChange('profileVisibility', 'public')}
                            className="mr-2"
                          />
                          <Label htmlFor="visibility-public">Public</Label>
                        </div>
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            id="visibility-authenticated" 
                            name="profileVisibility" 
                            value="authenticated"
                            checked={privacy.profileVisibility === 'authenticated'}
                            onChange={() => handlePrivacyChange('profileVisibility', 'authenticated')}
                            className="mr-2"
                          />
                          <Label htmlFor="visibility-authenticated">Registered Users</Label>
                        </div>
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            id="visibility-private" 
                            name="profileVisibility" 
                            value="private"
                            checked={privacy.profileVisibility === 'private'}
                            onChange={() => handlePrivacyChange('profileVisibility', 'private')}
                            className="mr-2"
                          />
                          <Label htmlFor="visibility-private">Private</Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Show Activity Status</h4>
                        <p className="text-sm text-gray-500">Let others know when you're online</p>
                      </div>
                      <Switch 
                        checked={privacy.activityStatus} 
                        onCheckedChange={(value) => handlePrivacyChange('activityStatus', value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Contact Information Visibility</h4>
                      <div className="flex space-x-4">
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            id="contact-public" 
                            name="contactInfo" 
                            value="public"
                            checked={privacy.contactInfo === 'public'}
                            onChange={() => handlePrivacyChange('contactInfo', 'public')}
                            className="mr-2"
                          />
                          <Label htmlFor="contact-public">Public</Label>
                        </div>
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            id="contact-authenticated" 
                            name="contactInfo" 
                            value="authenticated"
                            checked={privacy.contactInfo === 'authenticated'}
                            onChange={() => handlePrivacyChange('contactInfo', 'authenticated')}
                            className="mr-2"
                          />
                          <Label htmlFor="contact-authenticated">Registered Users</Label>
                        </div>
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            id="contact-private" 
                            name="contactInfo" 
                            value="private"
                            checked={privacy.contactInfo === 'private'}
                            onChange={() => handlePrivacyChange('contactInfo', 'private')}
                            className="mr-2"
                          />
                          <Label htmlFor="contact-private">Private</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Account Tab */}
            <TabsContent value="account" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <UserCog className="mr-2 h-5 w-5 text-orange-500" />
                    Account Settings
                  </CardTitle>
                  <CardDescription>
                    Manage your account preferences and details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <h4 className="font-medium">Language Preference</h4>
                    <div className="flex items-center space-x-2">
                      <Globe className="h-5 w-5 text-gray-500" />
                      <select className="border border-gray-300 rounded-md p-2 w-full max-w-xs">
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                        <option value="ta">Tamil</option>
                        <option value="te">Telugu</option>
                        <option value="kn">Kannada</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="pt-4 space-y-4">
                    <h4 className="font-medium text-red-600">Danger Zone</h4>
                    
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full max-w-xs border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700">
                        Deactivate Account
                      </Button>
                      <p className="text-sm text-gray-500">
                        Temporarily disable your account
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Button variant="destructive" className="w-full max-w-xs">
                        Delete Account
                      </Button>
                      <p className="text-sm text-gray-500">
                        Permanently delete your account and all data
                      </p>
                    </div>
                  </div>
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

export default Settings;
