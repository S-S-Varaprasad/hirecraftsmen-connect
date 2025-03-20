import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getJobById } from '@/services/jobService';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Briefcase, MapPin, Calendar, Clock, Tag, Building, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { data: job, isLoading, error } = useQuery({
    queryKey: ['job', id],
    queryFn: () => id ? getJobById(id) : Promise.reject('No job ID provided'),
    enabled: !!id,
  });
  
  const handleApplyClick = () => {
    if (!user) {
      toast.error('You must be logged in to apply for this job');
      navigate('/login');
      return;
    }
    
    // You would implement the actual application logic here
    toast.success('Application submitted successfully!');
  };
  
  if (isLoading) {
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
  
  if (error || !job) {
    return (
      <div className="min-h-screen flex flex-col app-page-background">
        <Navbar />
        <main className="flex-grow pt-24 flex justify-center items-center">
          <Card className="max-w-md p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Job Not Found</h2>
            <p className="mb-6 text-gray-600">
              The job you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/jobs')} className="w-full">
              Browse All Jobs
            </Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }
  
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Low':
        return 'bg-blue-100 text-blue-800';
      case 'Medium':
        return 'bg-amber-100 text-amber-800';
      case 'High':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const urgencyText = {
    'Low': 'Within a month',
    'Medium': 'Within a week',
    'High': 'Immediate / Urgent',
  };
  
  return (
    <div className="min-h-screen flex flex-col app-page-background">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/jobs')}
              className="mb-6"
            >
              ← Back to Jobs
            </Button>
            
            <Card className="mb-8 p-6 md:p-8 shadow-lg">
              <div className="mb-6">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">{job.title}</h1>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Building className="h-4 w-4 mr-1" />
                      <span>{job.company}</span>
                    </div>
                  </div>
                  
                  <div>
                    <Badge className={`mb-2 ${getUrgencyColor(job.urgency)}`}>
                      {job.urgency} Urgency: {urgencyText[job.urgency as keyof typeof urgencyText]}
                    </Badge>
                    <div className="text-right text-sm text-gray-500">
                      Posted on {new Date(job.posted_date).toLocaleDateString('en-IN', { 
                        year: 'numeric',
                        month: 'short', 
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="h-5 w-5 mr-2 text-gray-500" />
                    <span>{job.job_type.charAt(0).toUpperCase() + job.job_type.slice(1)}</span>
                  </div>
                  <div className="flex items-center">
                    <Tag className="h-5 w-5 mr-2 text-gray-500" />
                    <span>{job.rate}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-gray-500" />
                    <span>{urgencyText[job.urgency as keyof typeof urgencyText]}</span>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mb-3">Required Skills</h2>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {job.skills.map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                  
                  <h2 className="text-xl font-semibold mb-3">Job Description</h2>
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-line">{job.description}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button className="flex-1" onClick={handleApplyClick}>
                  Apply for this Job
                </Button>
                <Button variant="outline" className="flex-1">
                  Contact Employer
                </Button>
              </div>
            </Card>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Similar Jobs</h2>
              <p className="text-gray-600">
                Check back later for more jobs like this.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default JobDetails;
