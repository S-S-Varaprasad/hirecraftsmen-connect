
import React, { useState } from 'react';
import { BellRing } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';

export const NotificationBell = () => {
  const { user } = useAuth();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [open, setOpen] = useState(false);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && unreadCount > 0) {
      markAllAsRead();
    }
  };

  // We need to define this function to mark all notifications as read
  const markAllAsRead = () => {
    notifications.forEach((notification) => {
      if (!notification.is_read) {
        markAsRead(notification.id);
      }
    });
  };

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
          <BellRing className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-medium text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-[300px] overflow-y-auto">
          {notifications.length > 0 ? (
            <DropdownMenuGroup>
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={`flex flex-col items-start gap-1 p-3 ${!notification.is_read ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}
                >
                  <p className="text-sm font-medium">{notification.message}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(notification.created_at).toLocaleString()}
                  </p>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          ) : (
            <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
              No notifications yet
            </div>
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center" asChild>
          <a className="cursor-pointer text-xs text-blue-600 dark:text-blue-400" href="#">
            View all notifications
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
