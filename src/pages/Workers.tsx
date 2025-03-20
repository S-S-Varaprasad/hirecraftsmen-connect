
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchFilters from '@/components/SearchFilters';
import ProfileCard from '@/components/ProfileCard';
import { Briefcase, Filter } from 'lucide-react';
import { getWorkers, Worker, searchWorkers } from '@/services/workerService';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

const Workers = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialSearch = searchParams.get('search') || '';
  const initialLocation = searchParams.get('location') || '';

  const { data: workersData = [], isLoading: isLoadingWorkers, error } = useQuery({
    queryKey: ['workers'],
    queryFn: getWorkers,
  });
  
  const [filteredWorkers, setFilteredWorkers] = useState<Worker[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (workersData) {
      // Apply initial filters from URL if they exist
      if (initialSearch || initialLocation) {
        let results = [...workersData];
        
        if (initialSearch) {
          const term = initialSearch.toLowerCase();
          results = results.filter(worker => 
            worker.name.toLowerCase().includes(term) || 
            worker.profession.toLowerCase().includes(term) ||
            worker.skills.some((skill: string) => skill.toLowerCase().includes(term))
          );
        }
        
        if (initialLocation) {
          const locationTerm = initialLocation.toLowerCase();
          results = results.filter(worker => 
            worker.location.toLowerCase().includes(locationTerm)
          );
        }
        
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
      setIsLoading(false);
    }
  }, [workersData, initialSearch, initialLocation]);

  const handleSearch = (filters: any) => {
    setIsLoading(true);
    
    // Apply filters
    setTimeout(() => {
      let results = [...workersData];
      
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        results = results.filter(worker => 
          worker.name.toLowerCase().includes(term) || 
          worker.profession.toLowerCase().includes(term) ||
          worker.skills.some((skill: string) => skill.toLowerCase().includes(term))
        );
      }
      
      if (filters.location) {
        const location = filters.location.toLowerCase();
        results = results.filter(worker => 
          worker.location.toLowerCase().includes(location)
        );
      }
      
      if (filters.professions && filters.professions.length > 0) {
        results = results.filter(worker => 
          filters.professions.some((p: string) => 
            worker.profession.toLowerCase().includes(p.toLowerCase())
          )
        );
      }
      
      if (filters.availableOnly) {
        results = results.filter(worker => worker.is_available);
      }
      
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
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
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
          <div className="text-center py-20 bg-white/80 rounded-xl shadow-sm border border-gray-100 dark:bg-gray-800/80 dark:border-gray-700 max-w-md mx-auto px-4">
            <h3 className="text-xl font-semibold mb-2">Error loading workers</h3>
            <p className="text-gray-600 dark:text-gray-400">
              There was a problem fetching the worker data. Please try again later.
            </p>
          </div>
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
          <div className="max-w-3xl mx-auto text-center mb-10">
            <div className="inline-block p-2 px-4 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-3">
              Professional Directory
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Find Skilled Professionals</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Browse our directory of qualified workers ready to help with your next project
            </p>
          </div>
          
          <div className="mb-8">
            <SearchFilters 
              onSearch={handleSearch} 
              initialSearchTerm={initialSearch}
              initialLocation={initialLocation}
            />
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {filteredWorkers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredWorkers.map((worker) => (
                    <ProfileCard 
                      key={worker.id} 
                      id={worker.id}
                      name={worker.name}
                      profession={worker.profession}
                      location={worker.location}
                      rating={worker.rating}
                      experience={worker.experience}
                      hourlyRate={worker.hourly_rate}
                      skills={worker.skills}
                      isAvailable={worker.is_available}
                      imageUrl={worker.image_url || '/placeholder.svg'}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white/80 rounded-xl shadow-sm border border-gray-100 dark:bg-gray-800/80 dark:border-gray-700">
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center">
                    <Briefcase className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No workers found</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Try adjusting your search filters or criteria
                  </p>
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
