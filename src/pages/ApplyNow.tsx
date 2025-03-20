import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, FileQuestion, SendHorizonal, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { 
  getJobById, 
} from '@/services/jobService';
import { 
  getWorkerByUserId 
} from '@/services/workerService';
import { 
  applyToJob, 
  checkApplicationExists,
  Application
} from '@/services/applicationService';
import { createNotification } from '@/services/notificationService';

// Form validation schema
const formSchema = z.object({
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type FormValues = z.infer<typeof formSchema>;

const ApplyNow = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [jobData, setJobData] = useState<any>(null);
  const [workerId, setWorkerId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [existingApplication, setExistingApplication] = useState<Application | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  // Inside the ApplyNow component, update the useEffect hook:
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (!user) {
          setError("You must be logged in to apply for jobs");
          return;
        }

        // First, find the worker profile for the current user
        const worker = await getWorkerByUserId(user.id);
        
        if (!worker) {
          setError("You need to create a worker profile before you can apply to jobs");
          return;
        }
        
        setWorkerId(worker.id);
        
        if (!jobId) {
          setError("Job ID is missing");
          return;
        }
        
        // Fetch job details
        const job = await getJobById(jobId);
        setJobData(job);
        
        // Check if the worker has already applied for this job
        const { exists, applications } = await checkApplicationExists(jobId, worker.id);
        
        if (exists) {
          const application = applications[0];
          setAlreadyApplied(true);
          setExistingApplication(application);
        }
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.message || "Failed to load necessary data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [jobId, user]);

  // Update the onSubmit function:
  const onSubmit = async (data: FormValues) => {
    if (!workerId || !jobData) return;
    
    setIsSubmitting(true);
    
    try {
      // Apply to the job with the complete data
      const result = await applyToJob(jobData.id, workerId, data.message);
      
      // If successful, show success toast and redirect
      toast.success("Application submitted successfully!");
      
      // Set up notification for the employer if they exist
      if (jobData.employer_id) {
        try {
          await createNotification(
            jobData.employer_id,
            `New application received for job: ${jobData.title}`,
            'application_received',
            result.id
          );
        } catch (notifyError) {
          console.error('Error sending notification to employer:', notifyError);
          // Continue even if notification fails
        }
      }
      
      // Redirect to job history page
      navigate('/job-history');
    } catch (error: any) {
      console.error('Error submitting application:', error);
      toast.error(error.message || "Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary border-solid"></div>
          </div>
        ) : error ? (
          <Card className="max-w-md mx-auto">
            <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2">
              <AlertTriangle className="h-8 w-8 text-red-500 mr-2" />
              <CardTitle className="text-2xl font-semibold tracking-tight">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-gray-500">
                {error}
              </CardDescription>
              <div className="flex justify-center mt-4">
                <Button variant="outline" onClick={() => navigate('/join-as-worker')}>
                  Create Worker Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : alreadyApplied ? (
          <Card className="max-w-md mx-auto">
            <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2">
              <FileQuestion className="h-8 w-8 text-blue-500 mr-2" />
              <CardTitle className="text-2xl font-semibold tracking-tight">Already Applied</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-gray-500">
                You have already applied for this job.
              </CardDescription>
              {existingApplication && (
                <div className="mt-4 text-center">
                  <p>Your application message:</p>
                  <p className="font-semibold">{existingApplication.message}</p>
                </div>
              )}
              <div className="flex justify-center mt-4">
                <Button onClick={() => navigate('/job-history')}>
                  View Job History
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : jobData ? (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Apply for {jobData.title}</CardTitle>
              <CardDescription>at {jobData.company}</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Write a message to the employer"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white border-solid mr-2"></div>
                        <span>Submitting...</span>
                      </div>
                    ) : (
                      <>
                        Apply Now <SendHorizonal className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        ) : (
          <Card className="max-w-md mx-auto">
            <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2">
              <FileQuestion className="h-8 w-8 text-gray-500 mr-2" />
              <CardTitle className="text-2xl font-semibold tracking-tight">Job Not Found</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-gray-500">
                The job you are looking for does not exist.
              </CardDescription>
              <div className="flex justify-center mt-4">
                <Button asChild>
                  <Link to="/jobs">Browse Jobs</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ApplyNow;
