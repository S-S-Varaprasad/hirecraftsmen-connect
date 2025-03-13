
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, FileText, Send, Briefcase } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

// Sample data - in a real app, this would come from an API
const workerData = {
  '1': {
    id: '1',
    name: 'Rajesh Kumar',
    profession: 'Master Carpenter',
    location: 'Bengaluru, Karnataka',
    hourlyRate: '₹450',
    imageUrl: '/lovable-uploads/b2aa6fb3-3f41-46f1-81ea-37ea94ae8af3.png',
  },
  '2': {
    id: '2',
    name: 'Priya Sharma',
    profession: 'Electrician',
    location: 'Mysuru, Karnataka',
    hourlyRate: '₹400',
    imageUrl: '/lovable-uploads/b680b077-f224-42f8-a2d3-95b48ba6e0eb.png',
  },
  '3': {
    id: '3',
    name: 'Mohammed Ali',
    profession: 'Plumber',
    location: 'Mangaluru, Karnataka',
    hourlyRate: '₹380',
    imageUrl: '/lovable-uploads/f5bdc72f-cebf-457f-a3f5-46334ba5cb06.png',
  }
};

const ApplyNow = () => {
  const { id } = useParams<{ id: string }>();
  const worker = id ? workerData[id as keyof typeof workerData] : null;
  
  const [formData, setFormData] = useState({
    projectTitle: '',
    projectType: '',
    description: '',
    location: '',
    startDate: '',
    durationEstimate: '',
    budget: '',
    attachments: null as File | null,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!worker) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-32 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold">Worker not found</h1>
            <p className="mt-4">The worker you're trying to hire doesn't exist.</p>
            <Button className="mt-8" asChild>
              <Link to="/workers">Browse All Workers</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, attachments: e.target.files[0] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    if (!formData.projectTitle || !formData.description || !formData.location || !formData.startDate) {
      toast.error("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    // Simulate API call for job application
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(`Successfully applied to hire ${worker.name}!`);
      // In a real app, you would redirect to a confirmation page or dashboard
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg mb-8">
              <div className="p-6 flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-shrink-0">
                  <img 
                    src={worker.imageUrl || '/placeholder.svg'} 
                    alt={worker.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-100 dark:border-gray-700"
                  />
                </div>
                
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{worker.name}</h1>
                  <p className="text-gray-600 dark:text-gray-400">{worker.profession}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 mt-2">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4 mr-1" />
                      {worker.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4 mr-1" />
                      {worker.hourlyRate}/hr
                    </div>
                  </div>
                </div>
                
                <div className="flex-shrink-0">
                  <Button variant="outline" asChild>
                    <Link to={`/workers/${worker.id}`}>
                      View Profile
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Hire {worker.name}</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                      <label htmlFor="projectTitle" className="text-sm font-medium">
                        Project Title <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="projectTitle"
                        name="projectTitle"
                        placeholder="e.g., Kitchen Renovation, Electrical Repair"
                        value={formData.projectTitle}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <label htmlFor="projectType" className="text-sm font-medium">
                        Project Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="projectType"
                        name="projectType"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={formData.projectType}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="" disabled>Select a project type</option>
                        <option value="home-improvement">Home Improvement</option>
                        <option value="repair">Repair</option>
                        <option value="installation">Installation</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="construction">Construction</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <label htmlFor="description" className="text-sm font-medium">
                        Project Description <span className="text-red-500">*</span>
                      </label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Provide details about your project, requirements, and expectations..."
                        className="h-32"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="location" className="text-sm font-medium">
                        Project Location <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <MapPin className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          id="location"
                          name="location"
                          placeholder="Address or area where work is needed"
                          className="pl-10"
                          value={formData.location}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="startDate" className="text-sm font-medium">
                        Start Date <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          id="startDate"
                          name="startDate"
                          type="date"
                          className="pl-10"
                          value={formData.startDate}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="durationEstimate" className="text-sm font-medium">
                        Estimated Duration
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Clock className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          id="durationEstimate"
                          name="durationEstimate"
                          placeholder="e.g., 2 days, 1 week, 3 months"
                          className="pl-10"
                          value={formData.durationEstimate}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="budget" className="text-sm font-medium">
                        Budget
                      </label>
                      <Input
                        id="budget"
                        name="budget"
                        placeholder="Your estimated budget for this project"
                        value={formData.budget}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <label htmlFor="attachments" className="text-sm font-medium">
                        Attachments
                      </label>
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <FileText className="h-8 w-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            {formData.attachments ? 
                              formData.attachments.name : 
                              "Upload any relevant files (plans, photos, etc.)"
                            }
                          </p>
                          <input
                            id="attachments"
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            className="bg-[#F0F9FF] hover:bg-[#E0F2FE] text-[#0284C7] border-[#0284C7]"
                            onClick={() => document.getElementById('attachments')?.click()}
                          >
                            Select Files
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      type="submit"
                      className="w-full bg-[#F97316] hover:bg-[#EA580C]"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Briefcase className="w-4 h-4 mr-2" />
                          Submit Hiring Request
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ApplyNow;
