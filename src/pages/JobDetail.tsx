import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Briefcase,
  IndianRupee,
  Calendar,
  ArrowLeft,
  AlertTriangle,
  FileQuestion,
  Mail,
  Share,
  SendHorizonal
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getJobById } from '@/services/jobService';

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (!id) throw new Error("Job ID is required");
        const jobData = await getJobById(id);
        setJob(jobData);
      } catch (err: any) {
        setError(err.message || 'Failed to load job');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [id]);

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

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      console.error('Invalid date format:', dateString);
      return 'Recently';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link 
              to="/jobs" 
              className="flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Jobs
            </Link>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Job</h3>
              <p className="text-gray-600 mb-6">We couldn't load the job details. Please try again later.</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : !job ? (
            <div className="text-center py-20">
              <FileQuestion className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h3>
              <p className="text-gray-600 mb-6">We couldn't find the job you're looking for.</p>
              <Button asChild>
                <Link to="/jobs">Browse Jobs</Link>
              </Button>
            </div>
          ) : (
            <>
              <Card className="overflow-hidden mb-8">
                <CardHeader className="bg-gray-50 dark:bg-gray-800">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl">{job.title}</CardTitle>
                      <CardDescription className="text-base">{job.company}</CardDescription>
                    </div>
                    <Badge className={getBadgeColor(job.urgency)}>
                      {job.urgency} Priority
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="w-5 h-5 mr-2 text-gray-500" />
                      <span>{job.job_type}</span>
                    </div>
                    <div className="flex items-center">
                      <IndianRupee className="w-5 h-5 mr-2 text-gray-500" />
                      <span>{job.rate}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-gray-500" />
                      <span>Posted {formatDate(job.posted_date || job.created_at)}</span>
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">Job Description</h3>
                    <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {job.description}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">Skills Required</h3>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="bg-gray-50 dark:bg-gray-800">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="bg-gray-50 dark:bg-gray-800 flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex gap-4">
                    <Button asChild variant="outline">
                      <Link to={`/contact-employer/${job.id}`}>
                        <Mail className="mr-2 h-4 w-4" /> Contact Employer
                      </Link>
                    </Button>
                    <Button asChild variant="outline">
                      <a href={`mailto:?subject=Job: ${job.title} at ${job.company}&body=Check out this job opportunity: ${window.location.href}`}>
                        <Share className="mr-2 h-4 w-4" /> Share
                      </a>
                    </Button>
                  </div>
                  <Button asChild>
                    <Link to={`/apply/${job.id}`}>
                      <SendHorizonal className="mr-2 h-4 w-4" /> Apply Now
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
              
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Similar Jobs</h3>
                {/* You can add similar jobs listing here, potentially using the same JobCard component */}
              </div>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default JobDetail;
