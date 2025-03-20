
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { useWorkerProfiles } from '@/hooks/useWorkerProfiles';
import { useAuth } from '@/context/AuthContext';
import { Worker } from '@/services/workerService';
import { toast } from 'sonner';

const DeleteWorker = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getWorker, deleteWorkerProfile } = useWorkerProfiles();
  const [worker, setWorker] = useState<Worker | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [confirmation, setConfirmation] = useState('');

  useEffect(() => {
    const fetchWorker = async () => {
      if (!id) return;
      
      try {
        const workerData = await getWorker(id);
        setWorker(workerData);
        
        // Check if worker belongs to current user
        if (user && workerData.user_id !== user.id) {
          toast.error("You don't have permission to delete this profile");
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

  const handleDelete = async () => {
    if (!worker || !id) return;

    if (confirmation.toLowerCase() !== 'delete') {
      toast.error('Please type "DELETE" to confirm');
      return;
    }

    try {
      setDeleting(true);
      await deleteWorkerProfile.mutateAsync(id);
      toast.success("Your worker profile has been permanently deleted");
      navigate('/');
    } catch (error) {
      console.error("Error deleting worker:", error);
      toast.error("Failed to delete your profile");
    } finally {
      setDeleting(false);
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
          
          <Card className="max-w-md mx-auto border-red-300 dark:border-red-700">
            <CardHeader className="bg-red-50 dark:bg-red-900/20">
              <CardTitle className="text-red-700 dark:text-red-400 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Delete Worker Profile
              </CardTitle>
              <CardDescription className="text-red-600 dark:text-red-400">
                This action cannot be undone
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  Are you sure you want to permanently delete your worker profile? This will:
                </p>
                
                <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
                  <li>Remove all your profile information from our system</li>
                  <li>Delete your job history and ratings</li>
                  <li>Remove you from all current job applications</li>
                  <li>This action cannot be reversed</li>
                </ul>
                
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md text-sm">
                  <p className="font-medium text-red-700 dark:text-red-400">Warning:</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    If you just want to temporarily hide your profile, consider
                    <Link to={`/workers/deactivate/${id}`} className="text-blue-600 dark:text-blue-400 underline ml-1">
                      deactivating it
                    </Link> instead.
                  </p>
                </div>
                
                <div className="mt-6">
                  <Label htmlFor="confirmation" className="text-sm font-medium">
                    To confirm, type "DELETE" below:
                  </Label>
                  <Input
                    id="confirmation"
                    className="mt-1"
                    value={confirmation}
                    onChange={(e) => setConfirmation(e.target.value)}
                    placeholder="Type DELETE to confirm"
                  />
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
                className="w-full sm:w-auto"
                onClick={handleDelete}
                disabled={deleting || confirmation.toLowerCase() !== 'delete'}
              >
                {deleting ? 'Deleting...' : 'Permanently Delete Profile'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DeleteWorker;
