
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchFilters from '@/components/SearchFilters';
import ProfileCard from '@/components/ProfileCard';
import { Briefcase, Filter } from 'lucide-react';

// Sample workers data with updated image URLs
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
    imageUrl: '/lovable-uploads/8982dbbf-4f3f-49f8-a06b-529eec7b9020.png',
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
    imageUrl: '/lovable-uploads/8f4e6d86-e9f4-4c17-8d22-8cb12fc3acf4.png',
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
    imageUrl: '/lovable-uploads/d2ac463f-611d-4d8b-9474-ca1b056c597d.png',
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
    imageUrl: '/lovable-uploads/d94fa188-2dd5-4b50-9a8a-93a3dd5f344e.png',
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
    imageUrl: '/lovable-uploads/6d2fd45c-33d8-4c69-bd64-7fbce9cfe1e5.png',
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
    imageUrl: '/lovable-uploads/de66de83-4eab-4ecb-8a9b-16d264ae7f98.png',
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
    imageUrl: '/lovable-uploads/0dcb5641-c85a-4ed3-a216-73ab21ed7e07.png',
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
    imageUrl: '/lovable-uploads/8610c79b-f88e-4c51-a8ca-fd53d8dbfe4b.png',
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
    imageUrl: '/lovable-uploads/297e83af-a6b8-4a90-9d36-78c87209c047.png',
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
    imageUrl: '/lovable-uploads/14c26b9b-373c-4f48-baff-1ade7682833b.png',
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
    imageUrl: '/lovable-uploads/c01178bc-7ba4-4232-a9de-50172c3b3c12.png',
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
    imageUrl: '/lovable-uploads/0345ffb5-d27a-4f2d-ab99-c1a9ade85a07.png',
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
    imageUrl: '/lovable-uploads/f44f054e-3f99-4941-b6e9-c16cc3065582.png',
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
      
      <main className="flex-grow bg-slate-50 dark:bg-gray-900 pt-24">
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
            <SearchFilters onSearch={handleSearch} />
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
                    <ProfileCard key={worker.id} {...worker} />
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
