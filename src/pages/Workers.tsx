
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
import { applyFilters, WorkerFilters } from '@/utils/workerFilters';

const Workers = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialSearch = searchParams.get('search') || '';
  const initialLocation = searchParams.get('location') || '';

  // Query to fetch all workers
  const { data: workersData = [], isLoading: isLoadingWorkers, error } = useQuery({
    queryKey: ['workers'],
    queryFn: getWorkers,
  });
  
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (workersData) {
      console.log('Workers data received:', workersData);
      // Apply initial filters from URL if they exist
      if (initialSearch || initialLocation) {
        const filters: WorkerFilters = {
          searchTerm: initialSearch,
          location: initialLocation
        };
        
        const results = applyFilters(workersData, filters);
        
        setFilteredWorkers(results);
        if (results.length > 0) {
          toast.info(`Found ${results.length} worker${results.length !== 1 ? 's' : ''} matching your search criteria`);
        } else {
          toast.info('No workers found matching your search criteria. Showing all workers instead.');
          setFilteredWorkers(workersData);
        }
      } else {
        setFilteredWorkers(workersData);
      }
    }
  }, [workersData, initialSearch, initialLocation]);

  const handleSearch = (filters) => {
    setIsLoading(true);
    
    // Apply filters
    setTimeout(() => {
      const results = applyFilters(workersData, filters);
      
      setFilteredWorkers(results);
      setIsLoading(false);
      
      // Show toast notification for search results
      toast.info(`Found ${results.length} worker${results.length !== 1 ? 's' : ''} matching your search criteria`);
    }, 500);
  };

  if (isLoadingWorkers) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-orange-50/40 dark:bg-gray-900 pt-24 flex justify-center items-center">
          <LoadingState />
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-orange-50/40 dark:bg-gray-900 pt-24 flex justify-center items-center">
          <ErrorState />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-orange-50/40 dark:bg-gray-900 pt-24">
        <div className="container mx-auto px-4 py-8">
          <WorkersHeader />
          
          <div className="mb-8">
            <SearchFilters 
              onSearch={handleSearch} 
              initialSearchTerm={initialSearch}
              initialLocation={initialLocation}
            />
          </div>
          
          {isLoading ? (
            <LoadingState />
          ) : (
            <>
              {filteredWorkers.length > 0 ? (
                <WorkerGrid workers={filteredWorkers} />
              ) : (
                <NoWorkersFound />
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
