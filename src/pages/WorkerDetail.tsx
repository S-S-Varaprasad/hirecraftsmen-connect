
import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getWorkerById } from '@/services/workerService';
import { useQuery } from '@tanstack/react-query';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Briefcase, MapPin, Mail, Phone, Star } from 'lucide-react';
import LoadingState from '@/components/workers/LoadingState';
import ErrorState from '@/components/workers/ErrorState';

const WorkerDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: worker, isLoading, error } = useQuery({
    queryKey: ['worker', id],
    queryFn: () => getWorkerById(id as string),
    enabled: !!id,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-orange-50/40 dark:bg-gray-900 pt-24">
        <div className="container mx-auto px-4 py-8">
          {isLoading ? (
            <LoadingState />
          ) : worker ? (
            <div className="space-y-8">
              {/* Worker Profile Information Section */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center space-x-6 mb-6">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={worker.image_url || '/placeholder.svg'} alt={worker.name} />
                      <AvatarFallback>{worker.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">{worker.name}</h1>
                      <p className="text-gray-600 dark:text-gray-400">{worker.profession}</p>
                      <div className="flex items-center mt-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < Math.floor(worker.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} 
                          />
                        ))}
                        <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">{worker.rating?.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{worker.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Briefcase className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">Experience: {worker.experience}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">Email: Not Available</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">Phone: Not Available</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-700 dark:text-gray-300">Rate: {worker.hourly_rate}/hr</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {worker.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Worker Availability Section */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                    Availability
                  </h2>
                  <Badge variant={worker.is_available ? "default" : "secondary"} className={`flex items-center gap-1 px-2 py-1 text-xs ${worker.is_available ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'}`}>
                    <span className={`w-2 h-2 rounded-full ${worker.is_available ? 'bg-green-200' : 'bg-gray-300'}`}></span>
                    {worker.is_available ? 'Available' : 'Unavailable'}
                  </Badge>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-full">
              <ErrorState>Worker not found.</ErrorState>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default WorkerDetail;
