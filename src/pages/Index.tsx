import React from 'react';
import { Link } from 'react-router-dom';
import { Paintbrush, Wrench, Hammer, Lightbulb, Flame, Sparkles, Star, ChevronRight, Tool, Shield, Utensils, Spray, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import CategoryCard from '@/components/CategoryCard';
import ProfileCard from '@/components/ProfileCard';

// Sample featured workers data
const featuredWorkers = [
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
    imageUrl: '/avatar-1.jpg',
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
    imageUrl: '/avatar-2.jpg',
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
    imageUrl: '/avatar-3.jpg',
  },
];

// Sample categories data
const categories = [
  {
    title: 'Painter',
    icon: Paintbrush,
    description: 'Expert painters for interior and exterior home decoration.',
    availableWorkers: 124,
    slug: 'painter',
  },
  {
    title: 'Carpenter',
    icon: Hammer,
    description: 'Skilled woodworkers for furniture and custom projects.',
    availableWorkers: 87,
    slug: 'carpenter',
  },
  {
    title: 'Plumber',
    icon: Wrench,
    description: 'Professional plumbing services and repairs.',
    availableWorkers: 56,
    slug: 'plumber',
  },
  {
    title: 'Electrician',
    icon: Lightbulb,
    description: 'Licensed electricians for all electrical work.',
    availableWorkers: 93,
    slug: 'electrician',
  },
  {
    title: 'Mechanic',
    icon: Tool,
    description: 'Expert vehicle and machinery repair services.',
    availableWorkers: 45,
    slug: 'mechanic',
  },
  {
    title: 'Security Guard',
    icon: Shield,
    description: 'Professional security services for events and properties.',
    availableWorkers: 78,
    slug: 'security',
  },
  {
    title: 'Chef',
    icon: Utensils,
    description: 'Experienced chefs for restaurants and private events.',
    availableWorkers: 34,
    slug: 'chef',
  },
  {
    title: 'House Cleaner',
    icon: Spray,
    description: 'Professional cleaning services for homes and offices.',
    availableWorkers: 112,
    slug: 'cleaner',
  },
  {
    title: 'Wedding Planner',
    icon: Heart,
    description: 'Expert planners for your special day.',
    availableWorkers: 23,
    slug: 'wedding-planner',
  },
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Categories Section */}
        <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Explore by Profession</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Find the right skilled professional for your project needs
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <CategoryCard key={index} {...category} />
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Button variant="outline" size="lg" asChild>
                <Link to="/workers" className="flex items-center gap-2">
                  View All Categories
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Featured Workers Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div className="mb-6 md:mb-0">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Featured Professionals</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                  Top-rated craftspeople ready to help with your next project
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link to="/workers" className="flex items-center gap-2">
                  Browse All
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredWorkers.map((worker) => (
                <ProfileCard key={worker.id} {...worker} />
              ))}
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">How It Works</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Simple steps to connect with skilled professionals
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">1. Find a Professional</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Browse through our database of verified professionals or search by skill, location, or project type.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                  <Star className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">2. Review Profiles</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Check ratings, reviews, experience, and availability to make an informed decision.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                  <Flame className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">3. Connect & Hire</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Contact professionals directly, discuss your project, and hire the right person for the job.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-primary rounded-2xl overflow-hidden shadow-xl">
              <div className="px-6 py-12 md:p-12 text-center md:text-left md:flex md:items-center md:justify-between">
                <div className="mb-8 md:mb-0 md:max-w-2xl">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    Ready to find the perfect professional for your project?
                  </h2>
                  <p className="text-primary-foreground/90 text-lg">
                    Join thousands of satisfied customers who have found skilled workers through CraftConnect.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
                    <Link to="/workers">Find Workers</Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                    <Link to="/register">Join as a Worker</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
