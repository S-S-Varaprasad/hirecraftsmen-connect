
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar, Upload, Clock, CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from '@/components/ui/use-toast';

const ApplyNow = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    availability: '',
    experience: '',
    coverLetter: '',
    resume: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData(prev => ({ ...prev, resume: e.target.files?.[0] || null }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Application Submitted",
        description: "Your application has been successfully submitted. You will be notified about the next steps.",
        variant: "default",
      });
      navigate('/jobs');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-orange-50/40 dark:bg-gray-900">
      <Navbar />

      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 sm:p-10">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">Apply for Job</h1>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input 
                      id="fullName" 
                      name="fullName" 
                      placeholder="Enter your full name" 
                      required 
                      value={formData.fullName} 
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        placeholder="Enter your email address" 
                        required 
                        value={formData.email} 
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        placeholder="Enter your phone number" 
                        required 
                        value={formData.phone} 
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="availability">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-primary" />
                          <span>Availability</span>
                        </div>
                      </Label>
                      <Input 
                        id="availability" 
                        name="availability" 
                        placeholder="When can you start?" 
                        required 
                        value={formData.availability} 
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="experience">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-primary" />
                          <span>Years of Experience</span>
                        </div>
                      </Label>
                      <Input 
                        id="experience" 
                        name="experience" 
                        placeholder="Your relevant experience" 
                        required 
                        value={formData.experience} 
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="coverLetter">Cover Letter</Label>
                    <Textarea 
                      id="coverLetter" 
                      name="coverLetter" 
                      placeholder="Tell us why you're a good fit for this position..." 
                      rows={5} 
                      required 
                      className="resize-none" 
                      value={formData.coverLetter} 
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="resume">
                      <div className="flex items-center">
                        <Upload className="w-4 h-4 mr-2 text-primary" />
                        <span>Upload Resume/CV</span>
                      </div>
                    </Label>
                    <Input 
                      id="resume" 
                      type="file" 
                      className="cursor-pointer" 
                      onChange={handleFileChange}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Accepted file formats: PDF, DOC, DOCX (Max: 5MB)
                    </p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button 
                    type="submit" 
                    className="w-full flex items-center justify-center gap-2" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Submit Application</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ApplyNow;
