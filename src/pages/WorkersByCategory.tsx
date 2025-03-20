
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchFilters from '@/components/SearchFilters';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Briefcase } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getWorkers, Worker } from '@/services/workerService';
import WorkerGrid from '@/components/workers/WorkerGrid';
import NoWorkersFound from '@/components/workers/NoWorkersFound';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';

const professionMap: { [key: string]: string } = {
  'painter': 'Painter',
  'carpenter': 'Carpenter',
  'plumber': 'Plumber',
  'electrician': 'Electrician',
  'mechanic': 'Mechanic',
  'security': 'Security Guard',
  'chef': 'Chef',
  'cleaner': 'Housekeeper',
  'construction': 'Construction Worker',
  'mason': 'Mason',
  'gardener': 'Gardener',
  'tailor': 'Tailor',
  'farmer': 'Farmer',
  'interior-designer': 'Interior Designer'
};

const WorkersByCategory = () => {
  const { slug } = useParams<{ slug: string }>();
  const [filteredWorkers, setFilteredWorkers] = useState<Worker[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [categoryName, setCategoryName] = useState<string>('');

  const { data: workersData = [], isLoading: isLoadingWorkers } = useQuery({
    queryKey: ['workers'],
    queryFn: getWorkers,
  });

  useEffect(() => {
    if (slug && workersData.length > 0) {
      const profession = professionMap[slug] || '';
      setCategoryName(profession || 'Specialized');
      
      setIsLoading(true);
      
      // This ensures we have results even if the profession isn't found directly
      const professionToMatch = profession.toLowerCase();
      let results = [];
      
      if (professionToMatch) {
        results = workersData.filter(worker => {
          const workerProfession = worker.profession.toLowerCase();
          return workerProfession.includes(professionToMatch) || 
                worker.skills.some((skill: string) => skill.toLowerCase().includes(professionToMatch));
        });
      } else {
        // If no profession matches, just show some workers to avoid empty results
        results = workersData.slice(0, 6);
      }
      
      setFilteredWorkers(results);
      setIsLoading(false);
    }
  }, [slug, workersData]);

  useEffect(() => {
    if (slug && !professionMap[slug]) {
      toast("Category not found. Showing available workers that might match your needs.");
    }
  }, [slug]);

  const handleSearch = (filters: any) => {
    setIsLoading(true);
    
    const profession = professionMap[slug || ''] || '';
    
    let results = workersData.filter(worker => {
      const workerProfession = worker.profession.toLowerCase();
      const professionToMatch = profession.toLowerCase();
      return workerProfession.includes(professionToMatch) || 
            worker.skills.some((skill: string) => skill.toLowerCase().includes(professionToMatch));
    });
    
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
    
    if (filters.availableOnly) {
      results = results.filter(worker => worker.is_available);
    }
    
    setTimeout(() => {
      setFilteredWorkers(results);
      setIsLoading(false);
    }, 400);
  };

  if (isLoadingWorkers) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-orange-50/40 dark:bg-gray-900 pt-24 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  // Count available workers (those with is_available = true)
  const availableWorkersCount = filteredWorkers.filter(worker => worker.is_available).length;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-orange-50/40 dark:bg-gray-900 pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-primary hover:underline mb-4">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Home
            </Link>
            
            <div className="max-w-3xl mx-auto text-center mb-10">
              <div className="inline-block p-2 px-4 bg-primary/10 text-primary rounded-full text-sm font-medium mb-3">
                {categoryName || 'Specialized'} Professionals
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                {categoryName ? `Top ${categoryName} Professionals` : 'Specialized Professionals'}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Browse our selection of qualified {categoryName.toLowerCase()} experts ready to help with your next project
              </p>
            </div>
          </div>
          
          <div className="mb-8">
            <SearchFilters onSearch={handleSearch} />
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {filteredWorkers.length > 0 ? (
                <WorkerGrid workers={filteredWorkers} />
              ) : (
                <NoWorkersFound />
              )}
            </>
          )}
          
          <div className="mt-10 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Found {filteredWorkers.length} {categoryName.toLowerCase() || 'specialized'} workers 
              ({availableWorkersCount} currently available)
            </p>
            <Button variant="outline" asChild>
              <Link to="/workers">Browse All Workers</Link>
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default WorkersByCategory;
