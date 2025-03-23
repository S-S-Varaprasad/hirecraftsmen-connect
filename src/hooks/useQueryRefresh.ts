
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * A hook that sets up real-time listeners for database tables and automatically
 * refreshes the associated query data when changes occur.
 * 
 * @param tableNames Array of table names to listen for changes
 * @param queryKeys Array of query keys to invalidate when changes occur
 */
export const useQueryRefresh = (
  tableNames: string[],
  queryKeys: string[][]
) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Create a channel for real-time updates
    const channel = supabase.channel('db-changes');
    let fallbackIntervalId: ReturnType<typeof setInterval> | null = null;
    let isChannelActive = false;
    
    // Set up listeners for each table
    tableNames.forEach(tableName => {
      // Listen for inserts
      channel.on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: tableName 
        },
        (payload) => {
          console.log(`Real-time INSERT on ${tableName}:`, payload);
          queryKeys.forEach(key => {
            queryClient.invalidateQueries({ queryKey: key });
          });
        }
      );
      
      // Listen for updates
      channel.on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: tableName 
        },
        (payload) => {
          console.log(`Real-time UPDATE on ${tableName}:`, payload);
          queryKeys.forEach(key => {
            queryClient.invalidateQueries({ queryKey: key });
          });
        }
      );
      
      // Listen for deletes
      channel.on(
        'postgres_changes',
        { 
          event: 'DELETE', 
          schema: 'public', 
          table: tableName 
        },
        (payload) => {
          console.log(`Real-time DELETE on ${tableName}:`, payload);
          queryKeys.forEach(key => {
            queryClient.invalidateQueries({ queryKey: key });
          });
        }
      );
    });
    
    // Subscribe to all channels with error handling
    channel.subscribe((status) => {
      console.log(`Realtime subscription status: ${status}`);
      
      if (status === 'SUBSCRIBED') {
        isChannelActive = true;
        // If we have a fallback interval, clear it as the channel is now active
        if (fallbackIntervalId) {
          clearInterval(fallbackIntervalId);
          fallbackIntervalId = null;
        }
      } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
        isChannelActive = false;
        console.warn(`Realtime channel error: ${status}. Using polling fallback.`);
        
        // When there's an error with the channel, use polling as a fallback
        if (!fallbackIntervalId) {
          fallbackIntervalId = setInterval(() => {
            console.log('Polling for data updates (fallback)');
            queryKeys.forEach(key => {
              queryClient.invalidateQueries({ queryKey: key });
            });
            
            // Try to reconnect the channel if it's not active
            if (!isChannelActive) {
              try {
                channel.unsubscribe();
                setTimeout(() => {
                  channel.subscribe();
                }, 1000);
              } catch (err) {
                console.error('Error reconnecting channel:', err);
              }
            }
          }, 10000); // Poll every 10 seconds as fallback
        }
      }
    });
    
    // Clean up on unmount
    return () => {
      if (fallbackIntervalId) {
        clearInterval(fallbackIntervalId);
      }
      supabase.removeChannel(channel);
    };
  }, [queryClient, JSON.stringify(tableNames), JSON.stringify(queryKeys)]);
};
