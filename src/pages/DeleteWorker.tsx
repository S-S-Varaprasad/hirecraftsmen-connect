
import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, Trash2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWorkerProfiles } from '@/hooks/useWorkerProfiles';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const DeleteWorker = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { deleteWorkerProfile, getWorker } = useWorkerProfiles();
  const [isLoading, setIsLoading] = useState(false);
  const [worker, setWorker] = useState<any>(null);
  const [confirmText, setConfirmText] = useState('');

  React.useEffect(() => {
    if (id) {
      getWorker(id)
        .then(workerData => {
          setWorker(workerData);
          
          // Check if current user owns this worker profile
          if (user?.id !== workerData.user_id) {
            toast.error("You don't have permission to delete this profile");
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

  const handleDelete = async () => {
    if (!id) return;
    
    if (confirmText.toLowerCase() !== 'delete') {
      toast.error('Please type "delete" to confirm');
      return;
    }
    
    setIsLoading(true);
    try {
      await deleteWorkerProfile.mutateAsync(id);
      toast.success('Your profile has been permanently deleted');
      navigate('/');
    } catch (error) {
      console.error('Error deleting profile:', error);
      toast.error('Failed to delete profile');
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
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Delete Profile</h1>
              </div>
              
              <div className="flex items-center justify-center mb-8">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <Trash2 className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
              </div>
              
              <div className="text-center mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Are you sure you want to delete your profile?</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  This action is <span className="font-bold">permanent</span> and cannot be undone. All your profile information, 
                  reviews, and job history will be permanently removed.
                </p>
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800 mb-6">
                  <p className="text-red-700 dark:text-red-400 text-sm">
                    Instead of deleting, you can temporarily deactivate your profile if you want to take a break.
                  </p>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Type "delete" to confirm
                  </label>
                  <Input
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    className="max-w-xs mx-auto text-center"
                    placeholder="delete"
                  />
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
                  variant="destructive" 
                  className="flex-1"
                  onClick={handleDelete}
                  disabled={isLoading || confirmText.toLowerCase() !== 'delete'}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full"></div>
                      Deleting...
                    </>
                  ) : (
                    'Permanently Delete'
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

export default DeleteWorker;
