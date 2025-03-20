
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getApplicationsByWorkerId } from '@/services/applicationService';
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
import { CalendarClock, DollarSign, Briefcase, Check, X, Clock, Award, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { useJobApplications } from '@/hooks/useJobApplications';

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

const WorkerHistory = ({ workerId }: { workerId: string }) => {
  const { markJobCompleted } = useJobApplications();
  
  const { data: applications, isLoading, error } = useQuery({
    queryKey: ['worker-applications', workerId],
    queryFn: () => getApplicationsByWorkerId(workerId),
    enabled: !!workerId,
  });

  const handleMarkComplete = (applicationId: string) => {
    markJobCompleted.mutate({ applicationId });
  };

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <div className="h-8 w-1/3 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
        <div className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded"></div>
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
            Error loading application history. Please try again.
          </p>
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
          <CardDescription>You haven't applied to any jobs yet.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

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
                        <FileText className="h-3 w-3 mr-1" />
                        Details
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
