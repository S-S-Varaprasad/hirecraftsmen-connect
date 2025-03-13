
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Clock, Briefcase, Mail, Phone, Calendar, MessageCircle, Send, ThumbsUp } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Sample data - in a real app, this would come from an API
const workerData = {
  '1': {
    id: '1',
    name: 'Rajesh Kumar',
    profession: 'Master Carpenter',
    location: 'Bengaluru, Karnataka',
    rating: 4.9,
    experience: '15 years',
    hourlyRate: '₹450',
    skills: ['Furniture', 'Cabinets', 'Remodeling', 'Woodworking', 'Home Renovation'],
    isAvailable: true,
    imageUrl: '/lovable-uploads/b2aa6fb3-3f41-46f1-81ea-37ea94ae8af3.png',
    bio: 'With 15 years of experience in carpentry, I specialize in custom furniture creation, cabinet installations, and home renovations. My clients value my attention to detail and commitment to quality craftsmanship.',
    phone: '+91 9876543210',
    email: 'rajesh.kumar@example.com',
    completedJobs: 87,
    languages: ['English', 'Hindi', 'Kannada'],
    certifications: ['Certified Carpenter - National Skill Development Corporation', 'Advanced Woodworking - Karnataka Vocational Training Institute'],
    reviews: [
      {
        id: '1',
        user: 'Amit Patel',
        date: '2023-05-15',
        rating: 5,
        comment: 'Rajesh built custom cabinets for my kitchen and they are absolutely beautiful. Great craftsmanship and attention to detail.'
      },
      {
        id: '2',
        user: 'Priya Sharma',
        date: '2023-04-22',
        rating: 5,
        comment: 'Very professional and completed the work on time. The furniture he built for us is of excellent quality.'
      },
      {
        id: '3',
        user: 'Deepak Verma',
        date: '2023-03-10',
        rating: 4,
        comment: 'Good carpenter. Did a great job with our home renovation project. Would recommend.'
      }
    ]
  },
  '2': {
    id: '2',
    name: 'Priya Sharma',
    profession: 'Electrician',
    location: 'Mysuru, Karnataka',
    rating: 4.8,
    experience: '8 years',
    hourlyRate: '₹400',
    skills: ['Wiring', 'Installations', 'Repairs', 'Circuit Breakers', 'Emergency Services'],
    isAvailable: true,
    imageUrl: '/lovable-uploads/b680b077-f224-42f8-a2d3-95b48ba6e0eb.png',
    bio: 'I am a licensed electrician with 8 years of experience in residential and commercial electrical work. I provide reliable, high-quality service for all your electrical needs, from minor repairs to full-scale installations.',
    phone: '+91 9765432109',
    email: 'priya.sharma@example.com',
    completedJobs: 65,
    languages: ['English', 'Hindi', 'Kannada', 'Tamil'],
    certifications: ['Licensed Electrician - Karnataka Electrical Authority', 'Electrical Safety Certification'],
    reviews: [
      {
        id: '1',
        user: 'Rahul Desai',
        date: '2023-06-02',
        rating: 5,
        comment: 'Priya fixed our electrical issues quickly and effectively. Very knowledgeable and professional.'
      },
      {
        id: '2',
        user: 'Meera Joshi',
        date: '2023-05-18',
        rating: 5,
        comment: 'Excellent service! Priya installed new wiring in our home and did a perfect job.'
      },
      {
        id: '3',
        user: 'Arjun Reddy',
        date: '2023-04-05',
        rating: 4,
        comment: 'Reliable and skilled electrician. Completed the work within the estimated time.'
      }
    ]
  },
  '3': {
    id: '3',
    name: 'Mohammed Ali',
    profession: 'Plumber',
    location: 'Mangaluru, Karnataka',
    rating: 4.7,
    experience: '12 years',
    hourlyRate: '₹380',
    skills: ['Repairs', 'Installations', 'Drainage', 'Water Heaters', 'Leakage Detection'],
    isAvailable: false,
    imageUrl: '/lovable-uploads/f5bdc72f-cebf-457f-a3f5-46334ba5cb06.png',
    bio: 'Experienced plumber providing comprehensive plumbing services including repairs, installations, and maintenance. I take pride in delivering prompt, reliable solutions for all your plumbing needs.',
    phone: '+91 9654321098',
    email: 'mohammed.ali@example.com',
    completedJobs: 103,
    languages: ['English', 'Hindi', 'Kannada', 'Malayalam'],
    certifications: ['Master Plumber Certification', 'Advanced Plumbing Techniques - Vocational Training Institute'],
    reviews: [
      {
        id: '1',
        user: 'Sanjay Kumar',
        date: '2023-05-22',
        rating: 5,
        comment: 'Mohammed fixed a complicated plumbing issue that other plumbers couldn\'t solve. Highly recommended!'
      },
      {
        id: '2',
        user: 'Lakshmi Nair',
        date: '2023-04-15',
        rating: 4,
        comment: 'Professional service and reasonable rates. Fixed our bathroom leak quickly.'
      },
      {
        id: '3',
        user: 'Ravi Menon',
        date: '2023-03-18',
        rating: 5,
        comment: 'Excellent plumber! Mohammed installed new fixtures in our kitchen and bathroom with great care and precision.'
      }
    ]
  }
};

const WorkerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const worker = id ? workerData[id as keyof typeof workerData] : null;

  if (!worker) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-32 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold">Worker not found</h1>
            <p className="mt-4">The worker profile you're looking for doesn't exist.</p>
            <Button className="mt-8" asChild>
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
      
      <main className="flex-grow pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Profile Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg sticky top-24">
                <div className="p-6 text-center border-b border-gray-200 dark:border-gray-700">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-primary/20">
                    <img 
                      src={worker.imageUrl || '/placeholder.svg'} 
                      alt={worker.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">{worker.name}</h1>
                  <p className="text-gray-600 dark:text-gray-400">{worker.profession}</p>
                  
                  <div className="flex justify-center items-center mt-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < Math.floor(worker.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} 
                      />
                    ))}
                    <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">{worker.rating.toFixed(1)}</span>
                  </div>
                  
                  <div className="flex justify-center items-center mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{worker.location}</span>
                  </div>
                  
                  <div className="mt-4">
                    <Badge variant={worker.isAvailable ? "default" : "secondary"} className={`px-3 py-1 ${worker.isAvailable ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'}`}>
                      {worker.isAvailable ? 'Available for Work' : 'Currently Unavailable'}
                    </Badge>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Contact Information</h3>
                      <ul className="space-y-3">
                        <li className="flex items-center text-sm">
                          <Mail className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300">{worker.email}</span>
                        </li>
                        <li className="flex items-center text-sm">
                          <Phone className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300">{worker.phone}</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Work Info</h3>
                      <ul className="space-y-3">
                        <li className="flex items-center text-sm">
                          <Briefcase className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300">{worker.experience}</span>
                        </li>
                        <li className="flex items-center text-sm">
                          <Clock className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300">{worker.hourlyRate}/hr</span>
                        </li>
                        <li className="flex items-center text-sm">
                          <Calendar className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300">{worker.completedJobs} Jobs Completed</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Languages</h3>
                      <div className="flex flex-wrap gap-2">
                        {worker.languages.map((language, i) => (
                          <Badge key={i} variant="outline" className="bg-gray-50 dark:bg-gray-800">
                            {language}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-3">
                    <Button className="w-full bg-[#F97316] hover:bg-[#EA580C]" asChild>
                      <Link to={`/apply/${worker.id}`}>
                        Hire Me
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to={`/message/${worker.id}`}>
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Message
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="md:col-span-2">
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="mb-6 w-full bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                  <TabsTrigger value="about" className="flex-1">About</TabsTrigger>
                  <TabsTrigger value="skills" className="flex-1">Skills</TabsTrigger>
                  <TabsTrigger value="reviews" className="flex-1">Reviews</TabsTrigger>
                </TabsList>
                
                <TabsContent value="about" className="space-y-6">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">About {worker.name}</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {worker.bio}
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Certifications</h2>
                    <ul className="space-y-2">
                      {worker.certifications.map((cert, i) => (
                        <li key={i} className="flex items-start">
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                            <ThumbsUp className="w-3 h-3 text-green-600" />
                          </div>
                          <span className="ml-2 text-gray-600 dark:text-gray-400">{cert}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>
                
                <TabsContent value="skills" className="space-y-6">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Skills & Expertise</h2>
                    <div className="flex flex-wrap gap-2">
                      {worker.skills.map((skill, i) => (
                        <Badge key={i} className="bg-primary/10 text-primary hover:bg-primary/20 border-0 px-3 py-1">
                          {skill}
                        </Badge>
                      ))}
                    </div>
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
                        <span className="ml-1 text-gray-500">({worker.reviews.length} reviews)</span>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      {worker.reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0">
                          <div className="flex justify-between mb-2">
                            <div className="font-medium">{review.user}</div>
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
                        <span className="mr-2">Rating:</span>
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
                        className="w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 h-24 focus:outline-none focus:ring-2 focus:ring-primary" 
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
