
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-gray-900">
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
      
      <div className="relative pt-32 pb-20 md:pt-40 md:pb-24 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="max-w-2xl">
            <div className="inline-block mb-4">
              <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-400 ring-1 ring-inset ring-blue-700/10">
                Now Available in Your Area
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 leading-tight">
              <span className="block">Connect with skilled</span>
              <span className="block text-primary">craftspeople near you</span>
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-lg">
              Find reliable painters, carpenters, plumbers, electricians and more for your next project. Connect directly, review profiles, and hire with confidence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link to="/workers" className="flex items-center gap-2">
                  Find Workers
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/register">Create Your Profile</Link>
              </Button>
            </div>
            
            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 overflow-hidden">
                    <img 
                      src={`/avatar-${i}.jpg`} 
                      alt="User avatar" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }} 
                    />
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <span className="font-semibold">1,000+ skilled workers</span>
                <span className="text-gray-600 dark:text-gray-400 ml-1">waiting to help</span>
              </div>
            </div>
          </div>
          
          <div className="relative hidden md:block">
            <div className="absolute -inset-2 bg-gradient-radial from-primary/10 to-transparent opacity-70 blur-3xl"></div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl animate-float">
              <img 
                src="/hero-image.jpg" 
                alt="Workers showcase" 
                className="w-full h-auto"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
