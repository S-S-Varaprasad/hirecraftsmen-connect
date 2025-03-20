
import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useNotifications } from '@/hooks/useNotifications';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const NotificationBell = () => {
  const navigate = useNavigate();
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      toast.error('Failed to mark notifications as read');
    }
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    
    if (notification.related_id) {
      // Navigate based on notification type
      if (notification.type === 'application' || notification.type === 'new_application') {
        navigate(`/jobs/${notification.related_id}`);
      } else if (notification.type === 'job_accepted') {
        navigate(`/jobs/${notification.related_id}`);
      } else if (notification.type === 'new_job' || notification.type === 'job_updated') {
        navigate(`/jobs/${notification.related_id}`);
      }
    }
    
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[1.2rem] h-[1.2rem] bg-red-500 text-white text-xs flex items-center justify-center"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="p-3 font-medium border-b flex justify-between items-center">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-7 px-2"
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center">
              <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-sm text-gray-500">Loading notifications...</p>
            </div>
          ) : !notifications || notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No notifications yet
            </div>
          ) : (
            notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`p-3 border-b text-sm hover:bg-gray-50 dark:hover:bg-gray-800 ${!notification.is_read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                onClick={() => handleNotificationClick(notification)}
                style={{ cursor: 'pointer' }}
              >
                <p className="mb-1">{notification.message}</p>
                <p className="text-xs text-gray-500">
                  {new Date(notification.created_at).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
