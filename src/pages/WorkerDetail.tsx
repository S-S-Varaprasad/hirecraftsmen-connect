
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, MapPin, Phone, Mail, Clock, Star, DollarSign, Award, 
  MessageSquare, ArrowLeft, Share, Flag, Calendar, Languages, 
  Hammer, MessageCircle 
} from 'lucide-react';
import { useWorkerProfiles } from '@/hooks/useWorkerProfiles';
import { getWorkerById, Worker } from '@/services/workerService';
import { toast } from 'sonner';

const WorkerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [worker, setWorker] = useState<Worker | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchWorkerDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const workerData = await getWorkerById(id);
        setWorker(workerData);
      } catch (error) {
        console.error('Error fetching worker details:', error);
        toast.error('Failed to load worker profile');
      } finally {
        setLoading(false);
      }
    };
    
    fetchWorkerDetails();
  }, [id]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-app-orange"></div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!worker) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-4">Worker Not Found</h2>
          <p className="mb-8 text-gray-600">The worker profile you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/workers')}>Browse All Workers</Button>
        </div>
        <Footer />
      </div>
    );
  }
  
  const renderRatingStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
          />
        ))}
        <span className="ml-2 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-16">
        <div className="container mx-auto px-4">
          <Button 
            variant="ghost" 
            className="mb-6" 
            onClick={() => navigate('/workers')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Workers
          </Button>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Details */}
            <Card className="lg:col-span-2">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-app-orange to-app-orange/80 text-white p-6 rounded-t-lg">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    <div className="shrink-0">
                      <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center overflow-hidden border-4 border-white">
                        {worker.image_url ? (
                          <img 
                            src={worker.image_url} 
                            alt={worker.name} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <User className="h-16 w-16 text-gray-400" />
                        )}
                      </div>
                    </div>
                    <div className="text-center md:text-left">
                      <h1 className="text-2xl font-bold">{worker.name}</h1>
                      <p className="text-lg opacity-90">{worker.profession}</p>
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2">
                        <div className="flex items-center">
                          <MapPin className="mr-1 h-4 w-4" />
                          <span className="text-sm">{worker.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="mr-1 h-4 w-4" />
                          <span className="text-sm">{worker.experience}</span>
                        </div>
                      </div>
                      <div className="mt-3">
                        {renderRatingStars(worker.rating)}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <div className="flex items-center px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full">
                      <DollarSign className="h-4 w-4 text-app-orange mr-1" />
                      <span className="text-sm font-medium">{worker.hourly_rate}</span>
                    </div>
                    <Badge variant="outline" className="px-3 py-1.5 rounded-full">
                      {worker.is_available ? 'Available for Work' : 'Currently Unavailable'}
                    </Badge>
                    <div className="flex items-center px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full">
                      <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-sm">Joined {new Date(worker.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">About</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                      {worker.about || 'No information provided.'}
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2 flex items-center">
                      <Hammer className="h-5 w-5 mr-2 text-app-orange" />
                      Skills
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {worker.skills.map((skill, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2 flex items-center">
                      <Languages className="h-5 w-5 mr-2 text-app-orange" />
                      Languages
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {worker.languages && worker.languages.length > 0 ? (
                        worker.languages.map((language, index) => (
                          <Badge 
                            key={index} 
                            variant="outline" 
                            className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                          >
                            {language}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-gray-500">No languages specified</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      className="bg-app-orange hover:bg-app-orange/90"
                      onClick={() => navigate(`/message-worker/${worker.id}`)}
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Message
                    </Button>
                    
                    <Button 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => navigate(`/hire-now/${worker.id}`)}
                    >
                      Hire Now
                    </Button>
                    
                    <Button variant="outline">
                      <Share className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                    
                    <Button variant="outline" className="text-red-600">
                      <Flag className="mr-2 h-4 w-4" />
                      Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Contact & Similar Workers */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 text-app-orange mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-gray-600 dark:text-gray-400">Contact through the platform</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 text-app-orange mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Phone</p>
                        <p className="text-gray-600 dark:text-gray-400">Available after hiring</p>
                      </div>
                    </div>
                    <Button 
                      className="w-full mt-4"
                      onClick={() => navigate(`/message-worker/${worker.id}`)}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Looking for work?</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Join our platform as a worker and connect with clients looking for your skills.
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/join-as-worker')}
                  >
                    Register as a Worker
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default WorkerDetail;
