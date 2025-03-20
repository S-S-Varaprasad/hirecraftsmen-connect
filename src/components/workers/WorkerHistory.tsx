
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
import { CalendarClock, DollarSign, Briefcase, Check, X, Clock, Award, ExternalLink, RefreshCw, HelpCircle, CheckCircle2 } from 'lucide-react';
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
import { motion } from 'framer-motion';

const StatusBadge = ({ status }: { status: string }) => {
  const statusDescription = getApplicationStatusDescription(status);
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {status === 'applied' ? (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800 py-1.5 shadow-sm">
              <Clock className="h-3 w-3 mr-1" /> Applied
            </Badge>
          ) : status === 'accepted' ? (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800 py-1.5 shadow-sm">
              <Check className="h-3 w-3 mr-1" /> Accepted
            </Badge>
          ) : status === 'rejected' ? (
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800 py-1.5 shadow-sm">
              <X className="h-3 w-3 mr-1" /> Rejected
            </Badge>
          ) : status === 'completed' ? (
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800 py-1.5 shadow-sm">
              <Award className="h-3 w-3 mr-1" /> Completed
            </Badge>
          ) : (
            <Badge variant="outline">{status}</Badge>
          )}
        </TooltipTrigger>
        <TooltipContent className="max-w-[200px] shadow-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2 rounded-md border border-gray-200 dark:border-gray-700">
          <p className="text-sm">{statusDescription}</p>
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
      <div className="flex flex-col items-center justify-center p-12 space-y-6 bg-white/20 dark:bg-gray-800/20 rounded-xl backdrop-blur-sm border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-t-2 border-b-2 border-primary animate-spin"></div>
          <div className="absolute inset-3 rounded-full border-r-2 border-l-2 border-primary/70 animate-spin animate-reverse"></div>
          <RefreshCw className="absolute inset-0 m-auto w-8 h-8 text-primary/70" />
        </div>
        <p className="text-gray-600 dark:text-gray-300 font-medium">Loading your job applications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 dark:border-red-800 shadow-3d">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400 flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500 dark:text-red-400">
            Error loading application history: {error.message || 'Unknown error'}. Please try again.
          </p>
          <Button 
            variant="outline" 
            className="mt-6 hover-lift"
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
      <Card className="border-gray-200 dark:border-gray-700 shadow-3d glass">
        <CardHeader className="text-center">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <div className="bg-blue-50 dark:bg-blue-900/20 h-28 w-28 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Briefcase className="h-14 w-14 text-blue-500 dark:text-blue-400" />
            </div>
          </motion.div>
          <CardTitle className="text-2xl mb-2">No Job History</CardTitle>
          <CardDescription className="text-base mt-2">
            You haven't applied to any jobs yet or your applications are still processing.
            <Button asChild variant="link" className="p-0 h-auto">
              <a href="/jobs" className="ml-1">Browse available jobs</a>
            </Button>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center pb-10">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 max-w-md text-center">
            When you apply for jobs, they will appear here with their current status and payment information.
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetch()}
            className="mt-2 hover-lift"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh History
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gradient-to-r from-blue-50 to-blue-50/30 dark:from-blue-900/10 dark:to-blue-900/5 p-5 rounded-xl mb-6 border dark:border-gray-700/50 shadow-md">
        <CardContent className="p-0">
          <h3 className="font-medium flex items-center text-gray-700 dark:text-gray-300 mb-4">
            <HelpCircle className="h-5 w-5 mr-2 text-blue-500" />
            <span className="text-lg">Understanding Your Application Status</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <motion.div 
              className="flex items-start space-x-3 hover-lift p-4 bg-white/70 dark:bg-gray-800/50 rounded-lg border border-blue-100 dark:border-blue-900/30 shadow-sm transition-all" 
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mt-0.5">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="font-medium text-blue-700 dark:text-blue-400">Applied</p>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Your application is under review by the employer</p>
              </div>
            </motion.div>
            <motion.div 
              className="flex items-start space-x-3 hover-lift p-4 bg-white/70 dark:bg-gray-800/50 rounded-lg border border-green-100 dark:border-green-900/30 shadow-sm transition-all" 
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full mt-0.5">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="font-medium text-green-700 dark:text-green-400">Accepted</p>
                <p className="text-gray-600 dark:text-gray-400 mt-1">You're hired! You can start working on this job</p>
              </div>
            </motion.div>
            <motion.div 
              className="flex items-start space-x-3 hover-lift p-4 bg-white/70 dark:bg-gray-800/50 rounded-lg border border-red-100 dark:border-red-900/30 shadow-sm transition-all" 
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full mt-0.5">
                <X className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="font-medium text-red-700 dark:text-red-400">Rejected</p>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Your application was not accepted for this position</p>
              </div>
            </motion.div>
            <motion.div 
              className="flex items-start space-x-3 hover-lift p-4 bg-white/70 dark:bg-gray-800/50 rounded-lg border border-purple-100 dark:border-purple-900/30 shadow-sm transition-all" 
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full mt-0.5">
                <Award className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="font-medium text-purple-700 dark:text-purple-400">Completed</p>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Job is finished and payment has been processed</p>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
        
      <Card className="shadow-3d rounded-xl overflow-hidden border dark:border-gray-700/50">
        <div className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-800/80 px-6 py-4 border-b dark:border-gray-700/50 flex justify-between items-center">
          <h3 className="font-bold text-lg text-gray-800 dark:text-white flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            Your Applications
          </h3>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => refetch()}
            className="h-9 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1" />
            Refresh
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableCaption>Job application history and payment details</TableCaption>
            <TableHeader>
              <TableRow className="bg-gray-50/70 dark:bg-gray-800/70 dark:border-gray-700">
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Job Title</TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Employer</TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Applied Date</TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Status</TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Payment</TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((application) => (
                <TableRow key={application.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/60 dark:border-gray-700 transition-colors">
                  <TableCell className="font-medium text-gray-800 dark:text-white">
                    {application.job?.title || 'Unknown Job'}
                  </TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">
                    {application.job?.company || 'Unknown Company'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm text-muted-foreground dark:text-gray-400">
                      <CalendarClock className="h-3.5 w-3.5 mr-1.5" />
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
                          className="h-8 px-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
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
                          className="h-8 px-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
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
      </Card>
    </motion.div>
  );
};

export default WorkerHistory;
