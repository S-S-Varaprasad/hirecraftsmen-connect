
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WorkerHistory from '@/components/workers/WorkerHistory';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { History, ArrowLeft } from 'lucide-react';

const WorkerJobHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

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
          </div>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Job Application History</CardTitle>
              <CardDescription>
                Track all your job applications, their status, and payment details
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user && user.id && (
                <WorkerHistory workerId={user.id} />
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
