
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { getJobById } from '@/services/jobService';
import { getWorkerByUserId } from '@/services/workerService';
import { applyToJob, checkApplicationExists } from '@/services/applicationService';
import { useAuth } from '@/context/AuthContext';
import { Tables } from '@/integrations/supabase/types';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  ArrowLeft, 
  Briefcase, 
  MapPin, 
  IndianRupee, 
  Clock, 
  SendHorizonal, 
  User, 
  Award, 
  CheckCheck, 
  FileText,
  Lightbulb
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

// Define the Application interface
interface Application extends Tables<'applications'> {
  status: 'applied' | 'accepted' | 'rejected' | 'completed';
}

const ApplyNow: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState<any>(null);
  const [worker, setWorker] = useState<any>(null);
  const [applicationMessage, setApplicationMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [existingApplication, setExistingApplication] = useState<Application | null>(null);
  const [characterCount, setCharacterCount] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  // Application message templates
  const messageTemplates = {
    general: `I am very interested in this ${job?.job_type} position at ${job?.company}. With my experience in ${job?.skills?.join(', ')}, I believe I would be a great fit for this role. I am available to start immediately and look forward to discussing this opportunity further.`,
    experience: `I have extensive experience in ${job?.skills?.join(', ')} which makes me well-suited for this position. I have worked on similar projects before and can deliver high-quality results efficiently. I am excited about the opportunity to work with ${job?.company}.`,
    enthusiasm: `I am extremely enthusiastic about this opportunity at ${job?.company}! This position aligns perfectly with my career goals and skill set. I am particularly drawn to this role because it allows me to utilize my expertise in ${job?.skills?.join(', ')}. I would bring energy and dedication to this position.`,
    availability: `I am immediately available to start working on this ${job?.job_type} position. I can commit to the schedule required and am flexible to accommodate your needs. I have all the necessary tools and skills related to ${job?.skills?.join(', ')} to begin contributing right away.`
  };

  useEffect(() => {
    if (!jobId) {
      toast.error('Job ID is required');
      navigate('/jobs');
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch the job data
        const job = await getJobById(jobId);
        if (!job) {
          toast.error('Job not found');
          navigate('/jobs');
          return;
        }
        setJob(job);

        // Get the worker profile for the current user
        const workerData = await getWorkerByUserId(user?.id || '');

        if (!workerData) {
          toast.error('You need to create a worker profile first');
          navigate('/join-as-worker');
          return;
        }

        setWorker(workerData);

        try {
          // Check if the worker has already applied for this job
          const { exists, applications } = await checkApplicationExists(jobId, workerData.id);

          if (exists && applications.length > 0) {
            // Type assertion to ensure the application matches the Application interface
            const typedApplication: Application = {
              ...applications[0],
              status: applications[0].status as 'applied' | 'accepted' | 'rejected' | 'completed'
            };

            setAlreadyApplied(true);
            setExistingApplication(typedApplication);
          }
        } catch (err: any) {
          console.error('Error fetching data:', err);
          toast.error(`Error: ${err.message}`);
        }
      } catch (err: any) {
        console.error('Error fetching data:', err);
        toast.error(`Error: ${err.message}`);
        navigate('/jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId, navigate, user?.id]);

  const handleApply = async () => {
    if (!jobId || !worker) {
      toast.error('Job ID or worker data is missing');
      return;
    }

    if (applicationMessage.trim().length < 20) {
      toast.error('Please write a more detailed application message (at least 20 characters)');
      return;
    }

    setSubmitting(true);
    try {
      // Apply for the job
      await applyToJob(jobId, worker.id, applicationMessage);
      toast.success('Application submitted successfully!');
      setAlreadyApplied(true);
      
      // Wait a moment before navigating to give user time to see the success message
      setTimeout(() => {
        navigate('/worker-job-history');
      }, 2000);
    } catch (err: any) {
      console.error('Error applying for job:', err);
      toast.error(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setApplicationMessage(e.target.value);
    setCharacterCount(e.target.value.length);
  };

  const handleTemplateSelect = (templateKey: string) => {
    if (templateKey && messageTemplates[templateKey as keyof typeof messageTemplates]) {
      setSelectedTemplate(templateKey);
      setApplicationMessage(messageTemplates[templateKey as keyof typeof messageTemplates]);
      setCharacterCount(messageTemplates[templateKey as keyof typeof messageTemplates].length);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'applied':
        return <Badge className="bg-blue-500">Applied</Badge>;
      case 'accepted':
        return <Badge className="bg-green-500">Accepted</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      case 'completed':
        return <Badge className="bg-purple-500">Completed</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 mt-16 flex justify-center items-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-12 w-12 mb-4"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-52 mb-2.5"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!job || !worker) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 mt-16 flex justify-center items-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center text-red-500">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center">Job or worker data not found.</p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button asChild>
                <Link to="/jobs">Browse Jobs</Link>
              </Button>
            </CardFooter>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50/40 to-white dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)} 
              className="flex items-center text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Job
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border-purple-100 dark:border-purple-900/30 overflow-hidden shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 dark:from-purple-900/20 dark:to-blue-900/20 border-b border-purple-100 dark:border-gray-700">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div>
                    <CardTitle className="text-2xl">{job.title}</CardTitle>
                    <CardDescription className="text-base">{job.company}</CardDescription>
                  </div>
                  <Badge className="bg-purple-500 hover:bg-purple-600 self-start">
                    {job.urgency} Priority
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <MapPin className="w-5 h-5 mr-2 text-purple-500" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <Briefcase className="w-5 h-5 mr-2 text-purple-500" />
                    <span>{job.job_type || job.jobType}</span>
                  </div>
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <IndianRupee className="w-5 h-5 mr-2 text-purple-500" />
                    <span>{job.rate}</span>
                  </div>
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <Clock className="w-5 h-5 mr-2 text-purple-500" />
                    <span>Application Deadline: 7 days</span>
                  </div>
                </div>

                <Separator className="my-6 bg-purple-100 dark:bg-gray-700" />

                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    <User className="w-5 h-5 mr-2 text-purple-500" />
                    Your Application
                  </h3>

                  {alreadyApplied && existingApplication ? (
                    <motion.div 
                      className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-medium">Application Status</h4>
                        {getStatusBadge(existingApplication.status)}
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        You have already applied for this position. You can view your application status in your job history.
                      </p>

                      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-md border border-purple-100 dark:border-purple-800/50">
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Application Message:</h5>
                        <p className="text-gray-600 dark:text-gray-400 text-sm italic">"{existingApplication.message || 'No message provided'}"</p>
                      </div>
                      
                      <div className="mt-6 flex justify-end">
                        <Button asChild variant="outline">
                          <Link to="/worker-job-history">
                            <FileText className="mr-2 h-4 w-4" /> View All Applications
                          </Link>
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      className="space-y-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-md border-l-4 border-purple-500 mb-4">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Tell the employer why you're the perfect fit for this job. Highlight your relevant skills and experience.
                        </p>
                      </div>
                      
                      <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-md border border-amber-200 dark:border-amber-800/40 flex items-start gap-3 mb-2">
                        <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-1">Use a Message Template</h4>
                          <p className="text-xs text-amber-700 dark:text-amber-400 mb-3">
                            Select a template below to get started, then customize it to match your experience.
                          </p>
                          <Select onValueChange={handleTemplateSelect} value={selectedTemplate}>
                            <SelectTrigger className="w-full bg-white dark:bg-gray-800">
                              <SelectValue placeholder="Select a template" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="general">General Interest</SelectItem>
                              <SelectItem value="experience">Highlight Experience</SelectItem>
                              <SelectItem value="enthusiasm">Show Enthusiasm</SelectItem>
                              <SelectItem value="availability">Emphasize Availability</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="applicationMessage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Application Message <span className="text-red-500">*</span>
                        </label>
                        <Textarea
                          id="applicationMessage"
                          rows={6}
                          className="resize-none w-full border-gray-300 dark:border-gray-700 focus:ring-purple-500 focus:border-purple-500"
                          placeholder="Introduce yourself and explain why you're interested in this position..."
                          value={applicationMessage}
                          onChange={handleMessageChange}
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Minimum 20 characters</span>
                          <span className={characterCount < 20 ? "text-red-500" : "text-green-500"}>
                            {characterCount} characters
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mt-2">
                        <CheckCheck className="h-4 w-4 text-green-500" />
                        <span>Your profile information will be shared with the employer</span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </CardContent>

              <CardFooter className="bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => navigate(-1)}
                  className="border-gray-300 dark:border-gray-700"
                >
                  Cancel
                </Button>
                
                {!alreadyApplied && (
                  <Button 
                    onClick={handleApply} 
                    disabled={submitting || applicationMessage.trim().length < 20}
                    className="bg-purple-600 hover:bg-purple-700 transition-colors"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <SendHorizonal className="mr-2 h-4 w-4" /> Submit Application
                      </>
                    )}
                  </Button>
                )}

                {alreadyApplied && (
                  <Button asChild className="bg-purple-600 hover:bg-purple-700">
                    <Link to="/jobs">
                      <Briefcase className="mr-2 h-4 w-4" /> Browse More Jobs
                    </Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ApplyNow;
