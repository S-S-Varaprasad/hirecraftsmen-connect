import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Clock, Briefcase, Mail, Phone, Calendar, MessageCircle, Send, ThumbsUp, Award } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useQuery } from '@tanstack/react-query';
import { getWorkerById } from '@/services/workerService';
import { toast } from 'sonner';

const sampleReviews = [
  {
    id: '1',
    user: 'User Review',
    date: '2023-05-15',
    rating: 5,
    comment: 'Great service and very professional work.'
  },
  {
    id: '2',
    user: 'Another User',
    date: '2023-04-22',
    rating: 5,
    comment: 'Very professional and completed the work on time.'
  },
  {
    id: '3',
    user: 'New Client',
    date: '2023-03-10',
    rating: 4,
    comment: 'Good job. Did excellent work with our project. Would recommend.'
  }
];

const sampleCertifications = [
  'Professional Certification - National Skill Development Corporation',
  'Advanced Training - Vocational Training Institute'
];

const WorkerDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: worker, isLoading, error } = useQuery({
    queryKey: ['worker', id],
    queryFn: () => getWorkerById(id as string),
    enabled: !!id,
    meta: {
      onError: (err: Error) => {
        console.error('Error fetching worker details:', err);
        toast.error('Failed to load worker details');
      }
    }
  });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  if (isLoading) {
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

  if (error || !worker) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-orange-50/40 dark:bg-gray-900 pt-32 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold">Worker not found</h1>
            <p className="mt-4">The worker profile you're looking for doesn't exist.</p>
            <Button className="mt-8 bg-[#F97316] hover:bg-[#EA580C]" asChild>
              <Link to="/workers">Browse All Workers</Link>
            </Button>
          </div>
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
          <div className="relative mb-8 rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-orange-600/30 backdrop-blur-sm"></div>
            <div className="relative py-6 px-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <Avatar className="w-28 h-28 border-4 border-white/80 shadow-xl">
                  <AvatarImage 
                    src={worker.image_url || '/placeholder.svg'} 
                    alt={worker.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-2xl font-medium bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300">
                    {getInitials(worker.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{worker.name}</h1>
                  <p className="text-lg text-gray-700 dark:text-gray-300">{worker.profession}</p>
                  <div className="flex items-center mt-2 justify-center md:justify-start">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-5 h-5 ${i < Math.floor(worker.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} 
                        />
                      ))}
                    </div>
                    <span className="ml-2 font-semibold">{worker.rating.toFixed(1)}</span>
                    <span className="ml-1 text-gray-600">(3 reviews)</span>
                  </div>
                  <div className="flex items-center mt-2 justify-center md:justify-start">
                    <MapPin className="w-5 h-5 mr-1 text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">{worker.location}</span>
                    <Badge variant={worker.is_available ? "default" : "secondary"} className={`ml-4 px-3 py-1 ${worker.is_available ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'}`}>
                      {worker.is_available ? 'Available for Work' : 'Currently Unavailable'}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0">
                  <Button className="bg-[#F97316] hover:bg-[#EA580C]" asChild>
                    <Link to={`/apply/${worker.id}`}>
                      Hire Me
                    </Link>
                  </Button>
                  <Button variant="outline" className="border-gray-300 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200" asChild>
                    <Link to={`/message/${worker.id}`}>
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Message
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-lg mb-4 flex items-center text-gray-900 dark:text-white">
                    <Award className="w-5 h-5 mr-2 text-orange-500" />
                    Quick Info
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Contact Information</h4>
                      <ul className="space-y-3">
                        <li className="flex items-center text-sm">
                          <Mail className="w-4 h-4 mr-2 text-orange-500" />
                          <span className="text-gray-700 dark:text-gray-300">contact@example.com</span>
                        </li>
                        <li className="flex items-center text-sm">
                          <Phone className="w-4 h-4 mr-2 text-orange-500" />
                          <span className="text-gray-700 dark:text-gray-300">+91 9876543210</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Work Info</h4>
                      <ul className="space-y-3">
                        <li className="flex items-center text-sm">
                          <Briefcase className="w-4 h-4 mr-2 text-orange-500" />
                          <span className="text-gray-700 dark:text-gray-300">{worker.experience}</span>
                        </li>
                        <li className="flex items-center text-sm">
                          <Clock className="w-4 h-4 mr-2 text-orange-500" />
                          <span className="text-gray-700 dark:text-gray-300">{worker.hourly_rate}/hr</span>
                        </li>
                        <li className="flex items-center text-sm">
                          <Calendar className="w-4 h-4 mr-2 text-orange-500" />
                          <span className="text-gray-700 dark:text-gray-300">75 Jobs Completed</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Languages</h4>
                      <div className="flex flex-wrap gap-2">
                        {worker.languages && worker.languages.length > 0 ? (
                          worker.languages.map((language, i) => (
                            <Badge key={i} variant="outline" className="bg-gray-50 dark:bg-gray-800">
                              {language}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-gray-500">No languages specified</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {worker.skills.map((skill, i) => (
                          <Badge key={i} className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-0 dark:bg-orange-900/30 dark:text-orange-300">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {user && user.id === worker.user_id && (
                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Profile Management</h4>
                        <div className="flex flex-col space-y-2">
                          <Button variant="outline" className="text-gray-700 hover:bg-gray-100">
                            <Link to={`/workers/edit/${worker.id}`}>Edit Profile</Link>
                          </Button>
                          <Button variant="outline" className="text-amber-700 hover:bg-amber-100">
                            <Link to={`/workers/deactivate/${worker.id}`}>Deactivate Profile</Link>
                          </Button>
                          <Button variant="outline" className="text-red-700 hover:bg-red-100">
                            <Link to={`/workers/delete/${worker.id}`}>Delete Profile</Link>
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="mb-6 w-full bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                  <TabsTrigger value="about" className="flex-1">About</TabsTrigger>
                  <TabsTrigger value="certifications" className="flex-1">Certifications</TabsTrigger>
                  <TabsTrigger value="reviews" className="flex-1">Reviews</TabsTrigger>
                </TabsList>
                
                <TabsContent value="about" className="space-y-6">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">About {worker.name}</h2>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {worker.about || `${worker.name} is a professional ${worker.profession} with ${worker.experience} of experience. They are based in ${worker.location} and are currently ${worker.is_available ? 'available' : 'not available'} for new work.`}
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="certifications" className="space-y-6">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Certifications & Credentials</h2>
                    <ul className="space-y-4">
                      {sampleCertifications.map((cert, i) => (
                        <li key={i} className="flex items-start p-3 bg-orange-50/50 dark:bg-orange-900/10 rounded-lg">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                            <ThumbsUp className="w-4 h-4 text-orange-600" />
                          </div>
                          <div>
                            <span className="text-gray-700 dark:text-gray-300 font-medium">{cert}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>
                
                <TabsContent value="reviews" className="space-y-6">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Client Reviews</h2>
                      <div className="flex items-center">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-5 h-5 ${i < Math.floor(worker.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} 
                            />
                          ))}
                        </div>
                        <span className="ml-2 font-semibold">{worker.rating.toFixed(1)}</span>
                        <span className="ml-1 text-gray-500">(3 reviews)</span>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      {sampleReviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0">
                          <div className="flex justify-between mb-2">
                            <div className="font-medium text-gray-900 dark:text-white">{review.user}</div>
                            <div className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</div>
                          </div>
                          <div className="flex mb-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} 
                              />
                            ))}
                          </div>
                          <p className="text-gray-600 dark:text-gray-400">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                    <h3 className="font-semibold mb-4">Leave a Review</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <span className="mr-3 text-gray-700 dark:text-gray-300">Rating:</span>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className="w-5 h-5 text-gray-300 dark:text-gray-600 cursor-pointer hover:text-yellow-400 hover:fill-yellow-400" 
                            />
                          ))}
                        </div>
                      </div>
                      <textarea 
                        className="w-full border border-gray-300 dark:border-gray-700 rounded-md p-3 h-24 focus:outline-none focus:ring-2 focus:ring-orange-500" 
                        placeholder="Write your review here..."
                      ></textarea>
                      <Button className="bg-[#F97316] hover:bg-[#EA580C]">
                        <Send className="w-4 h-4 mr-2" />
                        Submit Review
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default WorkerDetail;
