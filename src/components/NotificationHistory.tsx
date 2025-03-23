import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Check, ChevronRight, Clock, Calendar, 
  AlertTriangle, CheckCircle2, Settings, Trash2, 
  Filter, X, RefreshCw, MessageSquare
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useNotifications } from '@/hooks/useNotifications';
import { Notification } from '@/services/notificationService';
import { formatDistanceToNow } from 'date-fns';
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface NotificationHistoryProps {
  onClose?: () => void;
}

const NOTIFICATION_TYPES = [
  { value: 'all', label: 'All Types' },
  { value: 'application', label: 'Applications' },
  { value: 'job_accepted', label: 'Job Accepted' },
  { value: 'job_completed', label: 'Job Completed' },
  { value: 'new_job', label: 'New Jobs' },
  { value: 'job_updated', label: 'Job Updates' },
  { value: 'message', label: 'Messages' },
  { value: 'system', label: 'System' }
];

const NOTIFICATION_CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'job', label: 'Jobs' },
  { value: 'message', label: 'Messages' },
  { value: 'application', label: 'Applications' },
  { value: 'system', label: 'System' }
];

export const NotificationHistory = ({ onClose }: NotificationHistoryProps) => {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    isLoading,
    hasMore,
    filter,
    markAsRead,
    markAllAsRead,
    updateFilters,
    resetFilters,
    loadMore,
    removeNotification
  } = useNotifications();
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const handleScroll = () => {
    if (!scrollAreaRef.current || isLoading || !hasMore) return;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
    
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      loadMore();
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    
    if (notification.related_id) {
      if (notification.type === 'application' || notification.type === 'new_application') {
        navigate(`/jobs/${notification.related_id}`);
      } else if (notification.type === 'job_accepted' || notification.type === 'job_application' || notification.type === 'job_completed') {
        navigate(`/worker-job-history`);
      } else if (notification.type === 'new_job' || notification.type === 'job_updated') {
        navigate(`/jobs/${notification.related_id}`);
      } else if (notification.type === 'message') {
        if (notification.category === 'message_to_worker') {
          navigate(`/message-worker/${notification.related_id}`);
        } else if (notification.category === 'message_from_worker') {
          navigate(`/messages/${notification.related_id}`);
        } else {
          navigate(`/messages`);
        }
      } else if (notification.type === 'system') {
        if (notification.category === 'job') {
          navigate(`/jobs`);
        } else if (notification.category === 'worker') {
          navigate(`/workers`);
        } else if (notification.category === 'profile') {
          navigate(`/profile`);
        } else {
          navigate(`/`);
        }
      } else {
        navigate(`/`);
      }
    } else {
      if (notification.category === 'job') {
        navigate(`/jobs`);
      } else if (notification.category === 'message') {
        navigate(`/messages`);
      } else if (notification.category === 'application') {
        navigate(`/worker-job-history`);
      } else {
        navigate(`/`);
      }
    }
    
    if (onClose) onClose();
  };

  const handleDeleteNotification = (e: React.MouseEvent, notification: Notification) => {
    e.stopPropagation();
    setSelectedNotification(notification);
    setShowDeleteDialog(true);
  };

  const confirmDeleteNotification = async () => {
    if (!selectedNotification) return;
    
    try {
      await removeNotification(selectedNotification.id);
      setShowDeleteDialog(false);
      setSelectedNotification(null);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const applyFilter = (type: string, value: string | boolean) => {
    if (type === 'type') {
      updateFilters({ type: value === 'all' ? undefined : value as string });
    } else if (type === 'category') {
      updateFilters({ category: value === 'all' ? undefined : value as string });
    } else if (type === 'read') {
      updateFilters({ isRead: value as boolean });
    }
  };

  const getNotificationIcon = (type: string | undefined, priority?: string) => {
    if (!type) {
      return <Bell className="h-4 w-4 text-gray-500" />;
    }
    
    const baseClass = priority === 'high' 
      ? "h-4 w-4 text-red-500" 
      : priority === 'low'
        ? "h-4 w-4 text-gray-500"
        : "h-4 w-4 text-blue-500";
        
    switch (type) {
      case 'application':
      case 'new_application':
      case 'job_application':
        return <Clock className={baseClass} />;
      case 'job_accepted':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'job_completed':
        return <Calendar className="h-4 w-4 text-purple-500" />;
      case 'new_job':
      case 'job_updated':
        return <Bell className="h-4 w-4 text-amber-500" />;
      case 'message':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'system':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <>
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
          <div className="flex items-center gap-1">
            <DropdownMenu open={showFilterMenu} onOpenChange={setShowFilterMenu}>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs h-7 w-7 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover-lift rounded-full"
                >
                  <Filter className="h-3.5 w-3.5" />
                  <span className="sr-only">Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Filter Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <div className="p-2">
                  <Label className="text-xs text-gray-500 mb-1 block">By Type</Label>
                  <Select 
                    value={filter.type || 'all'} 
                    onValueChange={(value) => applyFilter('type', value)}
                  >
                    <SelectTrigger className="w-full text-xs h-8">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      {NOTIFICATION_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="p-2">
                  <Label className="text-xs text-gray-500 mb-1 block">By Category</Label>
                  <Select 
                    value={filter.category || 'all'} 
                    onValueChange={(value) => applyFilter('category', value)}
                  >
                    <SelectTrigger className="w-full text-xs h-8">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      {NOTIFICATION_CATEGORIES.map(category => (
                        <SelectItem key={category.value} value={category.value}>{category.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="p-2">
                  <Label className="text-xs text-gray-500 mb-1 block">Read Status</Label>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs">Show only unread</span>
                    <Switch 
                      checked={filter.isRead === false}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          applyFilter('read', false);
                        } else {
                          updateFilters({ isRead: undefined });
                        }
                      }}
                    />
                  </div>
                </div>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  onClick={resetFilters}
                  className="text-xs cursor-pointer flex items-center justify-center text-center text-primary"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Reset All Filters
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs h-7 px-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-primary hover-lift"
                onClick={() => markAllAsRead(filter)}
              >
                <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                Mark all read
              </Button>
            )}
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-7 w-7 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover-lift rounded-full"
              onClick={() => {
                navigate('/notification-settings');
                if (onClose) onClose();
              }}
            >
              <Settings className="h-3.5 w-3.5" />
              <span className="sr-only">Notification Settings</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea 
            className="h-[400px]" 
            scrollHideDelay={100}
            ref={scrollAreaRef}
            onScroll={handleScroll}
          >
            <AnimatePresence>
              {isLoading && notifications.length === 0 ? (
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
                      className={`p-4 text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-start gap-3 cursor-pointer transition-colors ${
                        !notification.is_read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                    >
                      <div className={`mt-0.5 rounded-full p-2 ${
                        notification.priority === 'high' 
                          ? 'bg-red-100 dark:bg-red-900/20' 
                          : !notification.is_read 
                            ? 'bg-blue-100 dark:bg-blue-900/20' 
                            : 'bg-gray-100 dark:bg-gray-800'
                      }`}>
                        {getNotificationIcon(notification.type, notification.priority)}
                      </div>
                      <div className="flex-1">
                        <p className="mb-1 text-gray-800 dark:text-gray-200 font-medium">{notification.message}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span>
                            {notification.created_at 
                              ? formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })
                              : 'Just now'}
                          </span>
                          {notification.category && (
                            <Badge variant="secondary" className="text-[10px] py-0 px-1.5 h-4">
                              {notification.category}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        {!notification.is_read && (
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => handleDeleteNotification(e, notification)}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-gray-500" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && notifications.length > 0 && (
                    <div className="p-4 text-center">
                      <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                    </div>
                  )}
                </div>
              )}
            </AnimatePresence>
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Notification</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this notification? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-800 mt-2">
            {selectedNotification?.message}
          </div>
          <DialogFooter className="flex items-center justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteNotification}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NotificationHistory;
