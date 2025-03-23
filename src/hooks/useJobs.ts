
import { useQuery } from '@tanstack/react-query';
import { getJobs, getJobsBySearch, Job } from '@/services/jobService';
import { useState, useEffect, useCallback } from 'react';
import { useQueryRefresh } from '@/hooks/useQueryRefresh';
import { toast } from 'sonner';

export const useJobs = () => {
  const [filters, setFilters] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Set up real-time updates for jobs table and applications table
  // This ensures that when a job application is accepted, the job is removed from the list
  useQueryRefresh(['jobs', 'applications'], [['jobs'], ['filteredJobs']]);

  // Query to fetch all jobs
  const { 
    data: allJobs = [], 
    isLoading: isLoadingJobs, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['jobs'],
    queryFn: getJobs,
    staleTime: 1000 * 60, // 1 minute
    retry: 3,
    retryDelay: attempt => Math.min(attempt > 1 ? 2000 : 1000, 10000),
    meta: {
      onError: (err: any) => {
        console.error('Error fetching jobs:', err);
        toast.error('Failed to load jobs. Please try again.');
      }
    }
  });

  // Query to fetch filtered jobs
  const { 
    data: filteredJobs = [],
    isLoading: isLoadingFiltered,
    refetch: refetchFiltered
  } = useQuery({
    queryKey: ['filteredJobs', filters],
    queryFn: () => getJobsBySearch(filters || {}),
    enabled: !!filters,
    staleTime: 1000 * 60, // 1 minute
    retry: 3,
    retryDelay: attempt => Math.min(attempt > 1 ? 2000 : 1000, 10000),
    meta: {
      onError: (err: any) => {
        console.error('Error fetching filtered jobs:', err);
        toast.error('Failed to load filtered jobs. Please try again.');
      }
    }
  });

  // Function to handle search
  const handleSearch = async (searchFilters: any) => {
    try {
      setIsSearching(true);
      setFilters(searchFilters);
      
      // If search is empty, return all jobs
      if (!searchFilters.searchTerm && 
          !searchFilters.location && 
          (!searchFilters.jobTypes || searchFilters.jobTypes.length === 0) && 
          (!searchFilters.urgency || searchFilters.urgency.length === 0)) {
        setFilters(null);
      }
    } catch (error) {
      console.error('Error in search:', error);
      toast.error('Error searching for jobs. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // Manually refresh the data
  const refreshJobs = useCallback(() => {
    if (filters) {
      refetchFiltered();
    } else {
      refetch();
    }
  }, [filters, refetch, refetchFiltered]);

  // Auto-refresh on mount and when dependencies change
  useEffect(() => {
    // Force refresh when component mounts
    refreshJobs();
    
    // Set up interval to refresh job data periodically
    const intervalId = setInterval(() => {
      refreshJobs();
    }, 60000); // Refresh every minute
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [refreshJobs]);

  return {
    jobs: filters ? filteredJobs : allJobs,
    isLoading: isLoadingJobs || isLoadingFiltered || isSearching,
    error,
    handleSearch,
    refreshJobs,
    isFiltered: !!filters
  };
};
