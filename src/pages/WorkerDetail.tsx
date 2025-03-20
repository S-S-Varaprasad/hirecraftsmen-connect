
import React, { useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getWorkerById } from '@/services/workerService';
import { useQuery } from '@tanstack/react-query';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Briefcase, MapPin, Mail, Phone, Star, History, Calendar, Award, Clock, MessageCircle, Phone as PhoneIcon } from 'lucide-react';
import LoadingState from '@/components/workers/LoadingState';
import ErrorState from '@/components/workers/ErrorState';
import WorkerHistory from '@/components/workers/WorkerHistory';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Stars, PerspectiveCamera } from '@react-three/drei';

// 3D floating particles background component
const Background3D = () => {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full overflow-hidden opacity-70">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 25]} />
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={0.5} />
        <Stars radius={50} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
      </Canvas>
    </div>
  );
};

const WorkerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const profileRef = useRef<HTMLDivElement>(null);

  const { data: worker, isLoading, error } = useQuery({
    queryKey: ['worker', id],
    queryFn: () => getWorkerById(id as string),
    enabled: !!id,
  });

  // 3D card tilt effect
  useEffect(() => {
    if (!profileRef.current) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const card = profileRef.current;
      if (!card) return;
      
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateY = (x - centerX) / 20;
      const rotateX = (centerY - y) / 20;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
    };
    
    const handleMouseLeave = () => {
      if (profileRef.current) {
        profileRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      }
    };
    
    const card = profileRef.current;
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [worker]);

  // Check if the logged-in user is viewing their own profile
  const isOwnProfile = user && worker && worker.user_id === user.id;

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-grow bg-gradient-to-b from-orange-50/40 to-white dark:from-gray-900 dark:to-gray-800 pt-24 relative">
        <Background3D />
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          {isLoading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState message="Error loading worker profile." />
          ) : worker ? (
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Worker Profile Information Section */}
              <motion.div 
                ref={profileRef}
                className="bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm border border-white/20 dark:border-gray-700/30 transition-all duration-300"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, type: "spring" }}
              >
                <div className="p-8">
                  <div className="flex flex-col md:flex-row md:items-center md:space-x-8 mb-8">
                    <div className="mb-4 md:mb-0 relative">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="relative"
                      >
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-amber-500 rounded-full blur-md opacity-70"></div>
                        <Avatar className="w-32 h-32 border-4 border-white dark:border-gray-800 relative">
                          <AvatarImage src={worker.image_url || '/placeholder.svg'} alt={worker.name} className="object-cover" />
                          <AvatarFallback>{worker.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </motion.div>
                      
                      <div className="absolute -bottom-2 -right-2">
                        <Badge variant={worker.is_available ? "default" : "secondary"} className={`flex items-center gap-1 px-2 py-1 ${worker.is_available ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'}`}>
                          <span className={`w-2 h-2 rounded-full ${worker.is_available ? 'bg-green-200' : 'bg-gray-300'}`}></span>
                          {worker.is_available ? 'Available' : 'Unavailable'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-1">{worker.name}</h1>
                      <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">{worker.profession}</p>
                      
                      <div className="flex items-center mb-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-5 h-5 ${i < Math.floor(worker.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} 
                          />
                        ))}
                        <span className="ml-2 text-lg font-medium text-gray-700 dark:text-gray-300">{worker.rating?.toFixed(1)}</span>
                      </div>
                      
                      <div className="flex items-center mt-3 text-gray-600 dark:text-gray-400">
                        <MapPin className="w-5 h-5 mr-2 text-primary" />
                        <span className="text-lg">{worker.location}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 md:mt-0 space-y-2 md:self-start">
                      <Button variant="default" className="w-full sm:w-auto gap-2">
                        <MessageCircle className="w-4 h-4" />
                        Message
                      </Button>
                      <Button variant="outline" className="w-full sm:w-auto gap-2">
                        <PhoneIcon className="w-4 h-4" />
                        Contact
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="space-y-6">
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                          <Briefcase className="w-5 h-5 mr-2 text-primary" />
                          Professional Info
                        </h3>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Experience</span>
                            <span className="font-medium text-gray-800 dark:text-white">{worker.experience}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Hourly Rate</span>
                            <span className="font-medium text-gray-800 dark:text-white">{worker.hourly_rate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Availability</span>
                            <span className={`font-medium ${worker.is_available ? 'text-green-500' : 'text-gray-500'}`}>
                              {worker.is_available ? 'Available Now' : 'Currently Unavailable'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {worker.about && (
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">About</h3>
                          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{worker.about}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-6">
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                          <Award className="w-5 h-5 mr-2 text-primary" />
                          Skills
                        </h3>
                        
                        <div className="flex flex-wrap gap-2">
                          {worker.skills.map((skill, index) => (
                            <Badge 
                              key={index} 
                              variant="secondary" 
                              className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground py-1 px-3"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {worker.languages && worker.languages.length > 0 && (
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Languages</h3>
                          <div className="flex flex-wrap gap-2">
                            {worker.languages.map((language, index) => (
                              <Badge 
                                key={index} 
                                variant="outline" 
                                className="border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300"
                              >
                                {language}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                          <Clock className="w-5 h-5 mr-2 text-primary" />
                          Contact Information
                        </h3>
                        
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                            <span className="text-gray-700 dark:text-gray-300">Email: Not Available</span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                            <span className="text-gray-700 dark:text-gray-300">Phone: Not Available</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Worker Profile Content Tabs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Tabs defaultValue="availability" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                    <TabsTrigger value="availability" className="rounded-md py-2">Availability</TabsTrigger>
                    {isOwnProfile && <TabsTrigger value="history" className="rounded-md py-2">Job History</TabsTrigger>}
                  </TabsList>
                  
                  <TabsContent value="availability" className="bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-lg overflow-hidden backdrop-blur-sm border border-white/20 dark:border-gray-700/30">
                    <div className="p-6">
                      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
                        <Calendar className="mr-2 h-6 w-6 text-primary" />
                        Availability Schedule
                      </h2>
                      
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 text-center">
                        <div className="mb-4">
                          <Badge variant={worker.is_available ? "default" : "secondary"} className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm ${worker.is_available ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'}`}>
                            <span className={`w-2 h-2 rounded-full ${worker.is_available ? 'bg-green-200' : 'bg-gray-300'}`}></span>
                            {worker.is_available ? 'Available for Work' : 'Currently Unavailable'}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-400 mt-4">
                          {worker.is_available 
                            ? 'This professional is currently available to take on new projects and job opportunities.' 
                            : 'This professional is currently unavailable and not accepting new projects at this time.'}
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  {isOwnProfile && (
                    <TabsContent value="history" className="bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-lg overflow-hidden backdrop-blur-sm border border-white/20 dark:border-gray-700/30">
                      <div className="p-6">
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
                          <History className="mr-2 h-6 w-6 text-primary" />
                          Job Application History
                        </h2>
                        <WorkerHistory workerId={id as string} />
                      </div>
                    </TabsContent>
                  )}
                </Tabs>
              </motion.div>
            </motion.div>
          ) : (
            <div className="flex justify-center items-center h-full">
              <ErrorState message="Worker not found." />
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default WorkerDetail;
