
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getApplicationsByWorkerId, Application } from '@/services/applicationService';
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
import { CalendarClock, DollarSign, Briefcase, Check, X, Clock, Award, FileText, ExternalLink, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { useJobApplications } from '@/hooks/useJobApplications';
import { useToast } from '@/components/ui/use-toast';

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'applied':
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"><Clock className="h-3 w-3 mr-1" /> Applied</Badge>;
    case 'accepted':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"><Check className="h-3 w-3 mr-1" /> Accepted</Badge>;
    case 'rejected':
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"><X className="h-3 w-3 mr-1" /> Rejected</Badge>;
    case 'completed':
      return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800"><Award className="h-3 w-3 mr-1" /> Completed</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
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
  
  // Only fetch if external applications are not provided
  const { data: fetchedApplications, isLoading: fetchLoading, error: fetchError } = useQuery({
    queryKey: ['worker-applications-component', workerId],
    queryFn: () => {
      console.log('Component is fetching applications for worker ID:', workerId);
      return getApplicationsByWorkerId(workerId);
    },
    enabled: !!workerId && externalApplications === undefined,
  });

  // Use external data if provided, otherwise use fetched data
  const applications = externalApplications || fetchedApplications;
  const isLoading = externalLoading !== undefined ? externalLoading : fetchLoading;
  const error = externalError || fetchError;

  // Log what data is being used
  React.useEffect(() => {
    console.log('WorkerHistory rendering with:');
    console.log('- Using external applications:', externalApplications !== undefined);
    console.log('- Applications count:', applications?.length || 0);
    console.log('- Loading state:', isLoading);
    console.log('- Error state:', !!error);
  }, [applications, externalApplications, isLoading, error]);

  const handleMarkComplete = (applicationId: string) => {
    markJobCompleted.mutate({ applicationId }, {
      onSuccess: () => {
        toast({
          title: "Job marked as completed",
          description: "The job has been marked as completed and payment is being processed.",
        });
      }
    });
  };

  // Show a more detailed loading state
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
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Reload Page
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Improved empty state with more context
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
        <CardContent className="flex justify-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.location.reload()}
            className="mt-2"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh Page
          </Button>
        </CardContent>
      </Card>
    );
  }

  // When applications exist, render them in the table
  return (
    <div className="space-y-6">
      <div className="rounded-md border dark:border-gray-700">
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
