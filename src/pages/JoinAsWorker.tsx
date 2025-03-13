
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Briefcase, Clock, IndianRupee, FileText, Upload, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from 'sonner';

const JoinAsWorker = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    profession: '',
    experience: '',
    hourlyRate: '',
    skills: '',
    about: '',
    profileImage: null as File | null,
    resume: null as File | null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'profileImage' | 'resume') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, [fieldName]: file });
      
      // Create preview for profile image
      if (fieldName === 'profileImage') {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleProfileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, fieldName: 'profileImage' | 'resume') => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      
      // Validate file type for images
      if (fieldName === 'profileImage' && !file.type.startsWith('image/')) {
        toast.error('Please upload an image file (JPG, PNG, etc.)');
        return;
      }
      
      // Validate file type for resume
      if (fieldName === 'resume' && !['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
        toast.error('Please upload a PDF or Word document');
        return;
      }
      
      setFormData({ ...formData, [fieldName]: file });
      
      // Create preview for profile image
      if (fieldName === 'profileImage') {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call for worker registration
    setTimeout(() => {
      setIsLoading(false);
      
      // Basic validation
      if (formData.name && formData.email && formData.phone && formData.profession) {
        if (!formData.profileImage) {
          toast.warning('A profile photo is required to complete your registration.');
          return;
        }
        
        toast.success('Your profile has been submitted! We will review and get back to you soon.');
        // Redirect would happen here in a real implementation
      } else {
        toast.error('Please fill all required fields.');
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 dark:bg-gray-900 pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="p-8">
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Join as a Skilled Professional</h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Create your professional profile and connect with clients in your area
                  </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Profile Picture Upload - Enhanced */}
                  <div className="space-y-4 mb-8">
                    <h2 className="text-lg font-semibold border-b border-gray-200 dark:border-gray-700 pb-2">Profile Picture</h2>
                    <div className="flex flex-col items-center justify-center">
                      <div 
                        className="w-32 h-32 mb-4 rounded-full overflow-hidden border-2 border-primary/20 flex items-center justify-center bg-gray-100 dark:bg-gray-700 cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={handleProfileUploadClick}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, 'profileImage')}
                      >
                        {profilePreview ? (
                          <img 
                            src={profilePreview} 
                            alt="Profile Preview" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-gray-400">
                            <User className="w-12 h-12 mb-2" />
                            <span className="text-xs">Add Photo</span>
                          </div>
                        )}
                      </div>
                      <input
                        ref={fileInputRef}
                        id="profileImage"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, 'profileImage')}
                      />
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-2">
                        {formData.profileImage ? formData.profileImage.name : "Click or drag & drop to upload your profile photo"}
                      </p>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={handleProfileUploadClick}
                      >
                        Select Profile Photo
                      </Button>
                      <p className="text-xs text-primary mt-2">
                        * A profile photo is required to complete your registration
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <div className="space-y-4 md:col-span-2">
                      <h2 className="text-lg font-semibold border-b border-gray-200 dark:border-gray-700 pb-2">Personal Information</h2>
                      
                      <div className="space-y-1">
                        <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Your name"
                            className="pl-10"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          className="pl-10"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="+91 9876543210"
                          className="pl-10"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <label htmlFor="location" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Location <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <MapPin className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          id="location"
                          name="location"
                          type="text"
                          placeholder="Bengaluru, Karnataka"
                          className="pl-10"
                          value={formData.location}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    
                    {/* Professional Information */}
                    <div className="space-y-4 md:col-span-2">
                      <h2 className="text-lg font-semibold border-b border-gray-200 dark:border-gray-700 pb-2">Professional Information</h2>
                      
                      <div className="space-y-1">
                        <label htmlFor="profession" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Profession/Trade <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Briefcase className="h-5 w-5 text-gray-400" />
                          </div>
                          <Input
                            id="profession"
                            name="profession"
                            type="text"
                            placeholder="e.g., Carpenter, Electrician, Plumber"
                            className="pl-10"
                            value={formData.profession}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <label htmlFor="experience" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Years of Experience <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Clock className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          id="experience"
                          name="experience"
                          type="text"
                          placeholder="e.g., 5 years"
                          className="pl-10"
                          value={formData.experience}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <label htmlFor="hourlyRate" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Hourly Rate (₹) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <IndianRupee className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          id="hourlyRate"
                          name="hourlyRate"
                          type="text"
                          placeholder="e.g., ₹400"
                          className="pl-10"
                          value={formData.hourlyRate}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1 md:col-span-2">
                      <label htmlFor="skills" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Skills/Specializations <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Star className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          id="skills"
                          name="skills"
                          type="text"
                          placeholder="e.g., Furniture making, Cabinet installation, Home remodeling"
                          className="pl-10"
                          value={formData.skills}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Separate skills with commas</p>
                    </div>
                    
                    <div className="space-y-1 md:col-span-2">
                      <label htmlFor="about" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        About Yourself
                      </label>
                      <textarea
                        id="about"
                        name="about"
                        rows={4}
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Briefly describe your experience, specializations, and why clients should hire you..."
                        value={formData.about}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>
                    
                    {/* Resume Upload */}
                    <div className="space-y-4 md:col-span-2">
                      <h2 className="text-lg font-semibold border-b border-gray-200 dark:border-gray-700 pb-2">Resume/CV</h2>
                      
                      <div className="space-y-1">
                        <label htmlFor="resume" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Resume/CV
                        </label>
                        <div 
                          className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center"
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, 'resume')}
                        >
                          <div className="flex flex-col items-center justify-center">
                            <FileText className="h-8 w-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                              {formData.resume ? 
                                formData.resume.name : 
                                "Upload your resume (PDF format preferred)"
                              }
                            </p>
                            <input
                              id="resume"
                              type="file"
                              accept=".pdf,.doc,.docx"
                              className="hidden"
                              onChange={(e) => handleFileChange(e, 'resume')}
                            />
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm"
                              onClick={() => document.getElementById('resume')?.click()}
                            >
                              Select File
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center md:col-span-2">
                      <input
                        id="terms"
                        type="checkbox"
                        className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                        required
                      />
                      <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        I agree to the <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                      </label>
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full"></div>
                        Submitting Registration...
                      </>
                    ) : (
                      'Register as a Professional'
                    )}
                  </Button>
                </form>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Already registered?{' '}
                    <Link to="/login" className="font-medium text-primary hover:underline">
                      Sign In
                    </Link>
                  </p>
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

export default JoinAsWorker;
