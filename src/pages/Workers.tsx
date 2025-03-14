
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
    imageUrl: '/lovable-uploads/bae49f34-0d6e-4f1b-bf50-8d6cf6e46fa1.png',
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
    imageUrl: '/lovable-uploads/aa5e2505-c4ac-44e1-a04d-355cb97f4cff.png',
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
    imageUrl: '/lovable-uploads/38ddfbbd-eddf-4be1-bdc9-7abb44ada4dc.png',
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
    imageUrl: '/lovable-uploads/b502d50d-3fed-4571-a8e0-1ea97e1e93d6.png',
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
    imageUrl: '/lovable-uploads/eb390765-3769-481d-a26f-0c4ddb2a4f35.png',
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
    imageUrl: '/lovable-uploads/6256848e-6930-4ae5-ae11-e69bb6b1fbc2.png',
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
    imageUrl: '/lovable-uploads/97d40d27-7f2e-4573-8cc4-fad4c8adc4a9.png',
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
    imageUrl: '/lovable-uploads/a086ecfc-f4fc-426d-8f8c-f946ffb1f866.png',
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
    imageUrl: '/lovable-uploads/a501a9e5-6077-43aa-b5bb-34ec9e1694f9.png',
  },
  {
    id: '10',
    name: 'Kiran Prakash',
    profession: 'Gardener',
    location: 'Dharwad, Karnataka',
    rating: 4.7,
    experience: '12 years',
    hourlyRate: '₹350',
    skills: ['Landscaping', 'Plant Care', 'Garden Design'],
    isAvailable: true,
    imageUrl: '/lovable-uploads/6f68fb0a-45c2-4188-82f5-924315f45bfb.png',
  },
  {
    id: '11',
    name: 'Sanjay Rao',
    profession: 'Tailor',
    location: 'Bellary, Karnataka',
    rating: 4.9,
    experience: '18 years',
    hourlyRate: '₹500',
    skills: ['Stitching', 'Alterations', 'Traditional Clothing'],
    isAvailable: false,
    imageUrl: '/lovable-uploads/2d955bf0-99e6-4e89-8eaa-322081b2c200.png',
  },
  {
    id: '12',
    name: 'Lakshmi Devi',
    profession: 'Housekeeper',
    location: 'Bengaluru, Karnataka',
    rating: 4.8,
    experience: '10 years',
    hourlyRate: '₹320',
    skills: ['Cleaning', 'Organization', 'Eldercare'],
    isAvailable: true,
    imageUrl: '/lovable-uploads/9a30bb25-6230-4656-a014-6b3a52908509.png',
  },
  {
    id: '13',
    name: 'Ramesh Gowda',
    profession: 'Farmer',
    location: 'Tumkur, Karnataka',
    rating: 4.7,
    experience: '25 years',
    hourlyRate: '₹380',
    skills: ['Organic Farming', 'Crop Management', 'Livestock'],
    isAvailable: true,
    imageUrl: '/lovable-uploads/f24c6a0a-277d-4372-9ce9-b8a54904d96b.png',
  }
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
