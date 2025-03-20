
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/search-input';
import { commonSearchTerms, popularLocations } from '@/utils/suggestions';

const HeroSection = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/workers?search=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(location)}`);
  };

  return (
    <div className="relative overflow-hidden bg-white dark:bg-gray-900">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-gray-800 dark:to-gray-900"></div>
      <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-20 pb-24 md:pt-28 md:pb-32 lg:pt-36 lg:pb-40 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
              Find Local <span className="text-orange-600 dark:text-orange-500">Workers</span> Near You
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10">
              Connect with skilled professionals in your area for your home, office, or personal projects
            </p>
            
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
              <div className="flex flex-col md:flex-row gap-3 w-full bg-white dark:bg-gray-800 p-3 rounded-xl shadow-xl">
                <div className="flex-1">
                  <SearchInput 
                    placeholder="What service are you looking for?" 
                    suggestions={commonSearchTerms}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                
                <div className="flex items-center">
                  <SearchInput 
                    placeholder="Location" 
                    suggestions={popularLocations}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full md:w-40 lg:w-56 border-0 focus-visible:ring-0 focus-visible:ring-offset-0" 
                    icon={<MapPin className="h-5 w-5 text-gray-400" />}
                  />
                </div>
                
                <Button type="submit" size="lg" className="bg-orange-500 hover:bg-orange-600">
                  Search
                </Button>
              </div>
            </form>
            
            <div className="mt-8 flex flex-wrap justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <p className="mr-1">Popular:</p>
              <Link to="/workers/by-category/carpenter" className="hover:text-orange-500 hover:underline">Carpenter</Link>
              <span className="mx-1">•</span>
              <Link to="/workers/by-category/plumber" className="hover:text-orange-500 hover:underline">Plumber</Link>
              <span className="mx-1">•</span>
              <Link to="/workers/by-category/electrician" className="hover:text-orange-500 hover:underline">Electrician</Link>
              <span className="mx-1">•</span>
              <Link to="/workers/by-category/painter" className="hover:text-orange-500 hover:underline">Painter</Link>
              <span className="mx-1">•</span>
              <Link to="/workers/by-category/cleaner" className="hover:text-orange-500 hover:underline">Cleaner</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
