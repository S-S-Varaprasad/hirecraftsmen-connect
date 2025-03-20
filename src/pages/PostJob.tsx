
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/context/AuthContext';
import { createJob } from '@/services/jobService';
import { useWorkerProfiles } from '@/hooks/useWorkerProfiles';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

// Form validation schema
const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  company: z.string().min(2, 'Company name is required'),
  location: z.string().min(2, 'Location is required'),
  job_type: z.string().min(2, 'Job type is required'),
  rate: z.string().min(1, 'Rate is required'),
  urgency: z.enum(['Low', 'Medium', 'High']),
  skills: z.string().min(3, 'Skills are required'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  notifyWorkers: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const PostJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { notifyWorkers } = useWorkerProfiles();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      company: '',
      location: '',
      job_type: '',
      rate: '',
      urgency: 'Medium',
      skills: '',
      description: '',
      notifyWorkers: true,
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast.error('You must be logged in to post a job');
      navigate('/login');
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert skills string to array
      const skillsArray = data.skills.split(',').map(skill => skill.trim());
      
      // Create job
      const newJob = await createJob({
        title: data.title,
        company: data.company,
        location: data.location,
        job_type: data.job_type,
        rate: data.rate,
        urgency: data.urgency as 'Low' | 'Medium' | 'High',
        skills: skillsArray,
        description: data.description,
        employer_id: user.id,
      });
      
      // Notify matched workers if option is selected
      if (data.notifyWorkers && newJob) {
        await notifyWorkers(
          newJob.id, 
          newJob.title, 
          skillsArray,
          undefined,
          true, // send email
          false, // don't send SMS
          user.id
        );
      }
      
      setIsSuccess(true);
      toast.success('Job posted successfully!');
      
      // Reset form
      form.reset();
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate(`/jobs/${newJob.id}`);
      }, 2000);
      
    } catch (error) {
      console.error('Error posting job:', error);
      toast.error('Failed to post job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-orange-50/40 dark:bg-gray-900 pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Post a New Job
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Reach skilled professionals and find the perfect match for your requirements
              </p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
                <CardDescription>
                  Fill in the details below to create your job listing
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {isSuccess ? (
                  <div className="py-12 text-center">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Job Posted Successfully!</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Your job has been posted and is now live.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      Redirecting you to view your job...
                    </p>
                  </div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Job Title</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Experienced Plumber Needed" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="company"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company/Employer Name</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. ABC Services" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Mumbai, Maharashtra" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="job_type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Job Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select job type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Full-time">Full-time</SelectItem>
                                  <SelectItem value="Part-time">Part-time</SelectItem>
                                  <SelectItem value="Contract">Contract</SelectItem>
                                  <SelectItem value="One-time">One-time</SelectItem>
                                  <SelectItem value="Freelance">Freelance</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="rate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Salary/Rate</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. ₹30,000 per month" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="urgency"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Urgency Level</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select urgency level" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Low">Low</SelectItem>
                                  <SelectItem value="Medium">Medium</SelectItem>
                                  <SelectItem value="High">High</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="skills"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Required Skills</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g. Plumbing, Repairs, Installation (comma separated)" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Job Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe the job requirements, responsibilities, and other important details..." 
                                className="min-h-[150px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <CardFooter className="px-0 pb-0 pt-2">
                        <div className="w-full flex flex-col md:flex-row gap-3 justify-end">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate('/jobs')}
                            disabled={isSubmitting}
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="bg-orange-600 hover:bg-orange-700"
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Posting Job...
                              </>
                            ) : (
                              'Post Job'
                            )}
                          </Button>
                        </div>
                      </CardFooter>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PostJob;
