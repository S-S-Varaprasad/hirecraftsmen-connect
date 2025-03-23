import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getJobById } from '@/services/jobService';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Briefcase, Building, Mail, MapPin, Send, User, AlertTriangle, FileQuestion } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { FormProvider } from 'react-hook-form';
import AiTextSuggestion from '@/components/AiTextSuggestion';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters.' }),
  message: z.string().min(20, { message: 'Message must be at least 20 characters.' }),
});

type FormValues = z.infer<typeof formSchema>;

const ContactEmployer = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [jobDetails, setJobDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [workerProfile, setWorkerProfile] = useState<any>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  console.log('JobId from params:', jobId);

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobId) {
        console.error('No job ID provided');
        setError('No job ID provided');
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('Fetching job details for ID:', jobId);
        const job = await getJobById(jobId);
        console.log('Job details received:', job);
        
        if (!job) {
          throw new Error('Job not found');
        }
        
        setJobDetails(job);
        
        if (job && job.title) {
          form.setValue('subject', `Regarding job: ${job.title}`);
        }
        
        if (user) {
          try {
            const { data } = await supabase
              .from('workers')
              .select('name')
              .eq('user_id', user.id)
              .maybeSingle();
              
            if (data) {
              form.setValue('name', data.name);
            } else {
              form.setValue('name', user.user_metadata?.name || '');
            }
            
            form.setValue('email', user.email || '');
          } catch (e) {
            console.error('Error fetching worker data:', e);
            form.setValue('name', user.user_metadata?.name || '');
            form.setValue('email', user.email || '');
          }
        }
      } catch (err: any) {
        console.error('Error fetching job details:', err);
        setError(err.message || 'Failed to load job details');
        toast.error('Failed to load job details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId, user, form]);

  useEffect(() => {
    const fetchWorkerProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('workers')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
          
        if (error) {
          console.error('Error fetching worker profile:', error);
          return;
        }
        
        if (data) {
          console.log('Worker profile found:', data);
          setWorkerProfile(data);
        }
      } catch (err) {
        console.error('Error in worker profile fetch:', err);
      }
    };
    
    fetchWorkerProfile();
  }, [user]);

  const getEnhancedContextData = () => {
    const enhancedData = { ...jobDetails };
    
    if (jobDetails?.title) {
      const commonRoles = [
        "Carpenter", "Plumber", "Electrician", "Painter", "Mason", 
        "Mechanic", "Driver", "Chef", "Cleaner", "Security Guard", 
        "Gardener", "Tailor", "Construction Worker", "Welder", 
        "HVAC Technician", "Roofer", "Landscaper", "Handyman"
      ];
      
      const lowerTitle = jobDetails.title.toLowerCase();
      for (const role of commonRoles) {
        if (lowerTitle.includes(role.toLowerCase())) {
          enhancedData.jobRole = role;
          break;
        }
      }
    }
    
    if (workerProfile) {
      enhancedData.workerName = workerProfile.name;
      enhancedData.profession = workerProfile.profession;
      enhancedData.experience = workerProfile.experience;
      enhancedData.workerSkills = workerProfile.skills;
    }
    
    return enhancedData;
  };

  const onSubmit = async (data: FormValues) => {
    if (!jobDetails) {
      toast.error('No job details available');
      return;
    }

    setIsSending(true);
    
    try {
      console.log('Submitting contact form:', data);
      console.log('Job details for message:', jobDetails);
      
      if (!jobDetails.employer_id) {
        console.error('Employer ID is missing from job details');
        toast.error('Cannot send message: employer ID is missing');
        setIsSending(false);
        return;
      }
      
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          job_id: jobId,
          sender_name: data.name,
          sender_email: data.email,
          subject: data.subject,
          message: data.message,
          recipient_id: jobDetails.employer_id,
          sender_id: user?.id || null,
        });
        
      if (messageError) {
        console.error('Error inserting message:', messageError);
        throw messageError;
      }
      
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: jobDetails.employer_id,
          message: `New message regarding "${jobDetails.title}" from ${data.name}`,
          type: 'contact',
          related_id: jobId,
          is_read: false
        });
          
      if (notificationError) {
        console.error('Error creating notification:', notificationError);
      }

      toast.success('Message sent successfully to employer!');
      navigate(`/jobs/${jobId}`);
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error(error.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-orange-50/40 to-white dark:from-gray-900 dark:to-gray-950">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-6 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        
        <div className="grid md:grid-cols-5 gap-6 max-w-6xl mx-auto">
          <div className="md:col-span-2">
            <Card className="h-full shadow-md hover:shadow-lg transition-shadow duration-300 border-t-4 border-t-app-orange">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold text-app-blue dark:text-white">Job Details</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Information about the position
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : error ? (
                  <div className="text-center py-6">
                    <AlertTriangle className="h-10 w-10 text-destructive mx-auto mb-3" />
                    <p className="text-destructive">{error}</p>
                    <Button 
                      variant="outline" 
                      onClick={() => window.location.reload()} 
                      className="mt-4"
                    >
                      Try Again
                    </Button>
                  </div>
                ) : !jobDetails ? (
                  <div className="text-center py-6">
                    <FileQuestion className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                    <p className="text-destructive">Job not found</p>
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/jobs')} 
                      className="mt-4"
                    >
                      Browse Jobs
                    </Button>
                  </div>
                ) : (
                  <>
                    <div>
                      <h2 className="text-2xl font-bold mb-2 text-app-blue dark:text-white">{jobDetails.title}</h2>
                      
                      <div className="flex items-center text-muted-foreground mb-1">
                        <Building className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>{jobDetails.company || 'Company not specified'}</span>
                      </div>
                      
                      <div className="flex items-center text-muted-foreground mb-1">
                        <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>{jobDetails.location || 'Location not specified'}</span>
                      </div>
                      
                      <div className="flex items-center text-muted-foreground">
                        <Briefcase className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>₹{jobDetails.budget || jobDetails.rate || 'Budget not specified'}</span>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {jobDetails.skills && jobDetails.skills.length > 0 && (
                      <div>
                        <h3 className="font-medium mb-2 text-sm uppercase tracking-wide text-muted-foreground">Skills Required</h3>
                        <div className="flex flex-wrap gap-2">
                          {jobDetails.skills.map((skill: string, index: number) => (
                            <Badge key={index} variant="outline" className="bg-app-lightGrey dark:bg-gray-800 text-app-charcoal dark:text-gray-300">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {jobDetails.description && (
                      <div>
                        <h3 className="font-medium mb-2 text-sm uppercase tracking-wide text-muted-foreground">Description</h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-5">
                          {jobDetails.description}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-3">
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-t-4 border-t-app-blue">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold text-app-blue dark:text-white">
                  <Mail className="inline mr-2 h-5 w-5" />
                  Contact Employer
                </CardTitle>
                {jobDetails && (
                  <CardDescription>
                    Send a message about "{jobDetails.title}"
                  </CardDescription>
                )}
              </CardHeader>
              
              <CardContent className="pt-6">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <AlertTriangle className="h-10 w-10 text-destructive mx-auto mb-3" />
                    <p className="text-destructive mb-4">{error}</p>
                    <Button 
                      variant="outline" 
                      onClick={() => window.location.reload()} 
                      className="mr-3"
                    >
                      Try Again
                    </Button>
                    <Button asChild>
                      <Link to="/jobs">Browse Jobs</Link>
                    </Button>
                  </div>
                ) : !jobDetails ? (
                  <div className="text-center py-8">
                    <FileQuestion className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                    <p className="text-destructive mb-4">Job not found or error loading details.</p>
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/jobs')} 
                    >
                      Browse Jobs
                    </Button>
                  </div>
                ) : (
                  <FormProvider {...form}>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center">
                                  <User className="mr-2 h-4 w-4" />
                                  Your Name
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="Your full name" {...field} className="bg-gray-50 dark:bg-gray-800" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center">
                                  <Mail className="mr-2 h-4 w-4" />
                                  Email Address
                                </FormLabel>
                                <div className="space-y-2">
                                  <FormControl>
                                    <Input type="email" placeholder="Your email address" {...field} className="bg-gray-50 dark:bg-gray-800" />
                                  </FormControl>
                                  <FormMessage />
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex justify-between items-center">
                                <FormLabel>Subject</FormLabel>
                                <AiTextSuggestion 
                                  fieldType="subject" 
                                  contextData={getEnhancedContextData()} 
                                  onSuggestionSelect={(suggestion) => form.setValue('subject', suggestion)}
                                />
                              </div>
                              <FormControl>
                                <Input placeholder="Message subject" {...field} className="bg-gray-50 dark:bg-gray-800" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex justify-between items-center">
                                <FormLabel>Message</FormLabel>
                                <AiTextSuggestion 
                                  fieldType="message" 
                                  contextData={getEnhancedContextData()} 
                                  onSuggestionSelect={(suggestion) => form.setValue('message', suggestion)}
                                />
                              </div>
                              <FormControl>
                                <Textarea 
                                  placeholder="Write your message here..."
                                  className="min-h-[150px] bg-gray-50 dark:bg-gray-800" 
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex justify-end pt-4">
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="mr-3 bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                            onClick={() => navigate(-1)}
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="submit"
                            disabled={isLoading || isSending}
                            className="bg-app-blue hover:bg-app-blue/90 text-white gap-2"
                          >
                            {isSending ? (
                              <>
                                <div className="animate-spin h-4 w-4 border-2 border-b-transparent rounded-full"></div>
                                Sending...
                              </>
                            ) : (
                              <>
                                <Send className="h-4 w-4" /> Send Message
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </FormProvider>
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

export default ContactEmployer;
