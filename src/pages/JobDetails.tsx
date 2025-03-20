
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Briefcase, MapPin, Clock, Calendar, Tag, 
  AlertTriangle, CheckCircle, Send, Share, Bookmark
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getJobById, Job } from '@/services/jobService';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

// Helper function to format urgency display
const formatUrgency = (urgency: string) => {
  switch (urgency) {
    case 'low':
      return { label: 'Low Priority', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' };
    case 'normal':
      return { label: 'Normal', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' };
    case 'high':
      return { label: 'High Priority', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' };
    case 'urgent':
      return { label: 'Urgent', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' };
    default:
      return { label: 'Normal', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' };
  }
};

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const jobData = await getJobById(id);
        setJob(jobData);
      } catch (err: any) {
        console.error('Error fetching job details:', err);
        setError(err.message || 'Failed to load job details');
        toast.error('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobDetails();
  }, [id]);
  
  const handleApply = () => {
    if (!user) {
      toast.error('You need to log in to apply for this job');
      navigate('/login');
      return;
    }
    
    if (!job) return;
    
    navigate(`/apply/${job.id}`);
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job?.title || 'Job Opportunity',
        text: `Check out this job: ${job?.title}`,
        url: window.location.href,
      }).catch(err => console.error('Error sharing:', err));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };
  
  if (loading) {
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
  
  if (error || !job) {
    return (
      <div className="min-h-screen flex flex-col app-page-background">
        <Navbar />
        <main className="flex-grow pt-24 flex items-center justify-center">
          <Card className="w-full max-w-md p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Job Not Found</h2>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              {error || "The job posting you're looking for doesn't exist or has been removed."}
            </p>
            <Button onClick={() => navigate('/jobs')} className="w-full">Browse All Jobs</Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }
  
  const urgencyInfo = formatUrgency(job.urgency);
  
  return (
    <div className="min-h-screen flex flex-col app-page-background">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <Button 
            variant="ghost" 
            className="mb-6" 
            onClick={() => navigate('/jobs')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
          </Button>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Job Details */}
            <Card className="lg:col-span-2">
              <CardContent className="p-6">
                <div className="mb-4">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{job.title}</h1>
                  <p className="text-lg text-gray-700 dark:text-gray-300">{job.company}</p>
                </div>
                
                <div className="flex flex-wrap gap-3 mb-6">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{job.location}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Briefcase className="h-4 w-4 mr-1" />
                    <span className="capitalize">{job.job_type.replace('-', ' ')}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Tag className="h-4 w-4 mr-1" />
                    <span>{job.rate}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Posted {new Date(job.posted_date).toLocaleDateString('en-IN', { 
                      year: 'numeric',
                      month: 'short', 
                      day: 'numeric'
                    })}</span>
                  </div>
                </div>
                
                <Badge className={`mb-6 ${urgencyInfo.color}`}>
                  <Clock className="h-3 w-3 mr-1" />
                  {urgencyInfo.label}
                </Badge>
                
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-3">Job Description</h2>
                  <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {job.description}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-3">Required Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="bg-gray-100 dark:bg-gray-800">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <Button className="bg-primary hover:bg-primary/90" onClick={handleApply}>
                    Apply Now
                  </Button>
                  
                  <Button variant="outline" onClick={handleShare}>
                    <Share className="mr-2 h-4 w-4" /> Share
                  </Button>
                  
                  <Button variant="outline">
                    <Bookmark className="mr-2 h-4 w-4" /> Save
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Side Information */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Application Info</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Apply now to connect with the employer and discuss this opportunity further.
                  </p>
                  <Button className="w-full" onClick={handleApply}>
                    <Send className="mr-2 h-4 w-4" /> Apply for this Job
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Have a similar job?</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Post your job and reach qualified workers looking for opportunities like yours.
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/post-job">Post a Job</Link>
                  </Button>
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

export default JobDetails;
