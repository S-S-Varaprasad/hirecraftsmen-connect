
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
import { Mail, Send, ArrowLeft } from 'lucide-react';

// Form validation schema
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
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  // Fetch job details when component mounts
  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobId) return;
      
      setIsLoading(true);
      try {
        const job = await getJobById(jobId);
        setJobDetails(job);
        
        // Pre-fill subject with job title
        form.setValue('subject', `Regarding job: ${job.title}`);
        
        // Pre-fill user data if logged in
        if (user) {
          const { data } = await supabase
            .from('workers')
            .select('name')
            .eq('user_id', user.id)
            .single();
            
          if (data) {
            form.setValue('name', data.name);
          } else {
            form.setValue('name', user.user_metadata?.name || '');
          }
          
          form.setValue('email', user.email || '');
        }
      } catch (error) {
        toast.error('Failed to load job details');
        console.error('Error fetching job details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId, user, form]);

  const onSubmit = async (data: FormValues) => {
    if (!jobDetails) {
      toast.error('No job details available');
      return;
    }

    setIsSending(true);
    
    try {
      // Insert message into the messages table
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          job_id: jobId,
          sender_name: data.name,
          sender_email: data.email,
          subject: data.subject,
          message: data.message,
          recipient_id: jobDetails.employer_id || null,
          sender_id: user?.id || null,
        });
        
      if (messageError) throw messageError;
      
      // Create a notification for the employer
      if (jobDetails.employer_id) {
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
          // Continue even if notification fails
        }
      }

      toast.success('Message sent successfully!');
      navigate(`/jobs/${jobId}`);
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error(error.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
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
        
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Contact Employer</CardTitle>
            {jobDetails && (
              <CardDescription>
                Regarding job: {jobDetails.title} at {jobDetails.company}
              </CardDescription>
            )}
          </CardHeader>
          
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : !jobDetails ? (
              <div className="text-center py-8">
                <p className="text-red-500">Job not found or error loading details.</p>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/jobs')} 
                  className="mt-4"
                >
                  Browse Jobs
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your full name" {...field} />
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
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Your email address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="Message subject" {...field} />
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
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Write your message here..."
                            className="min-h-[150px]" 
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-end">
            <Button 
              type="button" 
              variant="outline" 
              className="mr-2"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              onClick={form.handleSubmit(onSubmit)}
              disabled={isLoading || isSending}
            >
              {isSending ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" /> Send Message
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default ContactEmployer;
