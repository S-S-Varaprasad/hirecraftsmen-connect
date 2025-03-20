
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, ChevronRight, Clock, Calendar, AlertTriangle, CheckCircle2, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useNotifications } from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';

interface NotificationHistoryProps {
  onClose?: () => void;
}

export const NotificationHistory = ({ onClose }: NotificationHistoryProps) => {
  const navigate = useNavigate();
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      toast.error('Failed to mark notifications as read');
    }
  };

  const handleNotificationClick = (notification: any) => {
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
    
    if (onClose) onClose();
  };

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'application':
      case 'new_application':
      case 'job_application':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'job_accepted':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
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
    <Card className="w-full max-w-md mx-auto shadow-3d rounded-xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
      <CardHeader className="py-4 px-5 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/80 flex flex-row justify-between items-center">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-base text-gray-800 dark:text-white m-0">Notifications</h3>
          {unreadCount > 0 && (
            <Badge variant="outline" className="ml-2 bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:border-primary/30">
              {unreadCount} unread
            </Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs h-7 px-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-primary hover-lift"
            onClick={handleMarkAllAsRead}
          >
            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
            Mark all read
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
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
                <p className="text-gray-700 dark:text-gray-300 font-medium">No notifications yet</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  We'll notify you when something happens
                </p>
              </motion.div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {notifications.map(notification => (
                  <motion.div 
                    key={notification.id} 
                    className={`p-4 text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-start gap-3 cursor-pointer transition-colors ${!notification.is_read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                    onClick={() => handleNotificationClick(notification)}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                  >
                    <div className={`mt-0.5 rounded-full p-2 ${!notification.is_read ? 'bg-blue-100 dark:bg-blue-900/20' : 'bg-gray-100 dark:bg-gray-800'}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <p className="mb-1 text-gray-800 dark:text-gray-200 font-medium">{notification.message}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>
                          {notification.created_at 
                            ? formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })
                            : 'Just now'}
                        </span>
                        <ChevronRight className="h-3.5 w-3.5 opacity-50" />
                      </div>
                    </div>
                    {!notification.is_read && (
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default NotificationHistory;
