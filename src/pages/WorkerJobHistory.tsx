
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
import { AlertTriangle, FileQuestion, Briefcase, ClipboardCheck } from 'lucide-react';
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
        <main className="flex-grow bg-gradient-to-b from-orange-50/40 via-orange-50/20 to-white dark:from-gray-900 dark:via-gray-900/90 dark:to-gray-800 pt-24 flex justify-center items-center">
          <motion.div 
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-t-2 border-b-2 border-primary animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-r-2 border-l-2 border-primary/70 animate-spin animate-reverse"></div>
              <ClipboardCheck className="absolute inset-0 m-auto w-8 h-8 text-primary/70" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 animate-pulse font-medium">Loading your job history...</p>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-orange-50/40 via-orange-50/20 to-white dark:from-gray-900 dark:via-gray-900/90 dark:to-gray-800">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12 mt-16">
        <div className="max-w-4xl mx-auto">
          {error ? (
            <Card className="glass shadow-3d overflow-hidden border-red-200 dark:border-red-800/40">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-center mb-6">
                  {error.includes("logged in") ? (
                    <div className="bg-red-100 dark:bg-red-500/20 p-4 rounded-full">
                      <AlertTriangle className="h-12 w-12 text-red-500 dark:text-red-400" />
                    </div>
                  ) : (
                    <div className="bg-amber-100 dark:bg-amber-500/20 p-4 rounded-full">
                      <FileQuestion className="h-12 w-12 text-amber-500 dark:text-amber-400" />
                    </div>
                  )}
                </div>
                <CardTitle className="text-center text-2xl">{error.includes("logged in") ? "Authentication Required" : "Worker Profile Required"}</CardTitle>
                <CardDescription className="text-center text-base">
                  {error.includes("logged in") ? 
                    "You need to be logged in to view your job history" : 
                    "You need to create a worker profile before you can apply to jobs"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center gap-3 pt-2 pb-6">
                <Button 
                  className="bg-gradient-to-r from-primary to-blue-500 hover:opacity-90 transition-opacity"
                  onClick={() => navigate(error.includes("logged in") ? "/login" : "/join-as-worker")}
                >
                  {error.includes("logged in") ? "Log In" : "Create Worker Profile"}
                </Button>
                <Button 
                  variant="outline"
                  className="hover-lift"
                  onClick={() => navigate("/")}
                >
                  Go to Home
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <motion.div 
                className="mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                  <div>
                    <h1 className="text-3xl font-bold gradient-text bg-gradient-to-r from-primary via-blue-500 to-indigo-600">Your Job History</h1>
                    <p className="text-muted-foreground mt-1">Track all your job applications and their current status</p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <Button 
                      variant="outline" 
                      className="hover-lift shadow-sm"
                      onClick={() => navigate("/jobs")}
                    >
                      <Briefcase className="h-4 w-4 mr-2" />
                      Browse Jobs
                    </Button>
                  </div>
                </div>
                
                <div className="h-1 w-32 bg-gradient-to-r from-primary to-blue-500 rounded-full my-1"></div>
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
