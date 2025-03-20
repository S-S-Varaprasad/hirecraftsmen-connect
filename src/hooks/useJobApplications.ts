
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { applyToJob, getApplicationsByWorkerId, getApplicationsByJobId } from '@/services/applicationService';
import { getJobById } from '@/services/jobService';
import { createWorkerApplicationNotification, createJobAcceptedNotification, createNotification } from '@/services/notificationService';
import { getWorkerById } from '@/services/workerService';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

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
      try {
        // Get job details
        const job = await getJobById(jobId);
        if (!job) throw new Error('Job not found');
        
        // Get worker details
        const worker = await getWorkerById(workerId);
        if (!worker) throw new Error('Worker profile not found');
        
        // Submit application
        const application = await applyToJob(jobId, workerId, message);
        
        // Notify the employer about the application
        if (job.employer_id) {
          await createWorkerApplicationNotification(
            job.employer_id,
            workerId,
            worker.name,
            jobId,
            job.title
          );
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
      // Update application status to 'accepted'
      // This part would connect to your applicationService
      
      // Get job and employer details
      const job = await getJobById(jobId);
      if (!job) throw new Error('Job not found');
      
      // Get employer name (this is placeholder logic - adjust based on your user data structure)
      const employerName = user?.user_metadata?.name || 'Employer';
      
      // Notify worker
      await createJobAcceptedNotification(
        workerId,
        employerName,
        jobId,
        job.title
      );
      
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast.success('Worker has been notified of acceptance');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to accept application');
    },
  });

  return {
    applyForJob,
    acceptApplication,
    isSubmitting,
  };
};
