import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { getWorkerById } from '@/services/workerService';
import { useAuth } from '@/context/AuthContext';
import { Star, MapPin, Mail, Phone, Clock, Award, Languages, Check, ArrowLeft, Briefcase, CircleDollarSign } from 'lucide-react';
import { toast } from 'sonner';

const WorkerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { data: worker, isLoading, error } = useQuery({
    queryKey: ['worker', id],
    queryFn: () => id ? getWorkerById(id) : Promise.reject('No worker ID provided'),
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-orange-50/40 dark:bg-gray-900 pt-24 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !worker) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-orange-50/40 dark:bg-gray-900 pt-24 p-4">
          <div className="container mx-auto max-w-4xl">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm">
              <h1 className="text-2xl font-bold text-center mb-4">Worker not found</h1>
              <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                The worker profile you're looking for doesn't exist or has been removed.
              </p>
              <div className="flex justify-center">
                <Button onClick={() => navigate(-1)}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Check if current user is the owner of this profile
  const isOwner = user && user.id === worker.user_id;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-orange-50/40 dark:bg-gray-900 pt-24 p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-6">
            <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm">
            {/* Profile Header */}
            <div className="relative bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-800 p-8 pb-32">
              {worker.is_available ? (
                <Badge className="absolute top-4 right-4 bg-green-500 hover:bg-green-600">Available</Badge>
              ) : (
                <Badge variant="secondary" className="absolute top-4 right-4">Unavailable</Badge>
              )}
              
              {isOwner && (
                <div className="absolute top-4 left-4 flex gap-2">
                  <Button variant="outline" className="bg-white/20 hover:bg-white/30 border-white/40" asChild>
                    <Link to={`/workers/deactivate/${worker.id}`}>Deactivate</Link>
                  </Button>
                  <Button variant="destructive" asChild>
                    <Link to={`/workers/delete/${worker.id}`}>Delete</Link>
                  </Button>
                </div>
              )}
            </div>
            
            {/* Profile Content */}
            <div className="px-8 pb-8 -mt-24">
              <div className="flex flex-col md:flex-row gap-6 items-start mb-8">
                {/* Profile Image */}
                <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0 mx-auto md:mx-0">
                  <img 
                    src={worker.image_url || '/placeholder.svg'} 
                    alt={worker.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                </div>
                
                {/* Basic Info */}
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{worker.name}</h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">{worker.profession}</p>
                  
                  <div className="flex items-center justify-center md:justify-start mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${i < Math.round(worker.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} 
                      />
                    ))}
                    <span className="ml-2 text-gray-600 dark:text-gray-400">{worker.rating?.toFixed(1) || 'No ratings'}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{worker.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{worker.experience}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <CircleDollarSign className="w-4 h-4 mr-1" />
                      <span>{worker.hourly_rate}/hr</span>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="w-full md:w-auto flex flex-col gap-3 mt-4 md:mt-0">
                  <Button className="w-full" asChild>
                    <Link to={`/apply/${worker.id}`}>
                      <Briefcase className="w-4 h-4 mr-2" />
                      Hire Now
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to={`/message/${worker.id}`}>
                      <Mail className="w-4 h-4 mr-2" />
                      Contact
                    </Link>
                  </Button>
                </div>
              </div>
              
              {/* Details */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* About Section */}
                <div className="lg:col-span-2">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">About</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 whitespace-pre-line">
                    {worker.about || 'No information provided.'}
                  </p>
                  
                  <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Skills</h2>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {worker.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">
                        <Check className="w-3 h-3 mr-1" />
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  
                  <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Languages</h2>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {worker.languages && worker.languages.length > 0 ? 
                      worker.languages.map((language, index) => (
                        <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
                          <Languages className="w-3 h-3 mr-1" />
                          {language}
                        </Badge>
                      )) : 
                      <p className="text-gray-600 dark:text-gray-400">No languages specified.</p>
                    }
                  </div>
                </div>
                
                {/* Sidebar */}
                <div className="lg:col-span-1">
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg border border-gray-100 dark:border-gray-700">
                    <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Work Information</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Experience</p>
                        <p className="font-medium text-gray-900 dark:text-white flex items-center">
                          <Award className="w-4 h-4 mr-2 text-primary" />
                          {worker.experience}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Hourly Rate</p>
                        <p className="font-medium text-gray-900 dark:text-white flex items-center">
                          <CircleDollarSign className="w-4 h-4 mr-2 text-primary" />
                          {worker.hourly_rate}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Availability</p>
                        <p className="font-medium text-gray-900 dark:text-white flex items-center">
                          <span className={`w-3 h-3 rounded-full mr-2 ${worker.is_available ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                          {worker.is_available ? 'Available for work' : 'Currently unavailable'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default WorkerDetail;
