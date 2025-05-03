
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
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const Workers = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialSearch = searchParams.get('search') || '';
  const initialLocation = searchParams.get('location') || '';
  const { addSampleWorkersIfNeeded, forceSampleWorkers } = useWorkerProfiles();

  // Query to fetch all workers
  const { data: workersData = [], isLoading: isLoadingWorkers, error, refetch } = useQuery({
    queryKey: ['workers'],
    queryFn: getWorkers,
    retry: 3,
    retryDelay: 1000,
  });
  
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [addingSamples, setAddingSamples] = useState(false);

  useEffect(() => {
    console.log('Workers data received:', workersData);
    
    if (Array.isArray(workersData)) {
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
      console.log('Filtered Indian workers:', indianWorkers);
      
      // Apply initial filters from URL if they exist
      if (initialSearch || initialLocation) {
        const filters: WorkerFilters = {
          searchTerm: initialSearch,
          location: initialLocation,
          onlyIndian: true
        };
        
        const results = applyFilters(workersData, filters);
        console.log('Applied filters, results:', results);
        
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
    } else {
      console.error('Workers data is not an array:', workersData);
      setFilteredWorkers([]);
    }
  }, [workersData, initialSearch, initialLocation, addSampleWorkersIfNeeded, refetch]);

  const handleSearch = (filters) => {
    setIsLoading(true);
    
    // Always apply Indian filter
    const allFilters = { ...filters, onlyIndian: true };
    
    // Apply filters
    setTimeout(() => {
      if (!Array.isArray(workersData)) {
        console.error('Workers data is not an array when filtering:', workersData);
        setFilteredWorkers([]);
        setIsLoading(false);
        return;
      }
      
      const results = applyFilters(workersData, allFilters);
      console.log('Search results:', results);
      
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

  const handleAddSampleWorkers = async () => {
    setAddingSamples(true);
    try {
      await forceSampleWorkers();
      refetch();
    } catch (error) {
      console.error("Error adding sample workers:", error);
      toast.error("Failed to add sample workers");
    } finally {
      setAddingSamples(false);
    }
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
            <div className="mt-4 md:mt-0 flex space-x-2">
              <Button 
                onClick={handleAddSampleWorkers}
                disabled={addingSamples}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                {addingSamples ? 'Adding...' : 'Add Sample Workers'}
              </Button>
              <Button 
                onClick={handleRefresh}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors flex items-center"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Refreshing...' : 'Refresh Workers'}
              </Button>
            </div>
          </div>
          
          {isLoading || isLoadingWorkers ? (
            <LoadingState />
          ) : error ? (
            <div className="text-center py-10">
              <ErrorState message="Error loading workers. Please try refreshing the page." />
              <Button 
                onClick={handleRefresh}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <>
              {Array.isArray(workersData) && workersData.length > 0 ? (
                <WorkerGrid workers={filteredWorkers} />
              ) : (
                <div className="text-center py-10">
                  <NoWorkersFound />
                  <Button 
                    onClick={handleAddSampleWorkers}
                    disabled={addingSamples}
                    className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                  >
                    {addingSamples ? 'Adding...' : 'Add Sample Workers'}
                  </Button>
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
