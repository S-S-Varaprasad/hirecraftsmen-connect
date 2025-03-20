
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { applyToJob, getApplicationsByWorkerId, getApplicationsByJobId, updateApplicationStatus } from '@/services/applicationService';
import { getJobById } from '@/services/jobService';
import { 
  createWorkerApplicationNotification, 
  createJobAcceptedNotification, 
  createNotification,
  notifyEmployerAboutApplication
} from '@/services/notificationService';
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
            await notifyEmployerAboutApplication(
              job.employer_id,
              workerId,
              worker.name,
              jobId,
              job.title,
              true // Send email notification
            );
            console.log('Employer notification sent successfully');
          } catch (notifyError) {
            console.error('Error sending employer notification:', notifyError);
            // Continue even if notification fails
          }
        } else {
          console.log('No employer_id found for job, skipping notification');
        }
        
        // Create notification for the worker too
        if (user?.id) {
          try {
            await createNotification(
              user.id,
              `You have successfully applied to the job: ${job.title}`,
              'job_application',
              jobId
            );
            console.log('Worker application notification created');
          } catch (workerNotifyError) {
            console.error('Error creating worker notification:', workerNotifyError);
          }
        }
        
        return application;
      } finally {
        setIsSubmitting(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
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
      const { data, error } = await supabase
        .from('applications')
        .update({ status: 'accepted' })
        .eq('id', applicationId)
        .select();
        
      if (error) {
        console.error('Error updating application status:', error);
        throw error;
      }
      
      // Get job and employer details
      const job = await getJobById(jobId);
      if (!job) throw new Error('Job not found');
      console.log('Job details for acceptance:', job);
      
      // Get employer name (this is placeholder logic - adjust based on your user data structure)
      const employerName = user?.user_metadata?.name || 'Employer';
      
      // Notify worker
      try {
        await createJobAcceptedNotification(
          workerId,
          employerName,
          jobId,
          job.title
        );
        console.log('Worker acceptance notification sent');
      } catch (notifyError) {
        console.error('Error sending acceptance notification:', notifyError);
        // Continue even if notification fails
      }
      
      return data?.[0] || { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast.success('Worker has been notified of acceptance');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to accept application');
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
    getJobApplications,
    getWorkerApplications,
    isSubmitting,
  };
};
