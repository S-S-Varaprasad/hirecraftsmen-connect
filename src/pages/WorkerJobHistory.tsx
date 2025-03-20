
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WorkerHistory from '@/components/workers/WorkerHistory';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { getWorkerByUserId } from '@/services/workerService';
import { useQueryRefresh } from '@/hooks/useQueryRefresh';
import { AlertTriangle, FileQuestion, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const WorkerJobHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [workerId, setWorkerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Set up real-time updates for applications table
  useQueryRefresh(
    ['applications', 'jobs'],
    [['worker-applications'], ['jobs']]
  );

  useEffect(() => {
    const checkWorkerProfile = async () => {
      if (!user) {
        setError("You must be logged in to view your job history");
        setLoading(false);
        return;
      }

      try {
        const worker = await getWorkerByUserId(user.id);
        
        if (worker) {
          console.log("Worker profile found:", worker.id);
          setWorkerId(worker.id);
        } else {
          console.log("No worker profile found for user:", user.id);
          setError("You need to create a worker profile first");
        }
      } catch (err) {
        console.error("Error checking worker profile:", err);
        setError("Error loading worker profile");
      } finally {
        setLoading(false);
      }
    };

    checkWorkerProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-gradient-to-b from-orange-50/40 to-white dark:from-gray-900 dark:to-gray-800 pt-24 flex justify-center items-center">
          <motion.div 
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-t-2 border-b-2 border-primary animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-r-2 border-l-2 border-primary animate-spin animate-reverse"></div>
              <Briefcase className="absolute inset-0 m-auto w-8 h-8 text-primary/70" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 animate-pulse">Loading your job history...</p>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-orange-50/40 to-white dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <div className="max-w-4xl mx-auto">
          {error ? (
            <Card className="border-red-200 dark:border-red-800 backdrop-blur-sm bg-white/90 dark:bg-gray-800/90">
              <CardHeader>
                <div className="flex items-center justify-center mb-4">
                  {error.includes("logged in") ? (
                    <AlertTriangle className="h-12 w-12 text-red-500" />
                  ) : (
                    <FileQuestion className="h-12 w-12 text-amber-500" />
                  )}
                </div>
                <CardTitle className="text-center">{error.includes("logged in") ? "Authentication Required" : "Worker Profile Required"}</CardTitle>
                <CardDescription className="text-center">
                  {error.includes("logged in") ? 
                    "You need to be logged in to view your job history" : 
                    "You need to create a worker profile before you can apply to jobs"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Button 
                  className="mr-2"
                  onClick={() => navigate(error.includes("logged in") ? "/login" : "/join-as-worker")}
                >
                  {error.includes("logged in") ? "Log In" : "Create Worker Profile"}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate("/")}
                >
                  Go to Home
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <motion.div 
                className="mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-3xl font-bold">Your Job History</h1>
                <p className="text-muted-foreground">Track all your job applications and their current status</p>
              </motion.div>
              
              {workerId && <WorkerHistory workerId={workerId} />}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WorkerJobHistory;
