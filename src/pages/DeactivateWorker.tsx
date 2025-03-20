
import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useWorkerProfiles } from '@/hooks/useWorkerProfiles';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const DeactivateWorker = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { deactivateWorkerProfile, getWorker } = useWorkerProfiles();
  const [isLoading, setIsLoading] = useState(false);
  const [worker, setWorker] = useState<any>(null);

  React.useEffect(() => {
    if (id) {
      getWorker(id)
        .then(workerData => {
          setWorker(workerData);
          
          // Check if current user owns this worker profile
          if (user?.id !== workerData.user_id) {
            toast.error("You don't have permission to deactivate this profile");
            navigate('/workers');
          }
        })
        .catch(error => {
          console.error('Error fetching worker:', error);
          toast.error('Failed to load worker profile');
          navigate('/workers');
        });
    }
  }, [id, user?.id, navigate, getWorker]);

  const handleDeactivate = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      await deactivateWorkerProfile.mutateAsync(id);
      toast.success('Your profile has been deactivated');
      navigate('/workers');
    } catch (error) {
      console.error('Error deactivating profile:', error);
      toast.error('Failed to deactivate profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (!worker) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-orange-50/40 dark:bg-gray-900 pt-32 pb-16 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-orange-50/40 dark:bg-gray-900 pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              <div className="flex items-center mb-6">
                <Button variant="ghost" className="p-0 mr-4" onClick={() => navigate(-1)}>
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Deactivate Profile</h1>
              </div>
              
              <div className="flex items-center justify-center mb-8">
                <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
              
              <div className="text-center mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Are you sure you want to deactivate your profile?</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Deactivating your profile will make it invisible to clients and you won't receive new job offers.
                  You can reactivate your profile at any time.
                </p>
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800 mb-6">
                  <p className="text-amber-700 dark:text-amber-400 text-sm">
                    Your profile information will be preserved but hidden from the public.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="outline" 
                  className="flex-1" 
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="default" 
                  className="flex-1 bg-amber-600 hover:bg-amber-700"
                  onClick={handleDeactivate}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full"></div>
                      Deactivating...
                    </>
                  ) : (
                    'Deactivate Profile'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DeactivateWorker;
