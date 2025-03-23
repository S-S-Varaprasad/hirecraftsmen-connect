
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Bell, BellOff, Mail, MessageSquare, Briefcase, Clock, Volume2, VolumeX, Trash } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';

// Sample notification settings (In a real app, these would be stored in the database)
interface NotificationSetting {
  id: string;
  name: string;
  description: string;
  type: string;
  enabled: boolean;
  email: boolean;
  push: boolean;
  category: string;
}

const initialSettings: NotificationSetting[] = [
  {
    id: 'new_job',
    name: 'New Job Alerts',
    description: 'Get notified when new jobs matching your skills are posted',
    type: 'new_job',
    enabled: true,
    email: true,
    push: true,
    category: 'job'
  },
  {
    id: 'job_application',
    name: 'Job Application Updates',
    description: 'Receive updates about your job applications',
    type: 'application',
    enabled: true,
    email: true,
    push: true,
    category: 'job'
  },
  {
    id: 'job_accepted',
    name: 'Application Accepted',
    description: 'Get notified when your job application is accepted',
    type: 'job_accepted',
    enabled: true,
    email: true,
    push: true,
    category: 'job'
  },
  {
    id: 'message',
    name: 'Messages',
    description: 'Get notified when you receive new messages',
    type: 'message',
    enabled: true,
    email: true,
    push: true,
    category: 'message'
  },
  {
    id: 'system',
    name: 'System Notifications',
    description: 'Important updates about your account and the platform',
    type: 'system',
    enabled: true,
    email: false,
    push: true,
    category: 'system'
  }
];

