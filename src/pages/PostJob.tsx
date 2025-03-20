
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { createJob } from '@/services/jobService';
import { toast } from 'sonner';

const PostJob = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    job_type: 'Full-time',
    rate: '',
    urgency: 'Medium',
    skills: '',
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
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

      const skillsArray = formData.skills
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill !== '');

      const jobData = {
        title: formData.title,
        company: formData.company,
        location: formData.location,
        job_type: formData.job_type,
        rate: formData.rate,
        urgency: formData.urgency as 'Low' | 'Medium' | 'High',
        skills: skillsArray,
        description: formData.description,
        employer_id: user.id,
      };

      await createJob(jobData);
      toast.success('Job posted successfully!');
      navigate('/jobs');
    } catch (error: any) {
      console.error('Error posting job:', error);
      toast.error(error?.message || 'Failed to post job');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col app-page-background">
      <Navbar />

      <main className="flex-grow pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="px-8 py-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">Post a New Job</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <Label htmlFor="title" className="text-base">Job Title</Label>
                  <Input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="e.g., Plumber Needed for Bathroom Repair"
                    value={formData.title}
                    onChange={handleChange}
                    className="mt-1"
                    required
                  />
                </div>
                <div className="mb-4">
                  <Label htmlFor="company" className="text-base">Company/Employer Name</Label>
                  <Input
                    type="text"
                    id="company"
                    name="company"
                    placeholder="Your name or company name"
                    value={formData.company}
                    onChange={handleChange}
                    className="mt-1"
                    required
                  />
                </div>
                <div className="mb-4">
                  <Label htmlFor="location" className="text-base">Location</Label>
                  <Input
                    type="text"
                    id="location"
                    name="location"
                    placeholder="e.g., Mumbai, Maharashtra"
                    value={formData.location}
                    onChange={handleChange}
                    className="mt-1"
                    required
                  />
                </div>
                <div className="mb-4">
                  <Label htmlFor="job_type" className="text-base">Job Type</Label>
                  <Select
                    value={formData.job_type}
                    onValueChange={(value) => handleSelectChange('job_type', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Temporary">Temporary</SelectItem>
                      <SelectItem value="One-time">One-time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="mb-4">
                  <Label htmlFor="rate" className="text-base">Pay Rate</Label>
                  <Input
                    type="text"
                    id="rate"
                    name="rate"
                    placeholder="e.g., ₹500/hr or ₹3,000/day"
                    value={formData.rate}
                    onChange={handleChange}
                    className="mt-1"
                    required
                  />
                </div>
                <div className="mb-4">
                  <Label htmlFor="urgency" className="text-base">Urgency</Label>
                  <Select
                    value={formData.urgency}
                    onValueChange={(value) => handleSelectChange('urgency', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select urgency level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="mb-4">
                  <Label htmlFor="skills" className="text-base">Required Skills</Label>
                  <Input
                    type="text"
                    id="skills"
                    name="skills"
                    placeholder="e.g., Plumbing, Tile Work, Painting (comma separated)"
                    value={formData.skills}
                    onChange={handleChange}
                    className="mt-1"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">List required skills, separated by commas</p>
                </div>
                <div className="mb-4">
                  <Label htmlFor="description" className="text-base">Job Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe the job, requirements, and any other important details"
                    value={formData.description}
                    onChange={handleChange}
                    className="mt-1"
                    rows={6}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Posting...' : 'Post Job'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PostJob;
