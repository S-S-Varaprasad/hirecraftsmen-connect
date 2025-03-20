
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WorkerHistory from '@/components/workers/WorkerHistory';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { History, ArrowLeft, RefreshCw } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from '@tanstack/react-query';
import { getApplicationsByWorkerId } from '@/services/applicationService';
import { getWorkerByUserId } from '@/services/workerService';
import { toast } from 'sonner';

const WorkerJobHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Debug information about current user
  useEffect(() => {
    if (user) {
      console.log('Current authenticated user:', user.id);
    } else {
      console.log('No authenticated user found');
    }
  }, [user]);
  
  // First query to get the worker profile associated with the user
  const { 
    data: workerProfile,
    isLoading: isLoadingWorker,
    error: workerError
  } = useQuery({
    queryKey: ['worker-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log('No user ID available for fetching worker profile');
        return null;
      }
      
      console.log('Fetching worker profile for user ID:', user.id);
      try {
        const worker = await getWorkerByUserId(user.id);
        console.log('Worker profile found:', worker);
        return worker;
      } catch (err) {
        console.error('Error fetching worker profile:', err);
        throw err;
      }
    },
    enabled: !!user?.id,
    retry: 2
  });
  
  // Then query to get the applications using the worker ID from the profile
  const { 
    data: applications, 
    isLoading: isLoadingApplications, 
    error: applicationsError, 
    refetch,
    isRefetching 
  } = useQuery({
    queryKey: ['worker-applications', workerProfile?.id],
    queryFn: () => {
      if (!workerProfile?.id) {
        console.log('No worker ID available for fetching applications');
        return Promise.resolve([]);
      }
      
      console.log('Fetching applications for worker ID:', workerProfile.id);
      return getApplicationsByWorkerId(workerProfile.id);
    },
    enabled: !!workerProfile?.id,
    staleTime: 0, // Always consider data stale to force refresh
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: 15000, // Refresh every 15 seconds
    retry: 3,
  });

  // Force refetch on mount to ensure we have the latest data
  useEffect(() => {
    if (workerProfile?.id) {
      console.log('Forcing refetch of job applications on page mount for worker:', workerProfile.id);
      refetch();
    }
  }, [workerProfile?.id, refetch]);

  // Redirect if no user is logged in
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col dark:bg-gray-900">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center">Access Denied</CardTitle>
              <CardDescription className="text-center">
                Please log in to view your job history.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button onClick={() => navigate('/login')}>Log In</Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const handleRefresh = () => {
    refetch();
    toast.success("Job history refreshed");
  };

  // Log applications for debugging
  useEffect(() => {
    if (applications) {
      console.log('Applications data loaded:', applications.length, 'applications');
      if (applications.length === 0) {
        console.log('No applications found for this worker');
      } else {
        console.log('First application:', applications[0]);
      }
    }
  }, [applications]);

  const filteredApplications = applications?.filter(app => {
    if (statusFilter === "all") return true;
    return app.status === statusFilter;
  });

  const isLoading = isLoadingWorker || isLoadingApplications;
  const error = workerError || applicationsError;

  if (isLoading && !applications) {
    return (
      <div className="min-h-screen flex flex-col dark:bg-gray-900">
        <Navbar />
        <main className="flex-grow bg-orange-50/40 dark:bg-gray-900 pt-24 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col dark:bg-gray-900">
        <Navbar />
        <main className="flex-grow bg-orange-50/40 dark:bg-gray-900 pt-24">
          <div className="container mx-auto px-4 py-8">
            <Card className="border-red-200 dark:border-red-800">
              <CardHeader>
                <CardTitle className="text-red-600 dark:text-red-400">Error</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-500 dark:text-red-400">
                  Error loading application history: {(error as Error).message || 'Unknown error'}
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={handleRefresh}
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Retry
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-grow bg-orange-50/40 dark:bg-gray-900 pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                className="mr-2"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <h1 className="text-2xl font-bold flex items-center">
                <History className="h-6 w-6 mr-2 text-primary" />
                My Job History
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <span className="text-sm mr-2">Status:</span>
                <Select 
                  value={statusFilter} 
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="applied">Applied</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={isRefetching}
                className="flex items-center"
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${isRefetching ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Job Application History</CardTitle>
              <CardDescription>
                Track all your job applications, their status, and payment details
              </CardDescription>
              {workerProfile && (
                <p className="text-sm text-muted-foreground mt-2">
                  Showing applications for worker profile: {workerProfile.name} (ID: {workerProfile.id})
                </p>
              )}
            </CardHeader>
            <CardContent>
              {workerProfile ? (
                <WorkerHistory 
                  workerId={workerProfile.id} 
                  applications={filteredApplications} 
                  isLoading={isLoading || isRefetching}
                  error={error as Error}
                />
              ) : (
                <Card className="border-yellow-200 dark:border-yellow-800 my-4">
                  <CardContent className="pt-6">
                    <p className="text-yellow-600 dark:text-yellow-400 text-center">
                      You need to create a worker profile before you can apply for jobs.
                    </p>
                    <div className="flex justify-center mt-4">
                      <Button onClick={() => navigate('/join-as-worker')}>
                        Create Worker Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default WorkerJobHistory;
