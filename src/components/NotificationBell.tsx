
import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useNotifications } from '@/hooks/useNotifications';
import { motion, AnimatePresence } from 'framer-motion';
import { NotificationHistory } from '@/components/NotificationHistory';
import { Toggle } from '@/components/ui/toggle';
import { useNavigate } from 'react-router-dom';

export const NotificationBell = () => {
  const { unreadCount, soundEnabled, toggleSound } = useNotifications();
  const [open, setOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  // Animation effect when new notification comes in
  useEffect(() => {
    if (unreadCount > 0) {
      // Trigger vibration if supported by the browser and device
      if ('vibrate' in navigator) {
        try {
          navigator.vibrate(200);
        } catch (error) {
          console.error('Vibration API error:', error);
        }
      }
    }
  }, [unreadCount]);

  return (
    <div className="relative">
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
              animate={{ 
                scale: unreadCount > 0 ? [1, 1.2, 1] : 1,
                rotate: unreadCount > 5 ? [0, -10, 10, -10, 0] : 0
              }}
              transition={{ 
                duration: 0.5, 
                repeat: unreadCount > 0 ? Infinity : 0, 
                repeatDelay: unreadCount > 5 ? 1 : 3
              }}
            >
              <Bell className="h-5 w-5" />
            </motion.div>
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                >
                  <Badge 
                    className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[1.2rem] h-[1.2rem] bg-red-500 text-white text-xs flex items-center justify-center"
                  >
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
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

      {/* Settings button */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors p-0"
        onClick={(e) => {
          e.stopPropagation();
          setShowDropdown(!showDropdown);
        }}
        aria-label="Notification settings"
      >
        <span className="sr-only">Notification settings</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="1" />
          <circle cx="12" cy="6" r="1" />
          <circle cx="12" cy="18" r="1" />
        </svg>
      </Button>
      
      <DropdownMenu open={showDropdown} onOpenChange={setShowDropdown}>
        <DropdownMenuTrigger className="hidden">Settings</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 mt-2">
          <DropdownMenuItem 
            onClick={(e) => {
              e.stopPropagation();
              toggleSound();
            }}
            className="flex items-center justify-between cursor-pointer"
          >
            <span className="flex items-center">
              {soundEnabled ? <Volume2 className="h-4 w-4 mr-2" /> : <VolumeX className="h-4 w-4 mr-2" />}
              Notification Sound
            </span>
            <Toggle pressed={soundEnabled} className="ml-2" />
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => {
              setShowDropdown(false);
              navigate('/notification-settings');
            }}
            className="flex items-center cursor-pointer"
          >
            <Bell className="h-4 w-4 mr-2" />
            Notification Settings
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
