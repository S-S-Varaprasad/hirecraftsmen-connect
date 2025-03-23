import React, { useState } from 'react';
import { 
  Bell, Volume2, ArrowLeft, Mail, Phone, Clock, AlertTriangle, 
  VolumeX, Smartphone, Trash2, RefreshCw, Save 
} from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { NotificationHistory } from '@/components/NotificationHistory';

const NotificationSettings = () => {
  const navigate = useNavigate();
  const { soundEnabled = true, toggleSound = () => {}, isLoading = false } = useNotifications();
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center mb-8">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-4 h-9 w-9"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back</span>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notification Settings</h1>
          <p className="text-muted-foreground">Manage how you receive notifications</p>
        </div>
      </div>
      
      <div className="grid gap-8 md:grid-cols-[1fr_300px]">
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5 text-primary" />
                General Settings
              </CardTitle>
              <CardDescription>
                Configure your general notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center">
                    {soundEnabled ? (
                      <Volume2 className="mr-2 h-4 w-4 text-primary" />
                    ) : (
                      <VolumeX className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <h4 className="font-medium">Notification Sounds</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Play a sound when new notifications arrive
                  </p>
                </div>
                <Switch 
                  checked={soundEnabled} 
                  onCheckedChange={toggleSound}
                  disabled={isLoading}
                />
              </div>
              
            </CardContent>
          </Card>
          
        </div>
        
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Notifications</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px]">
                <NotificationHistory />
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
