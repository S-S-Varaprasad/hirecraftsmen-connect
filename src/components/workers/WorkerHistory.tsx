
import React from 'react';
import { useParams } from 'react-router-dom';
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
import { CalendarClock, DollarSign, Briefcase, Check, X, Clock, Award } from 'lucide-react';

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'applied':
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200"><Clock className="h-3 w-3 mr-1" /> Applied</Badge>;
    case 'accepted':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><Check className="h-3 w-3 mr-1" /> Accepted</Badge>;
    case 'rejected':
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><X className="h-3 w-3 mr-1" /> Rejected</Badge>;
    case 'completed':
      return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200"><Award className="h-3 w-3 mr-1" /> Completed</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const WorkerHistory = ({ workerId }: { workerId: string }) => {
  const { data: applications, isLoading, error } = useQuery({
    queryKey: ['worker-applications', workerId],
    queryFn: () => getApplicationsByWorkerId(workerId),
    enabled: !!workerId,
  });

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <div className="h-8 w-1/3 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-64 bg-gray-100 animate-pulse rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error loading application history. Please try again.
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <Briefcase className="h-12 w-12 mx-auto text-gray-300 mb-2" />
        <p>No job application history found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-md border">
        <Table>
          <TableCaption>Job application history and payment details</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Job Title</TableHead>
              <TableHead>Employer</TableHead>
              <TableHead>Applied Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((application) => (
              <TableRow key={application.id}>
                <TableCell className="font-medium">
                  {application.job?.title || 'Unknown Job'}
                </TableCell>
                <TableCell>
                  {application.job?.company || 'Unknown Company'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm text-muted-foreground">
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
                  {application.status === 'completed' ? (
                    <div className="flex items-center text-green-600">
                      <DollarSign className="h-3 w-3 mr-1" />
                      {application.job?.rate || 'Rate not specified'}
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">
                      {application.status === 'accepted' ? 'Pending completion' : 'Not applicable'}
                    </span>
                  )}
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
