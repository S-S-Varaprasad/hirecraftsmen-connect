
import React, { useState, useEffect, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchFilters from '@/components/SearchFilters';
import JobCard from '@/components/JobCard';
import { Briefcase, Filter, SearchX } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Stars, PerspectiveCamera } from '@react-three/drei';
import { useMediaQuery } from '@/hooks/use-mobile';
import { useJobs } from '@/hooks/useJobs';

// 3D floating particles background component
const Background3D = () => {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full overflow-hidden opacity-70">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 30]} />
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={0.3} />
        <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={0.5} />
      </Canvas>
    </div>
  );
};

const Jobs = () => {
  const { jobs, isLoading, error, handleSearch, refreshJobs } = useJobs();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Refresh jobs on component mount
  useEffect(() => {
    refreshJobs();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-gradient-to-b from-orange-50/40 to-white dark:from-gray-900 dark:to-gray-800 pt-24 flex justify-center items-center">
          <motion.div 
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-t-2 border-b-2 border-primary animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-r-2 border-l-2 border-primary animate-spin animate-reverse"></div>
              <Briefcase className="absolute inset-0 m-auto w-8 h-8 text-primary/70" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 animate-pulse">Loading opportunities...</p>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-gradient-to-b from-orange-50/40 to-white dark:from-gray-900 dark:to-gray-800 pt-24 flex justify-center items-center">
          <div className="text-center py-20 glass dark:glass-dark rounded-xl shadow-lg max-w-md mx-auto px-4 backdrop-blur-sm">
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-orange-50/40 to-white dark:from-gray-900 dark:to-gray-800 relative">
      <Navbar />
      
      {!isMobile && <Background3D />}
      
      <main className="flex-grow pt-24 relative z-10">
        <div className="container mx-auto px-4 py-8">
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4 gap-2 hover-lift"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Briefcase className="w-4 h-4" />
              <span>Job Opportunities</span>
            </motion.div>
            
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-5 tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Browse Available Jobs
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Find opportunities that match your skills and availability
            </p>
          </motion.div>
          
          <motion.div 
            className="mb-8 glass dark:glass-dark p-4 rounded-xl shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <SearchFilters onSearch={handleSearch} />
          </motion.div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <motion.div 
                className="flex flex-col items-center gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-t-2 border-b-2 border-primary animate-spin"></div>
                  <div className="absolute inset-2 rounded-full border-r-2 border-l-2 border-primary animate-spin animate-reverse"></div>
                  <Filter className="absolute inset-0 m-auto w-8 h-8 text-primary/70" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 animate-pulse">Filtering jobs...</p>
              </motion.div>
            </div>
          ) : (
            <>
              {jobs.length > 0 ? (
                <motion.div 
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {jobs.map((job, index) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.4,
                        delay: 0.3 + (index * 0.05)
                      }}
                      className="three-d-card hover-lift"
                    >
                      <JobCard 
                        id={job.id}
                        title={job.title}
                        company={job.company}
                        location={job.location}
                        jobType={job.job_type}
                        rate={job.rate}
                        urgency={job.urgency}
                        postedDate={job.posted_date || job.created_at}
                        skills={job.skills}
                        description={job.description}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  className="text-center py-20 glass dark:glass-dark rounded-xl shadow-3d backdrop-blur-sm"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 dark:bg-primary/20 text-primary rounded-full flex items-center justify-center">
                    <SearchX className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">No jobs found</h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    Try adjusting your search filters or criteria to find more opportunities
                  </p>
                </motion.div>
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
