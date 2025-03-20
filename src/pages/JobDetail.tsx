
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getJobById } from '@/services/jobService';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Briefcase, IndianRupee, Clock, Calendar, ArrowLeft, Send } from 'lucide-react';
import { toast } from 'sonner';

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: job, isLoading, error } = useQuery({
    queryKey: ['job', id],
    queryFn: () => id ? getJobById(id) : Promise.reject('No job ID provided'),
    enabled: !!id,
  });

  const handleApply = () => {
    if (id) {
      navigate(`/apply/${id}`);
    } else {
      toast.error('Job information missing');
    }
  };

  // Determine badge color based on urgency
  const getBadgeColor = (urgency: string) => {
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-orange-50/40 dark:bg-gray-900 pt-24 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-orange-50/40 dark:bg-gray-900 pt-24">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-20 bg-white/80 rounded-xl shadow-sm border border-gray-100 dark:bg-gray-800/80 dark:border-gray-700 max-w-md mx-auto px-4">
              <h3 className="text-xl font-semibold mb-2">Error loading job</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                The job you're looking for could not be found or is no longer available.
              </p>
              <Button onClick={() => navigate('/jobs')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Jobs
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-orange-50/40 dark:bg-gray-900 pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button variant="ghost" onClick={() => navigate('/jobs')} className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Jobs
            </Button>
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{job.title}</h1>
                <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300">{job.company}</h2>
              </div>
              <Badge className={`${getBadgeColor(job.urgency)} self-start md:self-center mt-2 md:mt-0`}>
                {job.urgency} Priority
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Job Description</h3>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="whitespace-pre-line text-gray-700 dark:text-gray-300">
                      {job.description}
                    </p>
                  </div>
                  
                  <h3 className="text-xl font-semibold mt-8 mb-4">Required Skills</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {job.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="bg-gray-50 dark:bg-gray-800">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="mb-6 sticky top-24">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">Job Details</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 mr-3 text-gray-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-700 dark:text-gray-300">Location</h4>
                        <p className="text-gray-600 dark:text-gray-400">{job.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Briefcase className="w-5 h-5 mr-3 text-gray-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-700 dark:text-gray-300">Job Type</h4>
                        <p className="text-gray-600 dark:text-gray-400">{job.job_type}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <IndianRupee className="w-5 h-5 mr-3 text-gray-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-700 dark:text-gray-300">Salary/Rate</h4>
                        <p className="text-gray-600 dark:text-gray-400">{job.rate}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Calendar className="w-5 h-5 mr-3 text-gray-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-700 dark:text-gray-300">Posted Date</h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          {new Date(job.posted_date).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 space-y-3">
                    <Button className="w-full" onClick={handleApply}>
                      Apply Now
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to={`/message/employer/${job.employer_id}`}>
                        <Send className="mr-2 h-4 w-4" />
                        Contact Employer
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default JobDetail;
