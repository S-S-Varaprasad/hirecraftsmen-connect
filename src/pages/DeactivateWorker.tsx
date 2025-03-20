
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { useWorkerProfiles } from '@/hooks/useWorkerProfiles';
import { useAuth } from '@/context/AuthContext';
import { Worker } from '@/services/workerService';
import { toast } from 'sonner';

const DeactivateWorker = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getWorker, deactivateWorkerProfile } = useWorkerProfiles();
  const [worker, setWorker] = useState<Worker | null>(null);
  const [loading, setLoading] = useState(true);
  const [deactivating, setDeactivating] = useState(false);

  useEffect(() => {
    const fetchWorker = async () => {
      if (!id) return;
      
      try {
        const workerData = await getWorker(id);
        setWorker(workerData);
        
        // Check if worker belongs to current user
        if (user && workerData.user_id !== user.id) {
          toast.error("You don't have permission to deactivate this profile");
          navigate('/profile');
        }
      } catch (error) {
        console.error("Error fetching worker:", error);
        toast.error("Failed to load worker profile");
        navigate('/profile');
      } finally {
        setLoading(false);
      }
    };

    if (!user) {
      navigate('/login');
      return;
    }

    fetchWorker();
  }, [id, user, navigate, getWorker]);

  const handleDeactivate = async () => {
    if (!worker || !id) return;

    try {
      setDeactivating(true);
      await deactivateWorkerProfile.mutateAsync(id);
      toast.success("Your worker profile has been deactivated");
      navigate('/profile');
    } catch (error) {
      console.error("Error deactivating worker:", error);
      toast.error("Failed to deactivate your profile");
    } finally {
      setDeactivating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-32 pb-16 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-16">
        <div className="container mx-auto px-4">
          <Button 
            variant="ghost" 
            className="mb-6" 
            onClick={() => navigate('/profile')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Profile
          </Button>
          
          <Card className="max-w-md mx-auto border-yellow-300 dark:border-yellow-700">
            <CardHeader className="bg-yellow-50 dark:bg-yellow-900/20">
              <CardTitle className="text-yellow-700 dark:text-yellow-400 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Deactivate Worker Profile
              </CardTitle>
              <CardDescription>
                Your profile will be hidden from job searches
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  Are you sure you want to deactivate your worker profile? While deactivated:
                </p>
                
                <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
                  <li>Your profile will not appear in search results</li>
                  <li>Employers won't be able to contact you for jobs</li>
                  <li>You can reactivate your profile at any time from your account settings</li>
                  <li>Your profile information will be preserved</li>
                </ul>
                
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md text-sm">
                  <p className="font-medium text-yellow-700 dark:text-yellow-400">Note:</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    This is not permanent. If you want to permanently delete your profile,
                    please use the <Link to={`/workers/delete/${id}`} className="text-blue-600 dark:text-blue-400 underline">delete option</Link> instead.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                className="w-full sm:w-auto" 
                onClick={() => navigate('/profile')}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                className="w-full sm:w-auto bg-yellow-600 hover:bg-yellow-700"
                onClick={handleDeactivate}
                disabled={deactivating}
              >
                {deactivating ? 'Deactivating...' : 'Deactivate Profile'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DeactivateWorker;
