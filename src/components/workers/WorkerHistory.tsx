import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  getApplicationsByWorkerId, 
  Application, 
  getApplicationStatusDescription
} from '@/services/applicationService';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { formatDistanceToNow } from 'date-fns';
import { CalendarClock, DollarSign, Briefcase, Check, X, Clock, Award, FileText, ExternalLink, RefreshCw, HelpCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { useJobApplications } from '@/hooks/useJobApplications';
import { useToast } from '@/hooks/use-toast';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const StatusBadge = ({ status }: { status: string }) => {
  const statusDescription = getApplicationStatusDescription(status);
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {status === 'applied' ? (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
              <Clock className="h-3 w-3 mr-1" /> Applied
            </Badge>
          ) : status === 'accepted' ? (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800">
              <Check className="h-3 w-3 mr-1" /> Accepted
            </Badge>
          ) : status === 'rejected' ? (
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800">
              <X className="h-3 w-3 mr-1" /> Rejected
            </Badge>
          ) : status === 'completed' ? (
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800">
              <Award className="h-3 w-3 mr-1" /> Completed
            </Badge>
          ) : (
            <Badge variant="outline">{status}</Badge>
          )}
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">{statusDescription}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const PaymentStatus = ({ status, rate }: { status: string, rate: string | undefined }) => {
  if (status === 'completed') {
    return (
      <div className="flex items-center text-green-600 dark:text-green-400">
        <DollarSign className="h-3 w-3 mr-1" />
        <span>{rate || 'Rate not specified'}</span>
        <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800">Paid</Badge>
      </div>
    );
  } else if (status === 'accepted') {
    return (
      <div className="flex items-center text-amber-600 dark:text-amber-400">
        <DollarSign className="h-3 w-3 mr-1" />
        <span>{rate || 'Rate not specified'}</span>
        <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800">Pending</Badge>
      </div>
    );
  } else {
    return (
      <span className="text-gray-400 text-sm dark:text-gray-500">
        {status === 'rejected' ? 'Not applicable' : 'Awaiting acceptance'}
      </span>
    );
  }
};

interface WorkerHistoryProps {
  workerId: string;
  applications?: Application[];
  isLoading?: boolean;
  error?: Error;
}

const WorkerHistory = ({ 
  workerId, 
  applications: externalApplications,
  isLoading: externalLoading,
  error: externalError
}: WorkerHistoryProps) => {
  const { markJobCompleted } = useJobApplications();
  const { toast } = useToast();
  
  const { data: fetchedApplications, isLoading: fetchLoading, error: fetchError, refetch } = useQuery({
    queryKey: ['worker-applications-component', workerId],
    queryFn: () => {
      console.log('Component is fetching applications for worker ID:', workerId);
      return getApplicationsByWorkerId(workerId);
    },
    enabled: !!workerId && externalApplications === undefined,
    staleTime: 0,
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: 1000,
  });

  const applications = externalApplications || fetchedApplications;
  const isLoading = externalLoading !== undefined ? externalLoading : fetchLoading;
  const error = externalError || fetchError;

  useEffect(() => {
    console.log('WorkerHistory rendering with:');
    console.log('- Using external applications:', externalApplications !== undefined);
    console.log('- Applications count:', applications?.length || 0);
    console.log('- Loading state:', isLoading);
    console.log('- Error state:', !!error);
    console.log('- Worker ID:', workerId);
    
    if (workerId) {
      console.log('Forcing refetch of applications on component mount');
      refetch();
    } else {
      console.error('No worker ID provided to WorkerHistory component');
    }
  }, [workerId, externalApplications, refetch]);

  useEffect(() => {
    if (applications?.length) {
      console.log(`Received ${applications.length} applications:`, applications.map(a => ({
        id: a.id,
        job_title: a.job?.title,
        status: a.status,
        created_at: a.created_at
      })));
    }
  }, [applications]);

  const handleMarkComplete = (applicationId: string) => {
    markJobCompleted.mutate({ applicationId }, {
      onSuccess: () => {
        toast({
          title: "Job marked as completed",
          description: "The job has been marked as completed and payment is being processed.",
        });
        refetch();
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <div className="animate-spin">
          <RefreshCw className="h-8 w-8 text-primary" />
        </div>
        <p className="text-muted-foreground">Loading your job applications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500 dark:text-red-400">
            Error loading application history: {error.message || 'Unknown error'}. Please try again.
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => refetch()}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <Card className="border-gray-200 dark:border-gray-700">
        <CardHeader className="text-center">
          <Briefcase className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
          <CardTitle>No Job History</CardTitle>
          <CardDescription>
            You haven't applied to any jobs yet or your applications are still processing.
            <Button asChild variant="link" className="p-0 h-auto">
              <a href="/jobs" className="ml-1">Browse available jobs</a>
            </Button>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 max-w-md text-center">
            When you apply for jobs, they will appear here with their current status and payment information.
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetch()}
            className="mt-2"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh History
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg mb-4 border dark:border-gray-700">
        <h3 className="font-medium flex items-center text-gray-700 dark:text-gray-300 mb-2">
          <HelpCircle className="h-4 w-4 mr-2 text-blue-500" />
          Understanding Application Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start space-x-2">
            <Clock className="h-4 w-4 text-blue-500 mt-0.5" />
            <div>
              <p className="font-medium text-blue-700 dark:text-blue-400">Applied</p>
              <p className="text-gray-600 dark:text-gray-400">Your application is under review by the employer</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <Check className="h-4 w-4 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium text-green-700 dark:text-green-400">Accepted</p>
              <p className="text-gray-600 dark:text-gray-400">You're hired! You can start working on this job</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <X className="h-4 w-4 text-red-500 mt-0.5" />
            <div>
              <p className="font-medium text-red-700 dark:text-red-400">Rejected</p>
              <p className="text-gray-600 dark:text-gray-400">Your application was not accepted for this position</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <Award className="h-4 w-4 text-purple-500 mt-0.5" />
            <div>
              <p className="font-medium text-purple-700 dark:text-purple-400">Completed</p>
              <p className="text-gray-600 dark:text-gray-400">Job is finished and payment has been processed</p>
            </div>
          </div>
        </div>
      </div>
        
      <div className="rounded-md border dark:border-gray-700">
        <div className="flex justify-between items-center p-4 pb-2">
          <h3 className="font-semibold">Your Applications</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => refetch()}
            className="h-8"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Refresh
          </Button>
        </div>
        <Table>
          <TableCaption>Job application history and payment details</TableCaption>
          <TableHeader>
            <TableRow className="dark:border-gray-700">
              <TableHead className="dark:text-gray-400">Job Title</TableHead>
              <TableHead className="dark:text-gray-400">Employer</TableHead>
              <TableHead className="dark:text-gray-400">Applied Date</TableHead>
              <TableHead className="dark:text-gray-400">Status</TableHead>
              <TableHead className="dark:text-gray-400">Payment</TableHead>
              <TableHead className="dark:text-gray-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((application) => (
              <TableRow key={application.id} className="dark:border-gray-700">
                <TableCell className="font-medium dark:text-white">
                  {application.job?.title || 'Unknown Job'}
                </TableCell>
                <TableCell className="dark:text-gray-300">
                  {application.job?.company || 'Unknown Company'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm text-muted-foreground dark:text-gray-400">
                    <CalendarClock className="h-3 w-3 mr-1" />
                    {application.created_at 
                      ? formatDistanceToNow(new Date(application.created_at), { addSuffix: true })
                      : 'Unknown date'}
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={application.status} />
                </TableCell>
                <TableCell>
                  <PaymentStatus status={application.status} rate={application.job?.rate} />
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {application.job && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2 text-blue-600 dark:text-blue-400"
                        onClick={() => window.open(`/jobs/${application.job?.id}`, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View Job
                      </Button>
                    )}
                    
                    {application.status === 'accepted' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-green-600 dark:text-green-400"
                        onClick={() => handleMarkComplete(application.id)}
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Mark Completed
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default WorkerHistory;
