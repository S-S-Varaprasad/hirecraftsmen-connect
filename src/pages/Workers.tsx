
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchFilters from '@/components/SearchFilters';
import { getWorkers } from '@/services/workerService';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import WorkerGrid from '@/components/workers/WorkerGrid';
import NoWorkersFound from '@/components/workers/NoWorkersFound';
import LoadingState from '@/components/workers/LoadingState';
import ErrorState from '@/components/workers/ErrorState';
import WorkersHeader from '@/components/workers/WorkersHeader';
import { applyFilters, WorkerFilters, getIndianWorkers } from '@/utils/workerFilters';
import { useWorkerProfiles } from '@/hooks/useWorkerProfiles';

const Workers = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialSearch = searchParams.get('search') || '';
  const initialLocation = searchParams.get('location') || '';
  const { addSampleWorkersIfNeeded } = useWorkerProfiles();

  // Query to fetch all workers
  const { data: workersData = [], isLoading: isLoadingWorkers, error, refetch } = useQuery({
    queryKey: ['workers'],
    queryFn: getWorkers,
    retry: 3,
    retryDelay: 1000,
  });
  
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (workersData) {
      console.log('Workers data received:', workersData);
      
      // Check if we have any workers, if not add sample workers
      if (workersData.length === 0) {
        addSampleWorkersIfNeeded().then((added) => {
          if (added) {
            refetch();
          }
        });
      }
      
      // Get only Indian workers
      const indianWorkers = getIndianWorkers(workersData);
      
      // Apply initial filters from URL if they exist
      if (initialSearch || initialLocation) {
        const filters: WorkerFilters = {
          searchTerm: initialSearch,
          location: initialLocation,
          onlyIndian: true
        };
        
        const results = applyFilters(workersData, filters);
        
        setFilteredWorkers(results);
        if (results.length > 0) {
          toast.info(`Found ${results.length} worker${results.length !== 1 ? 's' : ''} matching your search criteria`);
        } else if (indianWorkers.length > 0) {
          toast.info('No workers found matching your search criteria. Showing all Indian workers instead.');
          setFilteredWorkers(indianWorkers);
        }
      } else {
        setFilteredWorkers(indianWorkers);
      }
    }
  }, [workersData, initialSearch, initialLocation, addSampleWorkersIfNeeded, refetch]);

  const handleSearch = (filters) => {
    setIsLoading(true);
    
    // Always apply Indian filter
    const allFilters = { ...filters, onlyIndian: true };
    
    // Apply filters
    setTimeout(() => {
      const results = applyFilters(workersData, allFilters);
      
      setFilteredWorkers(results);
      setIsLoading(false);
      
      // Show toast notification for search results
      toast.info(`Found ${results.length} worker${results.length !== 1 ? 's' : ''} matching your search criteria`);
    }, 500);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    refetch().finally(() => setIsLoading(false));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-orange-50/40 dark:bg-gray-900 pt-24">
        <div className="container mx-auto px-4 py-8">
          <WorkersHeader />
          
          <div className="mb-8 flex flex-wrap justify-between items-center">
            <div className="w-full md:flex-1">
              <SearchFilters 
                onSearch={handleSearch} 
                initialSearchTerm={initialSearch}
                initialLocation={initialLocation}
              />
            </div>
            <button 
              onClick={handleRefresh}
              className="mt-4 md:mt-0 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {isLoading ? 'Refreshing...' : 'Refresh Workers'}
            </button>
          </div>
          
          {isLoading || isLoadingWorkers ? (
            <LoadingState />
          ) : error ? (
            <div className="text-center py-10">
              <ErrorState message="Error loading workers. Please try refreshing the page." />
              <button 
                onClick={handleRefresh}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              {filteredWorkers.length > 0 ? (
                <WorkerGrid workers={filteredWorkers} />
              ) : (
                <div className="text-center py-10">
                  <NoWorkersFound />
                  <button 
                    onClick={() => addSampleWorkersIfNeeded().then(() => refetch())}
                    className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Add Sample Workers
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Workers;