const NotificationSettings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { soundEnabled, toggleSound, markAllAsRead, loading } = useNotifications();
  const [settings, setSettings] = useState<NotificationSetting[]>(initialSettings);
  const [expirationDays, setExpirationDays] = useState<string>('30');
  
  if (!user) {
    navigate('/login');
    return null;
  }

  const handleToggleSetting = (settingId: string, field: 'enabled' | 'email' | 'push') => {
    setSettings(prevSettings => 
      prevSettings.map(setting => 
        setting.id === settingId 
          ? { ...setting, [field]: !setting[field] } 
          : setting
      )
    );
    
    toast.success('Notification preference updated');
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Failed to mark all as read');
    }
  };

  const handleDeleteAllNotifications = () => {
    // This would normally connect to a backend API
    toast.success('All notifications deleted');
  };

  const handleSaveExpirationDays = () => {
    const days = parseInt(expirationDays);
    if (isNaN(days) || days < 1) {
      toast.error('Please enter a valid number of days');
      return;
    }
    
    toast.success(`Notifications will now expire after ${days} days`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 dark:bg-gray-900 pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center md:text-left">Notification Settings</h1>
            
            <Tabs defaultValue="preferences">
              <TabsList className="mb-6 grid grid-cols-3 max-w-md mx-auto">
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
                <TabsTrigger value="delivery">Delivery</TabsTrigger>
                <TabsTrigger value="management">Management</TabsTrigger>
              </TabsList>
              
              {/* Notification Preferences Tab */}
              <TabsContent value="preferences">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                      Choose which notifications you want to receive and how you receive them.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {settings.map(setting => (
                        <div key={setting.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">{setting.name}</h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{setting.description}</p>
                            </div>
                            <Switch 
                              checked={setting.enabled} 
                              onCheckedChange={() => handleToggleSetting(setting.id, 'enabled')} 
                            />
                          </div>
                          
                          {setting.enabled && (
                            <div className="grid grid-cols-2 gap-4 mt-3 pl-5 border-l-2 border-gray-200 dark:border-gray-700">
                              <div className="flex items-center space-x-2">
                                <Switch 
                                  id={`${setting.id}-email`} 
                                  checked={setting.email} 
                                  onCheckedChange={() => handleToggleSetting(setting.id, 'email')} 
                                />
                                <Label htmlFor={`${setting.id}-email`} className="flex items-center text-sm">
                                  <Mail className="h-4 w-4 mr-1" /> Email
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch 
                                  id={`${setting.id}-push`} 
                                  checked={setting.push} 
                                  onCheckedChange={() => handleToggleSetting(setting.id, 'push')} 
                                />
                                <Label htmlFor={`${setting.id}-push`} className="flex items-center text-sm">
                                  <Bell className="h-4 w-4 mr-1" /> In-app
                                </Label>
                              </div>
                            </div>
                          )}
                          
                          {setting.id !== settings[settings.length - 1].id && (
                            <Separator className="my-4" />
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Notification Delivery Tab */}
              <TabsContent value="delivery">
                <Card>
                  <CardHeader>
                    <CardTitle>Delivery Settings</CardTitle>
                    <CardDescription>
                      Configure how notifications are delivered to you.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h3 className="font-medium">Notification Sounds</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Play sounds when you receive notifications</p>
                      </div>
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-2"
                        onClick={toggleSound}
                      >
                        {soundEnabled ? (
                          <>
                            <Volume2 className="h-4 w-4" />
                            Enabled
                          </>
                        ) : (
                          <>
                            <VolumeX className="h-4 w-4" />
                            Disabled
                          </>
                        )}
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-medium">Email Notification Frequency</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Choose how often you receive email notifications</p>
                      </div>
                      <Select defaultValue="real-time">
                        <SelectTrigger className="w-full md:w-[300px]">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="real-time">Real-time</SelectItem>
                          <SelectItem value="hourly">Hourly digest</SelectItem>
                          <SelectItem value="daily">Daily digest</SelectItem>
                          <SelectItem value="weekly">Weekly digest</SelectItem>
                          <SelectItem value="never">Never</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-medium">Notification Priority</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Choose which notification types get special attention</p>
                      </div>
                      <div className="grid gap-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="priority-job" className="flex items-center">
                            <Briefcase className="h-4 w-4 mr-2" />
                            Job Applications
                          </Label>
                          <Select defaultValue="high">
                            <SelectTrigger id="priority-job" className="w-[120px]">
                              <SelectValue placeholder="Priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="priority-msg" className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Messages
                          </Label>
                          <Select defaultValue="high">
                            <SelectTrigger id="priority-msg" className="w-[120px]">
                              <SelectValue placeholder="Priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="priority-system" className="flex items-center">
                            <Bell className="h-4 w-4 mr-2" />
                            System Notifications
                          </Label>
                          <Select defaultValue="medium">
                            <SelectTrigger id="priority-system" className="w-[120px]">
                              <SelectValue placeholder="Priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Notification Management Tab */}
              <TabsContent value="management">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Management</CardTitle>
                    <CardDescription>
                      Manage your notification history and storage.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-medium">Notification Expiration</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Automatically delete notifications after a specific period
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Input 
                          type="number" 
                          min="1" 
                          className="w-20"
                          value={expirationDays}
                          onChange={(e) => setExpirationDays(e.target.value)}
                        />
                        <span>days</span>
                        <Button variant="outline" onClick={handleSaveExpirationDays}>Save</Button>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-medium">Clear Notifications</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Mark all notifications as read or delete them completely
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <Button 
                          variant="outline" 
                          className="flex items-center gap-2"
                          onClick={handleMarkAllAsRead}
                          disabled={loading}
                        >
                          <Clock className="h-4 w-4" />
                          Mark All as Read
                        </Button>
                        <Button 
                          variant="destructive" 
                          className="flex items-center gap-2"
                          onClick={handleDeleteAllNotifications}
                        >
                          <Trash className="h-4 w-4" />
                          Delete All Notifications
                        </Button>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-medium">Do Not Disturb</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Pause all notifications temporarily
                        </p>
                      </div>
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="dnd-mode" className="flex items-center">
                            <BellOff className="h-4 w-4 mr-2" />
                            Do Not Disturb Mode
                          </Label>
                          <Switch id="dnd-mode" />
                        </div>
                        
                        <Select defaultValue="manual">
                          <SelectTrigger className="w-full md:w-[300px]">
                            <SelectValue placeholder="Duration" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1hour">For 1 hour</SelectItem>
                            <SelectItem value="4hours">For 4 hours</SelectItem>
                            <SelectItem value="8hours">For 8 hours</SelectItem>
                            <SelectItem value="1day">For 1 day</SelectItem>
                            <SelectItem value="manual">Until I turn it off</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <div className="mt-8 flex justify-center">
              <Button 
                onClick={() => navigate(-1)}
                className="w-full md:w-auto"
              >
                Save and Go Back
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotificationSettings;
