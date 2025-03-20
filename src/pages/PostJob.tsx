import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, Tag, AlertCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { createJob } from '@/services/jobService';
import { toast } from 'sonner';

const PostJob = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    job_type: 'full-time',
    rate: '',
    urgency: 'Medium' as 'Low' | 'Medium' | 'High',
    description: '',
    skills: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    if (name === 'urgency') {
      let typedValue: 'Low' | 'Medium' | 'High';
      switch (value) {
        case 'low':
          typedValue = 'Low';
          break;
        case 'normal':
          typedValue = 'Medium';
          break;
        case 'high':
        case 'urgent':
          typedValue = 'High';
          break;
        default:
          typedValue = 'Medium';
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: typedValue,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to post a job');
      navigate('/login');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const skillsArray = formData.skills.split(',').map(skill => skill.trim());
      
      const jobData = {
        title: formData.title,
        company: formData.company,
        location: formData.location,
        job_type: formData.job_type,
        rate: formData.rate.startsWith('₹') ? formData.rate : `₹${formData.rate}`,
        urgency: formData.urgency,
        description: formData.description,
        skills: skillsArray,
        employer_id: user.id,
      };
      
      const newJob = await createJob(jobData);
      
      toast.success('Job posted successfully!');
      navigate(`/jobs/${newJob.id}`);
    } catch (error: any) {
      console.error('Error posting job:', error);
      toast.error(`Failed to post job: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col app-page-background">
        <Navbar />
        <main className="flex-grow pt-32 pb-16 flex items-center justify-center">
          <Card className="w-full max-w-md p-8 text-center">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Login Required</h2>
            <p className="mb-6 text-gray-600">You need to be logged in to post a job.</p>
            <Button onClick={() => navigate('/login')} className="w-full">
              Go to Login
            </Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col app-page-background">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Post a New Job</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Connect with skilled professionals for your project
              </p>
            </div>
            
            <Card className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="title" className="text-base font-medium">Job Title</Label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Briefcase className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g., Plumbing Work, Electrical Installation"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="company" className="text-base font-medium">Company or Organization</Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Your company or organization name"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location" className="text-base font-medium">Location</Label>
                    <div className="relative mt-1">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="City, State"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="job_type" className="text-base font-medium">Job Type</Label>
                    <Select 
                      value={formData.job_type} 
                      onValueChange={(value) => handleSelectChange('job_type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="one-time">One-time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rate" className="text-base font-medium">Pay Rate</Label>
                    <div className="relative mt-1">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Tag className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="rate"
                        name="rate"
                        value={formData.rate}
                        onChange={handleChange}
                        placeholder="₹500/hr or ₹10,000 fixed"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="urgency" className="text-base font-medium">Urgency</Label>
                    <Select 
                      value={
                        formData.urgency === 'Low' ? 'low' :
                        formData.urgency === 'Medium' ? 'normal' :
                        formData.urgency === 'High' ? 'high' : 'normal'
                      } 
                      onValueChange={(value) => handleSelectChange('urgency', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select urgency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - Within a month</SelectItem>
                        <SelectItem value="normal">Normal - Within a week</SelectItem>
                        <SelectItem value="high">High - Within 2-3 days</SelectItem>
                        <SelectItem value="urgent">Urgent - Immediately</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="skills" className="text-base font-medium">Required Skills</Label>
                  <Input
                    id="skills"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="e.g., Plumbing, Electrical, Carpentry (comma separated)"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">List skills separated by commas</p>
                </div>
                
                <div>
                  <Label htmlFor="description" className="text-base font-medium">Job Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the job requirements, responsibilities, and any other relevant details"
                    rows={5}
                    required
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <Button type="button" variant="outline" onClick={() => navigate('/jobs')}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Posting...' : 'Post Job'}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PostJob;
