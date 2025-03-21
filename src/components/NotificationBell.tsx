
import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useNotifications } from '@/hooks/useNotifications';
import { motion } from 'framer-motion';
import { NotificationHistory } from '@/components/NotificationHistory';

export const NotificationBell = () => {
  const { unreadCount } = useNotifications();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative h-9 w-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
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
      <PopoverContent 
        className="w-80 p-0 rounded-xl shadow-xl border-0"
        align="end"
        sideOffset={8}
      >
        <NotificationHistory onClose={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  );
};
