
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchFilters from '@/components/SearchFilters';
import ProfileCard from '@/components/ProfileCard';

// Sample workers data
const workersData = [
  {
    id: '1',
    name: 'James Wilson',
    profession: 'Master Carpenter',
    location: 'San Francisco, CA',
    rating: 4.9,
    experience: '15 years',
    hourlyRate: '$45',
    skills: ['Furniture', 'Cabinets', 'Remodeling'],
    isAvailable: true,
    imageUrl: '/avatar-1.jpg',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    profession: 'Electrician',
    location: 'Seattle, WA',
    rating: 4.8,
    experience: '8 years',
    hourlyRate: '$40',
    skills: ['Wiring', 'Installations', 'Repairs'],
    isAvailable: true,
    imageUrl: '/avatar-2.jpg',
  },
  {
    id: '3',
    name: 'Michael Brown',
    profession: 'Plumber',
    location: 'Austin, TX',
    rating: 4.7,
    experience: '12 years',
    hourlyRate: '$38',
    skills: ['Repairs', 'Installations', 'Drainage'],
    isAvailable: false,
    imageUrl: '/avatar-3.jpg',
  },
  {
    id: '4',
    name: 'Emma Davis',
    profession: 'Painter',
    location: 'Chicago, IL',
    rating: 4.9,
    experience: '10 years',
    hourlyRate: '$35',
    skills: ['Interior', 'Exterior', 'Decorative'],
    isAvailable: true,
    imageUrl: '/avatar-4.jpg',
  },
  {
    id: '5',
    name: 'David Martinez',
    profession: 'Welder',
    location: 'Denver, CO',
    rating: 4.6,
    experience: '7 years',
    hourlyRate: '$42',
    skills: ['Structural', 'Metal Art', 'Repairs'],
    isAvailable: true,
    imageUrl: '/avatar-5.jpg',
  },
  {
    id: '6',
    name: 'Lisa Thompson',
    profession: 'Architect',
    location: 'Portland, OR',
    rating: 4.8,
    experience: '9 years',
    hourlyRate: '$60',
    skills: ['Residential', 'Commercial', 'Sustainable'],
    isAvailable: false,
    imageUrl: '/avatar-6.jpg',
  },
];

const Workers = () => {
  const [filteredWorkers, setFilteredWorkers] = useState(workersData);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (filters: any) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      let results = [...workersData];
      
      // Apply filters
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
        results = results.filter(worker => worker.isAvailable);
      }
      
      setFilteredWorkers(results);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 dark:bg-gray-900 pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Find Skilled Professionals</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Browse our directory of qualified workers ready to help with your next project
            </p>
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
                    <ProfileCard key={worker.id} {...worker} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
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
