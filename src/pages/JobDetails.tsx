
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Briefcase, IndianRupee, ArrowLeft } from 'lucide-react';
import { getJobById, Job } from '@/services/jobService';
import { toast } from 'sonner';

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: job, isLoading, error } = useQuery({
    queryKey: ['job', id],
    queryFn: () => id ? getJobById(id) : Promise.reject('No job ID provided'),
    enabled: !!id,
  });

  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col app-page-background">
        <Navbar />
        <main className="flex-grow pt-24 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  // Handle error state
  if (error || !job) {
    return (
      <div className="min-h-screen flex flex-col app-page-background">
        <Navbar />
        <main className="flex-grow pt-24 px-4">
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Job Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The job you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/jobs">Browse All Jobs</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Determine badge color based on urgency
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'High':
        return 'bg-red-500 hover:bg-red-600';
      case 'Medium':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'Low':
        return 'bg-green-500 hover:bg-green-600';
      default:
        return 'bg-blue-500 hover:bg-blue-600';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen flex flex-col app-page-background">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <Button 
              variant="ghost" 
              className="mb-4 flex items-center text-gray-600 hover:text-primary"
              onClick={() => navigate('/jobs')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Jobs
            </Button>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="p-8">
                <div className="flex justify-between items-start flex-wrap gap-4 mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{job.title}</h1>
                    <p className="text-xl text-gray-700 dark:text-gray-300">{job.company}</p>
                  </div>
                  <Badge className={`${getUrgencyColor(job.urgency)} px-3 py-1 text-sm`}>
                    {job.urgency} Priority
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-8">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Briefcase className="w-5 h-5 mr-2 text-gray-500" />
                    <span>{job.job_type}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <IndianRupee className="w-5 h-5 mr-2 text-gray-500" />
                    <span>{job.rate}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Calendar className="w-5 h-5 mr-2 text-gray-500" />
                    <span>Posted on {formatDate(job.posted_date)}</span>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Required Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill: string, index: number) => (
                      <Badge key={index} variant="outline" className="bg-gray-50 dark:bg-gray-800">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Job Description</h2>
                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {job.description}
                    </p>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      className="flex-1 bg-primary hover:bg-primary/90 text-white" 
                      size="lg"
                      asChild
                    >
                      <Link to={`/apply/${job.id}`}>Apply Now</Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1" 
                      size="lg"
                      onClick={() => {
                        // Copy job link to clipboard
                        navigator.clipboard.writeText(window.location.href);
                        toast.success('Job link copied to clipboard');
                      }}
                    >
                      Share Job
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default JobDetails;
