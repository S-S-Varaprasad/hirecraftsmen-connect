
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  applyToJob, 
  getApplicationsByWorkerId, 
  getApplicationsByJobId, 
  updateApplicationStatus,
  markApplicationCompleted 
} from '@/services/applicationService';
import { getJobById } from '@/services/jobService';
import { getWorkerById } from '@/services/workerService';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useJobApplications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Apply for a job and send notifications
  const applyForJob = useMutation({
    mutationFn: async ({ 
      jobId, 
      workerId, 
      message 
    }: { 
      jobId: string, 
      workerId: string, 
      message: string 
    }) => {
      setIsSubmitting(true);
      console.log(`Applying for job: ${jobId} as worker: ${workerId}`);
      
      try {
        // Get job details
        const job = await getJobById(jobId);
        if (!job) throw new Error('Job not found');
        console.log('Job details:', job);
        
        // Get worker details
        const worker = await getWorkerById(workerId);
        if (!worker) throw new Error('Worker profile not found');
        console.log('Worker details:', worker);
        
        // Submit application
        const application = await applyToJob(jobId, workerId, message);
        console.log('Application submitted:', application);
        
        // Notify the employer about the application
        if (job.employer_id) {
          console.log(`Sending notification to employer: ${job.employer_id}`);
          
          try {
            // Call our edge function for notifications
            const { error: notifyError } = await supabase.functions.invoke('notify-user', {
              body: {
                userId: job.employer_id,
                message: `${worker.name} has applied to your job: ${job.title}`,
                type: 'new_application',
                relatedId: jobId,
                sendEmail: true
              }
            });

            if (notifyError) {
              console.error('Error notifying employer:', notifyError);
            } else {
              console.log('Employer notification sent successfully');
            }
          } catch (notifyError) {
            console.error('Error in notification function:', notifyError);
            // Continue even if notification fails
          }
        } else {
          console.log('No employer_id found for job, skipping notification');
        }
        
        // Create notification for the worker too
        if (user?.id) {
          try {
            const { error: workerNotifyError } = await supabase.functions.invoke('notify-user', {
              body: {
                userId: user.id,
                message: `You have successfully applied to the job: ${job.title}`,
                type: 'job_application',
                relatedId: jobId
              }
            });
            
            if (workerNotifyError) {
              console.error('Error creating worker notification:', workerNotifyError);
            } else {
              console.log('Worker application notification created');
            }
          } catch (workerNotifyError) {
            console.error('Error with worker notification:', workerNotifyError);
          }
        }
        
        return application;
      } finally {
        setIsSubmitting(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['worker-applications'] });
      toast.success('Application submitted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to submit application');
    },
  });

  // For employer: Accept a worker application and notify them
  const acceptApplication = useMutation({
    mutationFn: async ({ 
      applicationId, 
      jobId, 
      workerId 
    }: { 
      applicationId: string, 
      jobId: string, 
      workerId: string 
    }) => {
      console.log(`Accepting application: ${applicationId} for job: ${jobId} and worker: ${workerId}`);
      
      // Update application status to 'accepted'
      const updatedApplication = await updateApplicationStatus(applicationId, 'accepted');
      
      // Get job and employer details
      const job = await getJobById(jobId);
      if (!job) throw new Error('Job not found');
      console.log('Job details for acceptance:', job);
      
      // Get employer name
      const employerName = user?.user_metadata?.name || 'Employer';
      
      // Notify worker using edge function
      try {
        const { error: notifyError } = await supabase.functions.invoke('notify-user', {
          body: {
            userId: workerId,
            message: `Your application for "${job.title}" has been accepted by ${employerName}!`,
            type: 'job_accepted',
            relatedId: jobId,
            sendEmail: true,
            sendSms: true
          }
        });
        
        if (notifyError) {
          console.error('Error sending acceptance notification:', notifyError);
        } else {
          console.log('Worker acceptance notification sent');
        }
      } catch (notifyError) {
        console.error('Error in notification function:', notifyError);
        // Continue even if notification fails
      }
      
      return updatedApplication;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['worker-applications'] });
      toast.success('Worker has been notified of acceptance');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to accept application');
    },
  });

  // Reject an application
  const rejectApplication = useMutation({
    mutationFn: async ({ 
      applicationId, 
      jobId, 
      workerId 
    }: { 
      applicationId: string, 
      jobId: string, 
      workerId: string 
    }) => {
      console.log(`Rejecting application: ${applicationId} for job: ${jobId} and worker: ${workerId}`);
      
      // Update application status to 'rejected'
      const updatedApplication = await updateApplicationStatus(applicationId, 'rejected');
      
      // Get job details
      const job = await getJobById(jobId);
      if (!job) throw new Error('Job not found');
      
      // Get employer name
      const employerName = user?.user_metadata?.name || 'Employer';
      
      // Notify worker about rejection
      try {
        const { error: notifyError } = await supabase.functions.invoke('notify-user', {
          body: {
            userId: workerId,
            message: `Your application for "${job.title}" was not accepted at this time.`,
            type: 'job_rejected',
            relatedId: jobId,
            sendEmail: true
          }
        });
        
        if (notifyError) {
          console.error('Error sending rejection notification:', notifyError);
        } else {
          console.log('Worker rejection notification sent');
        }
      } catch (notifyError) {
        console.error('Error in notification function:', notifyError);
      }
      
      return updatedApplication;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['worker-applications'] });
      toast.success('Application has been rejected');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to reject application');
    },
  });

  // Add markJobCompleted mutation
  const markJobCompleted = useMutation({
    mutationFn: async ({ applicationId }: { applicationId: string }) => {
      console.log(`Marking application as completed: ${applicationId}`);
      
      const updatedApplication = await markApplicationCompleted(applicationId);
      
      // Notify worker about job completion and payment
      if (updatedApplication && updatedApplication.worker_id) {
        try {
          const { error: notifyError } = await supabase.functions.invoke('notify-user', {
            body: {
              userId: updatedApplication.worker_id,
              message: `Your job has been marked as completed and payment is being processed.`,
              type: 'job_completed',
              relatedId: updatedApplication.job_id,
              sendEmail: true
            }
          });
          
          if (notifyError) {
            console.error('Error sending completion notification:', notifyError);
          } else {
            console.log('Worker completion notification sent');
          }
        } catch (notifyError) {
          console.error('Error in notification function:', notifyError);
        }
      }
      
      return updatedApplication;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['worker-applications'] });
      toast.success('Job marked as completed and payment is being processed');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to mark job as completed');
    },
  });

  // Get applications for a job
  const getJobApplications = async (jobId: string) => {
    try {
      console.log(`Fetching applications for job: ${jobId}`);
      return await getApplicationsByJobId(jobId);
    } catch (error) {
      console.error('Error fetching job applications:', error);
      throw error;
    }
  };

  // Get applications by a worker
  const getWorkerApplications = async (workerId: string) => {
    try {
      console.log(`Fetching applications for worker: ${workerId}`);
      return await getApplicationsByWorkerId(workerId);
    } catch (error) {
      console.error('Error fetching worker applications:', error);
      throw error;
    }
  };

  return {
    applyForJob,
    acceptApplication,
    rejectApplication,
    markJobCompleted,
    getJobApplications,
    getWorkerApplications,
    isSubmitting,
  };
};
