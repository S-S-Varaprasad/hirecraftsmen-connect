
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Clock, Briefcase, Mail, Phone, Calendar, MessageCircle, Send, ThumbsUp, Award } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

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
    imageUrl: '/lovable-uploads/bae49f34-0d6e-4f1b-bf50-8d6cf6e46fa1.png',
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
    imageUrl: '/lovable-uploads/aa5e2505-c4ac-44e1-a04d-355cb97f4cff.png',
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
    imageUrl: '/lovable-uploads/38ddfbbd-eddf-4be1-bdc9-7abb44ada4dc.png',
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
        comment: "Mohammed fixed a complicated plumbing issue that other plumbers couldn't solve. Highly recommended!"
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
  },
  '4': {
    id: '4',
    name: 'Anjali Desai',
    profession: 'Interior Designer',
    location: 'Hubballi, Karnataka',
    rating: 4.9,
    experience: '10 years',
    hourlyRate: '₹650',
    skills: ['Home Design', 'Decoration', 'Space Planning', 'Color Theory', 'Sustainable Design'],
    isAvailable: true,
    imageUrl: '/lovable-uploads/b502d50d-3fed-4571-a8e0-1ea97e1e93d6.png',
    bio: 'Passionate interior designer with a decade of experience creating functional and beautiful spaces. I specialize in blending modern aesthetics with traditional Indian elements to create unique living environments.',
    phone: '+91 9543210987',
    email: 'anjali.desai@example.com',
    completedJobs: 52,
    languages: ['English', 'Hindi', 'Kannada', 'Gujarati'],
    certifications: ['Certified Interior Designer - Indian Institute of Interior Design', 'Sustainable Design Specialist'],
    reviews: [
      {
        id: '1',
        user: 'Neha Patel',
        date: '2023-05-28',
        rating: 5,
        comment: 'Anjali transformed our home into something magical. Her eye for detail and creativity is exceptional.'
      },
      {
        id: '2',
        user: 'Karthik Rao',
        date: '2023-04-12',
        rating: 5,
        comment: "The best interior designer we've worked with. Very professional and understood our needs perfectly."
      },
      {
        id: '3',
        user: 'Aishwarya Singh',
        date: '2023-03-05',
        rating: 4,
        comment: 'Great designer who listens to client needs. Our office space looks modern and functional now.'
      }
    ]
  },
  '5': {
    id: '5',
    name: 'Ravi Verma',
    profession: 'Chef',
    location: 'Belagavi, Karnataka',
    rating: 4.6,
    experience: '7 years',
    hourlyRate: '₹800',
    skills: ['Indian Cuisine', 'Continental', 'Catering', 'Pastry', 'Menu Planning'],
    isAvailable: true,
    imageUrl: '/lovable-uploads/eb390765-3769-481d-a26f-0c4ddb2a4f35.png',
    bio: 'Culinary expert with 7 years of experience in Indian and Continental cuisines. I provide catering services for events, private dining experiences, and cooking classes.',
    phone: '+91 9432109876',
    email: 'ravi.verma@example.com',
    completedJobs: 93,
    languages: ['English', 'Hindi', 'Kannada', 'Marathi'],
    certifications: ['Culinary Arts - Institute of Hotel Management', 'Food Safety and Hygiene Certification'],
    reviews: [
      {
        id: '1',
        user: 'Vikram Joshi',
        date: '2023-06-05',
        rating: 5,
        comment: 'Ravi catered our family gathering and the food was exceptional. Everyone loved it!'
      },
      {
        id: '2',
        user: 'Sneha Reddy',
        date: '2023-04-28',
        rating: 4,
        comment: 'Great chef with a diverse menu. The presentation was beautiful and the taste was excellent.'
      },
      {
        id: '3',
        user: 'Ajay Kumar',
        date: '2023-03-15',
        rating: 5,
        comment: 'Hired Ravi for a corporate event and he exceeded our expectations. Very professional.'
      }
    ]
  },
  '6': {
    id: '6',
    name: 'Deepak Shetty',
    profession: 'Security Guard',
    location: 'Bengaluru, Karnataka',
    rating: 4.8,
    experience: '9 years',
    hourlyRate: '₹300',
    skills: ['Event Security', 'Property Protection', 'CCTV Monitoring', 'Access Control', 'Emergency Response'],
    isAvailable: false,
    imageUrl: '/lovable-uploads/6256848e-6930-4ae5-ae11-e69bb6b1fbc2.png',
    bio: 'Experienced security professional with a background in military service. I provide reliable security services for events, residential properties, and commercial establishments.',
    phone: '+91 9321098765',
    email: 'deepak.shetty@example.com',
    completedJobs: 120,
    languages: ['English', 'Hindi', 'Kannada', 'Tulu'],
    certifications: ['Security Guard License - Karnataka State Security Board', 'First Aid and Emergency Response'],
    reviews: [
      {
        id: '1',
        user: 'Ramesh Nair',
        date: '2023-05-30',
        rating: 5,
        comment: 'Deepak provided excellent security for our corporate event. Very vigilant and professional.'
      },
      {
        id: '2',
        user: 'Ananya Murthy',
        date: '2023-04-20',
        rating: 5,
        comment: 'We hired Deepak for our apartment complex, and he improved our security protocols significantly.'
      },
      {
        id: '3',
        user: 'Suresh Rao',
        date: '2023-03-12',
        rating: 4,
        comment: 'Dependable security professional who takes his job seriously. Would hire again.'
      }
    ]
  },
  '7': {
    id: '7',
    name: 'Aisha Khan',
    profession: 'Mason',
    location: 'Mangaluru, Karnataka',
    rating: 4.7,
    experience: '11 years',
    hourlyRate: '₹480',
    skills: ['Bricklaying', 'Stone Work', 'Plastering', 'Tiling', 'Concrete Work'],
    isAvailable: true,
    imageUrl: '/lovable-uploads/97d40d27-7f2e-4573-8cc4-fad4c8adc4a9.png',
    bio: 'Skilled mason with over a decade of experience in all aspects of masonry work. I specialize in both traditional and modern construction techniques.',
    phone: '+91 9210987654',
    email: 'aisha.khan@example.com',
    completedJobs: 86,
    languages: ['English', 'Hindi', 'Kannada', 'Urdu'],
    certifications: ['Certified Mason - Construction Skill Development Council', 'Advanced Masonry Techniques'],
    reviews: [
      {
        id: '1',
        user: 'Harish Kumar',
        date: '2023-05-25',
        rating: 5,
        comment: 'Aisha did an excellent job with the stone work on our garden wall. Precise and skilled work.'
      },
      {
        id: '2',
        user: 'Meena Patil',
        date: '2023-04-15',
        rating: 4,
        comment: 'Very knowledgeable mason. The brick work she did for our extension is perfect.'
      },
      {
        id: '3',
        user: 'Farhan Ahmed',
        date: '2023-03-08',
        rating: 5,
        comment: 'Aisha completed our tiling project with great attention to detail. Highly recommend.'
      }
    ]
  },
  '8': {
    id: '8',
    name: 'Vikram Reddy',
    profession: 'Mechanic',
    location: 'Mysuru, Karnataka',
    rating: 4.9,
    experience: '14 years',
    hourlyRate: '₹420',
    skills: ['Car Repair', 'Engine Work', 'Diagnostics', 'Electrical Systems', 'Preventive Maintenance'],
    isAvailable: true,
    imageUrl: '/lovable-uploads/a086ecfc-f4fc-426d-8f8c-f946ffb1f866.png',
    bio: 'Experienced automotive mechanic with expertise in diagnosing and fixing complex mechanical and electrical issues across multiple vehicle brands.',
    phone: '+91 9109876543',
    email: 'vikram.reddy@example.com',
    completedJobs: 210,
    languages: ['English', 'Hindi', 'Kannada', 'Telugu'],
    certifications: ['Automotive Service Excellence (ASE) Certification', 'Advanced Diagnostic Techniques'],
    reviews: [
      {
        id: '1',
        user: 'Rahul Menon',
        date: '2023-06-01',
        rating: 5,
        comment: "Vikram fixed an issue with my car that three other mechanics couldn't figure out. Excellent service!"
      },
      {
        id: '2',
        user: 'Divya Krishna',
        date: '2023-04-25',
        rating: 5,
        comment: "Honest and skilled mechanic. Didn't try to upsell unnecessary services and fixed my car perfectly."
      },
      {
        id: '3',
        user: 'Naveen Kumar',
        date: '2023-03-20',
        rating: 4,
        comment: "Very knowledgeable about all makes and models. Fixed my vintage car when others couldn't."
      }
    ]
  },
  '9': {
    id: '9',
    name: 'Sunil Patil',
    profession: 'Painter',
    location: 'Bengaluru, Karnataka',
    rating: 4.8,
    experience: '9 years',
    hourlyRate: '₹390',
    skills: ['Interior Painting', 'Wall Design', 'Finish Work', 'Texture Painting', 'Waterproofing'],
    isAvailable: true,
    imageUrl: '/lovable-uploads/a501a9e5-6077-43aa-b5bb-34ec9e1694f9.png',
    bio: 'Professional painter specializing in interior and exterior painting for residential and commercial properties. I provide quality workmanship and attention to detail.',
    phone: '+91 9098765432',
    email: 'sunil.patil@example.com',
    completedJobs: 78,
    languages: ['English', 'Hindi', 'Kannada', 'Marathi'],
    certifications: ['Professional Painter Certification', 'Advanced Color Theory and Application'],
    reviews: [
      {
        id: '1',
        user: 'Ashok Singh',
        date: '2023-05-20',
        rating: 5,
        comment: 'Sunil painted our entire house and did an amazing job. Clean lines and perfect finish.'
      },
      {
        id: '2',
        user: 'Priyanka Joshi',
        date: '2023-04-10',
        rating: 4,
        comment: 'Professional and efficient painter. Completed the work ahead of schedule.'
      },
      {
        id: '3',
        user: 'Vijay Mallya',
        date: '2023-03-05',
        rating: 5,
        comment: 'The texture wall Sunil created in our living room is a masterpiece. Excellent craftsmanship.'
      }
    ]
  },
  '10': {
    id: '10',
    name: 'Kiran Prakash',
    profession: 'Gardener',
    location: 'Dharwad, Karnataka',
    rating: 4.7,
    experience: '12 years',
    hourlyRate: '₹350',
    skills: ['Landscaping', 'Plant Care', 'Garden Design', 'Irrigation Systems', 'Organic Gardening'],
    isAvailable: true,
    imageUrl: '/lovable-uploads/6f68fb0a-45c2-4188-82f5-924315f45bfb.png',
    bio: 'Passionate gardener with extensive knowledge of native plants and sustainable landscaping. I create beautiful, low-maintenance gardens that thrive in the local climate.',
    phone: '+91 9087654321',
    email: 'kiran.prakash@example.com',
    completedJobs: 95,
    languages: ['English', 'Hindi', 'Kannada'],
    certifications: ['Certified Horticulturist', 'Sustainable Landscaping Design'],
    reviews: [
      {
        id: '1',
        user: 'Shanta Rao',
        date: '2023-05-15',
        rating: 5,
        comment: 'Kiran transformed our barren backyard into a beautiful garden. His knowledge of plants is impressive.'
      },
      {
        id: '2',
        user: 'Rohit Sharma',
        date: '2023-04-05',
        rating: 4,
        comment: 'Great gardener who really understands sustainable practices. Our garden needs much less water now.'
      },
      {
        id: '3',
        user: 'Leela Devi',
        date: '2023-03-01',
        rating: 5,
        comment: 'Kiran designed and installed a beautiful kitchen garden for us. Everything is thriving!'
      }
    ]
  },
  '11': {
    id: '11',
    name: 'Sanjay Rao',
    profession: 'Tailor',
    location: 'Bellary, Karnataka',
    rating: 4.9,
    experience: '18 years',
    hourlyRate: '₹500',
    skills: ['Stitching', 'Alterations', 'Traditional Clothing', 'Pattern Making', 'Embroidery'],
    isAvailable: false,
    imageUrl: '/lovable-uploads/2d955bf0-99e6-4e89-8eaa-322081b2c200.png',
    bio: 'Master tailor with 18 years of experience in creating custom clothing and alterations. I specialize in traditional Indian attire and modern western wear.',
    phone: '+91 9076543210',
    email: 'sanjay.rao@example.com',
    completedJobs: 310,
    languages: ['English', 'Hindi', 'Kannada', 'Telugu'],
    certifications: ['Master Tailor Certification', 'Traditional Embroidery Techniques'],
    reviews: [
      {
        id: '1',
        user: 'Rekha Iyer',
        date: '2023-05-10',
        rating: 5,
        comment: "Sanjay created a beautiful traditional outfit for my daughter's wedding. The craftsmanship is exceptional."
      },
      {
        id: '2',
        user: 'Vishal Patel',
        date: '2023-04-18',
        rating: 5,
        comment: 'Got several suits tailored by Sanjay. Perfect fit and excellent attention to detail.'
      },
      {
        id: '3',
        user: 'Sunita Naidu',
        date: '2023-03-22',
        rating: 4,
        comment: 'Very skilled tailor who can handle complex alterations. Highly recommend for designer clothing repairs.'
      }
    ]
  },
  '12': {
    id: '12',
    name: 'Lakshmi Devi',
    profession: 'Housekeeper',
    location: 'Bengaluru, Karnataka',
    rating: 4.8,
    experience: '10 years',
    hourlyRate: '₹320',
    skills: ['Cleaning', 'Organization', 'Eldercare', 'Childcare', 'Cooking'],
    isAvailable: true,
    imageUrl: '/lovable-uploads/9a30bb25-6230-4656-a014-6b3a52908509.png',
    bio: 'Reliable housekeeper with a decade of experience in home management and care. I provide thorough cleaning, organization, and optional cooking and care services.',
    phone: '+91 9065432109',
    email: 'lakshmi.devi@example.com',
    completedJobs: 145,
    languages: ['English', 'Hindi', 'Kannada', 'Tamil'],
    certifications: ['Professional Housekeeping', 'Basic First Aid and Childcare'],
    reviews: [
      {
        id: '1',
        user: 'Arjun Nair',
        date: '2023-05-05',
        rating: 5,
        comment: 'Lakshmi has been keeping our home spotless for over a year. She is reliable, thorough, and trustworthy.'
      },
      {
        id: '2',
        user: 'Sarita Shah',
        date: '2023-04-12',
        rating: 4,
        comment: 'Great housekeeper who also helps with our elderly mother. Very caring and patient.'
      },
      {
        id: '3',
        user: 'Karthik Iyengar',
        date: '2023-03-18',
        rating: 5,
        comment: 'Lakshmi is an excellent cook in addition to her housekeeping skills. Our family loves her South Indian dishes.'
      }
    ]
  },
  '13': {
    id: '13',
    name: 'Ramesh Gowda',
    profession: 'Farmer',
    location: 'Tumkur, Karnataka',
    rating: 4.7,
    experience: '25 years',
    hourlyRate: '₹380',
    skills: ['Organic Farming', 'Crop Management', 'Livestock', 'Sustainable Agriculture', 'Farm Planning'],
    isAvailable: true,
    imageUrl: '/lovable-uploads/f24c6a0a-277d-4372-9ce9-b8a54904d96b.png',
    bio: 'Experienced farmer specializing in organic methods and sustainable agriculture. I provide consultation on farm management, crop selection, and organic practices.',
    phone: '+91 9054321098',
    email: 'ramesh.gowda@example.com',
    completedJobs: 68,
    languages: ['English', 'Hindi', 'Kannada'],
    certifications: ['Certified Organic Farmer', 'Sustainable Agriculture Practices'],
    reviews: [
      {
        id: '1',
        user: 'Venkat Reddy',
        date: '2023-05-28',
        rating: 5,
        comment: 'Ramesh helped us convert our conventional farm to organic. His knowledge has saved us money and improved yields.'
      },
      {
        id: '2',
        user: 'Lalitha Krishna',
        date: '2023-04-08',
        rating: 4,
        comment: 'Great consultant for small-scale farming. Helped us set up a productive kitchen garden on our property.'
      },
      {
        id: '3',
        user: 'Mohan Rao',
        date: '2023-03-15',
        rating: 5,
        comment: "Ramesh's expertise in livestock management has greatly improved our dairy farm's productivity."
      }
    ]
  }
};

const WorkerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const worker = id ? workerData[id as keyof typeof workerData] : null;

  // Get the initials for the fallback avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  if (!worker) {
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
          {/* Header with background design */}
          <div className="relative mb-8 rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-orange-600/30 backdrop-blur-sm"></div>
            <div className="relative py-6 px-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <Avatar className="w-28 h-28 border-4 border-white/80 shadow-xl">
                  <AvatarImage 
                    src={worker.imageUrl || '/placeholder.svg'} 
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
                    <span className="ml-1 text-gray-600">({worker.reviews.length} reviews)</span>
                  </div>
                  <div className="flex items-center mt-2 justify-center md:justify-start">
                    <MapPin className="w-5 h-5 mr-1 text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">{worker.location}</span>
                    <Badge variant={worker.isAvailable ? "default" : "secondary"} className={`ml-4 px-3 py-1 ${worker.isAvailable ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'}`}>
                      {worker.isAvailable ? 'Available for Work' : 'Currently Unavailable'}
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
            {/* Sidebar with info */}
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
                          <span className="text-gray-700 dark:text-gray-300">{worker.email}</span>
                        </li>
                        <li className="flex items-center text-sm">
                          <Phone className="w-4 h-4 mr-2 text-orange-500" />
                          <span className="text-gray-700 dark:text-gray-300">{worker.phone}</span>
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
                          <span className="text-gray-700 dark:text-gray-300">{worker.hourlyRate}/hr</span>
                        </li>
                        <li className="flex items-center text-sm">
                          <Calendar className="w-4 h-4 mr-2 text-orange-500" />
                          <span className="text-gray-700 dark:text-gray-300">{worker.completedJobs} Jobs Completed</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Languages</h4>
                      <div className="flex flex-wrap gap-2">
                        {worker.languages.map((language, i) => (
                          <Badge key={i} variant="outline" className="bg-gray-50 dark:bg-gray-800">
                            {language}
                          </Badge>
                        ))}
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
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
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
                      {worker.bio}
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="certifications" className="space-y-6">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Certifications & Credentials</h2>
                    <ul className="space-y-4">
                      {worker.certifications.map((cert, i) => (
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
                        <span className="ml-1 text-gray-500">({worker.reviews.length} reviews)</span>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      {worker.reviews.map((review) => (
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
