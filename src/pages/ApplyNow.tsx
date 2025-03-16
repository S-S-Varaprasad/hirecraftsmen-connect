
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Briefcase, MapPin, Calendar, Clock, IndianRupee, CheckCircle, AlertCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getJobById } from '@/services/jobService';
import { getWorkerByUserId, getWorkerById } from '@/services/workerService';
import { applyToJob } from '@/services/applicationService';
import { createNotification } from '@/services/notificationService';
import { toast } from 'sonner';

const ApplyNow = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please log in to apply for jobs');
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Fetch job details
  const { data: job, isLoading: isLoadingJob, error: jobError } = useQuery({
    queryKey: ['job', id],
    queryFn: () => getJobById(id!),
    enabled: !!id && isAuthenticated,
  });

  // Fetch worker profile for current user
  const { data: workerProfile, isLoading: isLoadingWorker } = useQuery({
    queryKey: ['worker', user?.id],
    queryFn: () => getWorkerByUserId(user!.id),
    enabled: !!user?.id && isAuthenticated,
  });

  // Create application mutation
  const applyMutation = useMutation({
    mutationFn: async () => {
      if (!workerProfile) {
        throw new Error('You must create a worker profile before applying for jobs');
      }
      if (!job) throw new Error('Job not found');
      
      // Apply to job
      const application = await applyToJob(job.id, workerProfile.id, message);
      
      // Create notification for employer
      if (job.employer_id) {
        await createNotification(
          job.employer_id,
          `${workerProfile.name} has applied for "${job.title}"`,
          'application',
          application.id
        );
      }
      
      return application;
    },
    onSuccess: () => {
      toast.success('Application submitted successfully!');
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      navigate('/jobs');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to submit application');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast.warning('Please include a message with your application');
      return;
    }
    
    if (!workerProfile) {
      toast.error('You need to create a worker profile before applying');
      navigate('/join-as-worker');
      return;
    }
    
    applyMutation.mutate();
  };

  if (isLoadingJob || isLoadingWorker) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-orange-50/40 dark:bg-gray-900 pt-24 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (jobError || !job) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-orange-50/40 dark:bg-gray-900 pt-24">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                The job you're looking for doesn't exist or has been removed.
              </p>
              <Button asChild>
                <Link to="/jobs">Browse Jobs</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!workerProfile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-orange-50/40 dark:bg-gray-900 pt-24">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
              <h1 className="text-2xl font-bold mb-4">Worker Profile Required</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                You need to create a worker profile before you can apply for jobs.
              </p>
              <Button asChild>
                <Link to="/join-as-worker">Create Worker Profile</Link>
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
          <Link to={`/jobs`} className="inline-flex items-center text-primary hover:underline mb-6">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Jobs
          </Link>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Job Details Card */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl mb-1">{job.title}</CardTitle>
                      <CardDescription className="text-base">{job.company}</CardDescription>
                    </div>
                    <Badge className={`
                      ${job.urgency === 'High' ? 'bg-red-500 hover:bg-red-600' : 
                        job.urgency === 'Medium' ? 'bg-yellow-500 hover:bg-yellow-600' : 
                        'bg-green-500 hover:bg-green-600'}
                    `}>
                      {job.urgency} Priority
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Briefcase className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{job.job_type}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <IndianRupee className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{job.rate}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                      <span>Posted {new Date(job.posted_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-2">Description</h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">{job.description}</p>
                    
                    <h3 className="font-medium mb-2">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Application Form */}
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Apply for this Job</CardTitle>
                  <CardDescription>
                    You are applying as:
                  </CardDescription>
                  <div className="flex items-center mt-2">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={workerProfile.image_url || undefined} />
                      <AvatarFallback>{workerProfile.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{workerProfile.name}</p>
                      <p className="text-sm text-gray-500">{workerProfile.profession}</p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium mb-1">
                          Message to Employer
                        </label>
                        <Textarea
                          id="message"
                          placeholder="Introduce yourself and explain why you're a good fit for this job..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          rows={6}
                          required
                        />
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full mt-6" 
                      disabled={applyMutation.isPending}
                    >
                      {applyMutation.isPending ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
                          Submitting...
                        </>
                      ) : (
                        'Submit Application'
                      )}
                    </Button>
                  </form>
                </CardContent>
                
                <CardFooter className="flex-col items-start pt-0">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    <p className="flex items-center mb-1">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Your contact information will be shared with the employer
                    </p>
                    <p className="flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      You'll be notified when the employer responds
                    </p>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ApplyNow;
