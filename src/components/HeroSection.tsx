
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
                <div className="flex-1 flex items-center pl-3 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                  <Search className="h-5 w-5 text-gray-400" />
                  <Input 
                    type="text" 
                    placeholder="What service are you looking for?" 
                    className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center pl-3 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <Input 
                    type="text" 
                    placeholder="Location" 
                    className="w-full md:w-40 lg:w-56 border-0 focus-visible:ring-0 focus-visible:ring-offset-0" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                
                <Button type="submit" size="lg" className="bg-orange-500 hover:bg-orange-600">
                  Search
                </Button>
              </div>
            </form>
            
            <div className="mt-8 flex flex-wrap justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <p className="mr-1">Popular:</p>
              <a href="/workers/category/carpenter" className="hover:text-orange-500 hover:underline">Carpenter</a>
              <span className="mx-1">•</span>
              <a href="/workers/category/plumber" className="hover:text-orange-500 hover:underline">Plumber</a>
              <span className="mx-1">•</span>
              <a href="/workers/category/electrician" className="hover:text-orange-500 hover:underline">Electrician</a>
              <span className="mx-1">•</span>
              <a href="/workers/category/painter" className="hover:text-orange-500 hover:underline">Painter</a>
              <span className="mx-1">•</span>
              <a href="/workers/category/cleaner" className="hover:text-orange-500 hover:underline">Cleaner</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
