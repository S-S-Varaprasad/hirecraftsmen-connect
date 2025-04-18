
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchFilters from '@/components/SearchFilters';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Briefcase } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getWorkers, Worker } from '@/services/workerService';
import WorkerGrid from '@/components/workers/WorkerGrid';
import NoWorkersFound from '@/components/workers/NoWorkersFound';
import LoadingState from '@/components/workers/LoadingState';
import ErrorState from '@/components/workers/ErrorState';
import { toast } from 'sonner';
import { applyFilters, getIndianWorkers } from '@/utils/workerFilters';

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
  const navigate = useNavigate();
  const [filteredWorkers, setFilteredWorkers] = useState<Worker[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [categoryName, setCategoryName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  console.log('Current slug:', slug);

  const { data: workersData = [], isLoading: isLoadingWorkers, error: workersError } = useQuery({
    queryKey: ['workers'],
    queryFn: getWorkers,
  });

  useEffect(() => {
    if (!slug) {
      navigate('/workers');
      return;
    }

    if (workersData.length > 0) {
      setIsLoading(true);
      
      // First, filter to only Indian workers
      const indianWorkers = getIndianWorkers(workersData);
      
      const profession = professionMap[slug] || '';
      setCategoryName(profession || 'Specialized');
      
      console.log('Looking for workers matching profession:', profession);
      
      const professionToMatch = profession.toLowerCase();
      let results = [];
      
      if (professionToMatch) {
        results = indianWorkers.filter(worker => {
          const workerProfession = worker.profession.toLowerCase();
          return workerProfession.includes(professionToMatch) || 
                worker.skills.some((skill: string) => skill.toLowerCase().includes(professionToMatch));
        });
      } else {
        results = indianWorkers.slice(0, 6);
      }
      
      console.log(`Found ${results.length} workers matching "${professionToMatch}"`);
      
      setFilteredWorkers(results);
      setIsLoading(false);
    }
  }, [slug, workersData, navigate]);

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
    
    if (filters) {
      results = applyFilters(results, filters);
    }
    
    setTimeout(() => {
      setFilteredWorkers(results);
      setIsLoading(false);
    }, 400);
  };

  if (workersError) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-orange-50/40 dark:bg-gray-900 pt-24">
          <div className="container mx-auto px-4 py-8">
            <ErrorState />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isLoadingWorkers) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-orange-50/40 dark:bg-gray-900 pt-24">
          <div className="container mx-auto px-4 py-8">
            <LoadingState />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const availableWorkersCount = filteredWorkers.filter(worker => worker.is_available).length;
  const totalCount = filteredWorkers.length;

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
          
          <div className="mt-10 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Found {totalCount} {categoryName.toLowerCase() || 'specialized'} workers 
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
