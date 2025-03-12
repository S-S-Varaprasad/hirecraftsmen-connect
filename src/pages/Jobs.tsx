
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchFilters from '@/components/SearchFilters';
import JobCard from '@/components/JobCard';

// Sample jobs data
const jobsData = [
  {
    id: '1',
    title: 'Bathroom Remodeling Project',
    company: 'HomeRenovate Inc.',
    location: 'San Francisco, CA',
    jobType: 'Contract',
    rate: '$40-50/hr',
    urgency: 'Medium' as const,
    postedDate: '2 days ago',
    skills: ['Plumbing', 'Tiling', 'Carpentry'],
    description: 'Looking for experienced professionals to help with a complete bathroom renovation project. The work includes installing new fixtures, tiling, and some light carpentry work.',
  },
  {
    id: '2',
    title: 'Electrical System Upgrade',
    company: 'Modern Electric Co.',
    location: 'Seattle, WA',
    jobType: 'Full-time',
    rate: '$35-45/hr',
    urgency: 'High' as const,
    postedDate: '1 day ago',
    skills: ['Electrical', 'Wiring', 'Panel Installation'],
    description: 'We need a certified electrician to upgrade the electrical system in a commercial building. Must have experience with commercial projects and be available immediately.',
  },
  {
    id: '3',
    title: 'Custom Furniture Building',
    company: 'Artisan Woodworks',
    location: 'Portland, OR',
    jobType: 'Project-based',
    rate: '$3,500 total',
    urgency: 'Low' as const,
    postedDate: '1 week ago',
    skills: ['Carpentry', 'Woodworking', 'Finishing'],
    description: 'Artisan woodworking shop seeking a skilled carpenter to help build custom furniture pieces for an upcoming exhibition. Creative input welcome.',
  },
  {
    id: '4',
    title: 'Interior Painting - 3 Bedroom House',
    company: 'Fresh Look Painting',
    location: 'Austin, TX',
    jobType: 'Contract',
    rate: '$30-35/hr',
    urgency: 'Medium' as const,
    postedDate: '3 days ago',
    skills: ['Interior Painting', 'Prep Work', 'Clean-up'],
    description: 'Need professional painters for a complete interior paint job. The house is approximately 2,000 sq ft with 3 bedrooms and 2 bathrooms. All materials will be provided.',
  },
];

const Jobs = () => {
  const [filteredJobs, setFilteredJobs] = useState(jobsData);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (filters: any) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      let results = [...jobsData];
      
      // Apply filters
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        results = results.filter(job => 
          job.title.toLowerCase().includes(term) || 
          job.company.toLowerCase().includes(term) ||
          job.description.toLowerCase().includes(term) ||
          job.skills.some((skill: string) => skill.toLowerCase().includes(term))
        );
      }
      
      if (filters.location) {
        const location = filters.location.toLowerCase();
        results = results.filter(job => 
          job.location.toLowerCase().includes(location)
        );
      }
      
      setFilteredJobs(results);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 dark:bg-gray-900 pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Browse Available Jobs</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Find opportunities that match your skills and availability
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
              {filteredJobs.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredJobs.map((job) => (
                    <JobCard key={job.id} {...job} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
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

export default Jobs;
