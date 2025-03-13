
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchFilters from '@/components/SearchFilters';
import ProfileCard from '@/components/ProfileCard';

// Sample workers data
const workersData = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    profession: 'Master Carpenter',
    location: 'Bengaluru, Karnataka',
    rating: 4.9,
    experience: '15 years',
    hourlyRate: '₹450',
    skills: ['Furniture', 'Cabinets', 'Remodeling'],
    isAvailable: true,
    imageUrl: '/lovable-uploads/b2aa6fb3-3f41-46f1-81ea-37ea94ae8af3.png',
  },
  {
    id: '2',
    name: 'Priya Sharma',
    profession: 'Electrician',
    location: 'Mysuru, Karnataka',
    rating: 4.8,
    experience: '8 years',
    hourlyRate: '₹400',
    skills: ['Wiring', 'Installations', 'Repairs'],
    isAvailable: true,
    imageUrl: '/lovable-uploads/b680b077-f224-42f8-a2d3-95b48ba6e0eb.png',
  },
  {
    id: '3',
    name: 'Mohammed Ali',
    profession: 'Plumber',
    location: 'Mangaluru, Karnataka',
    rating: 4.7,
    experience: '12 years',
    hourlyRate: '₹380',
    skills: ['Repairs', 'Installations', 'Drainage'],
    isAvailable: false,
    imageUrl: '/lovable-uploads/f5bdc72f-cebf-457f-a3f5-46334ba5cb06.png',
  },
  {
    id: '4',
    name: 'Anjali Desai',
    profession: 'Interior Designer',
    location: 'Hubballi, Karnataka',
    rating: 4.9,
    experience: '10 years',
    hourlyRate: '₹650',
    skills: ['Home Design', 'Decoration', 'Space Planning'],
    isAvailable: true,
    imageUrl: '/lovable-uploads/b8156b8d-826a-48fe-90d7-4004ed907f37.png',
  },
  {
    id: '5',
    name: 'Ravi Verma',
    profession: 'Chef',
    location: 'Belagavi, Karnataka',
    rating: 4.6,
    experience: '7 years',
    hourlyRate: '₹800',
    skills: ['Indian Cuisine', 'Continental', 'Catering'],
    isAvailable: true,
    imageUrl: '/lovable-uploads/592e4ea0-235a-4c44-b2e3-df92799ed689.png',
  },
  {
    id: '6',
    name: 'Deepak Shetty',
    profession: 'Security Guard',
    location: 'Bengaluru, Karnataka',
    rating: 4.8,
    experience: '9 years',
    hourlyRate: '₹300',
    skills: ['Event Security', 'Property Protection', 'CCTV Monitoring'],
    isAvailable: false,
    imageUrl: '/lovable-uploads/9e214f91-cc37-4bef-b75b-c1d84f43ca56.png',
  },
  {
    id: '7',
    name: 'Aisha Khan',
    profession: 'Mason',
    location: 'Mangaluru, Karnataka',
    rating: 4.7,
    experience: '11 years',
    hourlyRate: '₹480',
    skills: ['Bricklaying', 'Stone Work', 'Plastering'],
    isAvailable: true,
    imageUrl: '/lovable-uploads/72177b08-56fb-4500-91e3-8ab16c64d4d9.png',
  },
  {
    id: '8',
    name: 'Vikram Reddy',
    profession: 'Mechanic',
    location: 'Mysuru, Karnataka',
    rating: 4.9,
    experience: '14 years',
    hourlyRate: '₹420',
    skills: ['Car Repair', 'Engine Work', 'Diagnostics'],
    isAvailable: true,
    imageUrl: '/lovable-uploads/a6b350c7-28fb-4792-b521-6c447d991800.png',
  },
  {
    id: '9',
    name: 'Sunil Patil',
    profession: 'Painter',
    location: 'Bengaluru, Karnataka',
    rating: 4.8,
    experience: '9 years',
    hourlyRate: '₹390',
    skills: ['Interior Painting', 'Wall Design', 'Finish Work'],
    isAvailable: true,
    imageUrl: '/lovable-uploads/bf3bc67f-7fc9-49f1-86cc-90cdccac25f7.png',
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
