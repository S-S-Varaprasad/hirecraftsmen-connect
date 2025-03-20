
import React, { useState } from 'react';
import { Bell, Check, ChevronRight, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useNotifications } from '@/hooks/useNotifications';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

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
      } else if (notification.type === 'job_accepted' || notification.type === 'job_application' || notification.type === 'job_completed') {
        navigate(`/job-history`);
      } else if (notification.type === 'new_job' || notification.type === 'job_updated') {
        navigate(`/jobs/${notification.related_id}`);
      }
    }
    
    setOpen(false);
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'application':
      case 'new_application':
      case 'job_application':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'job_accepted':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'job_completed':
        return <Calendar className="h-4 w-4 text-purple-500" />;
      case 'new_job':
      case 'job_updated':
        return <Bell className="h-4 w-4 text-amber-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative h-9 w-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: unreadCount > 0 ? [1, 1.2, 1] : 1 }}
            transition={{ 
              duration: 0.5, 
              repeat: unreadCount > 0 ? Infinity : 0, 
              repeatDelay: 3
            }}
          >
            <Bell className="h-5 w-5" />
          </motion.div>
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[1.2rem] h-[1.2rem] bg-red-500 text-white text-xs flex items-center justify-center"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 rounded-xl shadow-xl backdrop-blur-sm bg-white/95 dark:bg-gray-800/95 border border-gray-200 dark:border-gray-700">
        <div className="p-3 font-medium border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <span className="text-gray-800 dark:text-white">Notifications</span>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-7 px-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-primary"
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          <AnimatePresence>
            {loading ? (
              <motion.div 
                className="p-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-3"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Loading notifications...</p>
              </motion.div>
            ) : !notifications || notifications.length === 0 ? (
              <motion.div 
                className="p-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="bg-gray-100 dark:bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Bell className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">No notifications yet</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  We'll notify you when something happens
                </p>
              </motion.div>
            ) : (
              notifications.map(notification => (
                <motion.div 
                  key={notification.id} 
                  className={`p-4 border-b border-gray-100 dark:border-gray-700 text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-start gap-3 cursor-pointer transition-colors ${!notification.is_read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={`mt-0.5 rounded-full p-2 ${!notification.is_read ? 'bg-blue-100 dark:bg-blue-900/20' : 'bg-gray-100 dark:bg-gray-800'}`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <p className="mb-1 text-gray-800 dark:text-gray-200 font-medium">{notification.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
                      <span>{new Date(notification.created_at).toLocaleString()}</span>
                      <ChevronRight className="h-4 w-4 opacity-50" />
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </PopoverContent>
    </Popover>
  );
};
