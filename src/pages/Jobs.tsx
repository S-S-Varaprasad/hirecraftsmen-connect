
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchFilters from '@/components/SearchFilters';
import JobCard from '@/components/JobCard';
import { Briefcase, Filter, Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getJobs, Job, getJobsBySearch } from '@/services/jobService';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const Jobs = () => {
  const { user } = useAuth();
  const { data: jobsData = [], isLoading: isLoadingJobs, error } = useQuery({
    queryKey: ['jobs'],
    queryFn: getJobs,
  });
  
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (jobsData) {
      setFilteredJobs(jobsData);
      setIsLoading(false);
    }
  }, [jobsData]);

  const handleSearch = async (filters: any) => {
    setIsLoading(true);
    
    try {
      // Convert filter format for our service
      const searchParams = {
        searchTerm: filters.searchTerm,
        location: filters.location,
        jobTypes: filters.jobTypes,
        urgency: filters.urgency
      };
      
      // Use real search function instead of setTimeout
      const results = await getJobsBySearch(searchParams);
      setFilteredJobs(results);
      
      // Show toast notification for search results
      toast.info(`Found ${results.length} job${results.length !== 1 ? 's' : ''} matching your search criteria`);
    } catch (error) {
      console.error('Error searching jobs:', error);
      toast.error('Error searching for jobs. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingJobs) {
    return (
      <div className="min-h-screen flex flex-col app-page-background">
        <Navbar />
        <main className="flex-grow pt-24 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col app-page-background">
        <Navbar />
        <main className="flex-grow pt-24 flex justify-center items-center">
          <div className="text-center py-20 bg-white/80 rounded-xl shadow-sm border border-gray-100 dark:bg-gray-800/80 dark:border-gray-700 max-w-md mx-auto px-4">
            <h3 className="text-xl font-semibold mb-2">Error loading jobs</h3>
            <p className="text-gray-600 dark:text-gray-400">
              There was a problem fetching the job data. Please try again later.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col app-page-background">
      <Navbar />
      
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto text-center mb-6">
            <div className="inline-block p-2 px-4 bg-primary/10 text-primary rounded-full text-sm font-medium mb-3">
              Job Opportunities
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Browse Available Jobs</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Find opportunities that match your skills and availability
            </p>
          </div>
          
          {user && (
            <div className="flex justify-center mb-8">
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link to="/post-job" className="flex items-center">
                  <Plus className="mr-2 h-4 w-4" />
                  Post a New Job
                </Link>
              </Button>
            </div>
          )}
          
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
                    <JobCard 
                      key={job.id}
                      id={job.id}
                      title={job.title}
                      company={job.company}
                      location={job.location}
                      jobType={job.job_type}
                      rate={job.rate}
                      urgency={job.urgency}
                      postedDate={new Date(job.posted_date).toLocaleDateString('en-IN', { 
                        year: 'numeric',
                        month: 'short', 
                        day: 'numeric'
                      })}
                      skills={job.skills}
                      description={job.description}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white/80 rounded-xl shadow-lg border border-gray-200 dark:bg-gray-800/80 dark:border-gray-700">
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 dark:bg-primary/20 text-primary rounded-full flex items-center justify-center">
                    <Briefcase className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">No jobs found</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Try adjusting your search filters or criteria
                  </p>
                  {user && (
                    <Button asChild className="bg-primary hover:bg-primary/90">
                      <Link to="/post-job">Post a New Job</Link>
                    </Button>
                  )}
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
