
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProfileCard from '@/components/ProfileCard';
import SearchFilters from '@/components/SearchFilters';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Briefcase } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getWorkers, Worker } from '@/services/workerService';

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
                      userId={worker.user_id}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white/80 rounded-xl shadow-sm border border-gray-100 dark:bg-gray-800/80 dark:border-gray-700">
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary/90 rounded-full flex items-center justify-center">
                    <Briefcase className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No workers found</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                    We couldn't find any {categoryName.toLowerCase()} professionals matching your criteria. Try adjusting your filters or browse all workers.
                  </p>
                  <Button variant="default" asChild>
                    <Link to="/workers">Browse All Workers</Link>
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

export default WorkersByCategory;
