import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { getJobById } from '@/services/jobService';
import { getWorkerByUserId } from '@/services/workerService';
import { applyForJob, checkApplicationExists } from '@/services/applicationService';
import { useAuth } from '@/context/AuthContext';
import { Tables } from '@/integrations/supabase/types';

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
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [existingApplication, setExistingApplication] = useState<Application | null>(null);

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
        const { data: workerData, error: workerError } = await getWorkerByUserId(user?.id);

        if (workerError || !workerData) {
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

    try {
      // Apply for the job
      await applyForJob(jobId, worker.id, applicationMessage);
      toast.success('Application submitted successfully!');
      navigate('/profile');
    } catch (err: any) {
      console.error('Error applying for job:', err);
      toast.error(`Error: ${err.message}`);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!job || !worker) {
    return <div>Error: Job or worker data not found.</div>;
  }

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Apply for {job.title}</h1>
      {alreadyApplied && existingApplication ? (
        <div className="mb-4">
          <p>You have already applied for this job.</p>
          <p>Status: {existingApplication.status}</p>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <label htmlFor="applicationMessage" className="block text-sm font-medium text-gray-700">
              Application Message
            </label>
            <Textarea
              id="applicationMessage"
              rows={4}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Write a message to the employer..."
              value={applicationMessage}
              onChange={(e) => setApplicationMessage(e.target.value)}
            />
          </div>
          <Button onClick={handleApply} className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Apply Now
          </Button>
        </>
      )}
    </div>
  );
};

export default ApplyNow;
