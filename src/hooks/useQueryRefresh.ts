
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
        () => {
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
        () => {
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
        () => {
          queryKeys.forEach(key => {
            queryClient.invalidateQueries({ queryKey: key });
          });
        }
      );
    });
    
    // Subscribe to all channels with error handling
    channel.subscribe((status) => {
      console.log(`Realtime subscription status: ${status}`);
      
      if (status === 'CHANNEL_ERROR') {
        // When there's an error with the channel, use polling as a fallback
        const intervalId = setInterval(() => {
          queryKeys.forEach(key => {
            queryClient.invalidateQueries({ queryKey: key });
          });
        }, 30000); // Poll every 30 seconds
        
        // Clean up interval on unmount
        return () => clearInterval(intervalId);
      }
    });
    
    // Clean up on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, JSON.stringify(tableNames), JSON.stringify(queryKeys)]);
};
