
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useWorkerProfiles } from '@/hooks/useWorkerProfiles';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { AutocompleteField, SuggestiveInputField } from '@/components/ui/form-field';
import { 
  allIndianRegions, 
  professions, 
  indianLanguages, 
  skills as skillSuggestions,
} from '@/utils/suggestions';
import { useForm } from 'react-hook-form';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Camera, Upload } from 'lucide-react';

const JoinAsWorker = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createWorkerProfile } = useWorkerProfiles();

  // React Hook Form setup
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      profession: '',
      location: '',
      experience: '',
      hourlyRate: '',
      skills: '',
      languages: '',
      about: '',
    }
  });

  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [resumeName, setResumeName] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [resume, setResume] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Convert professions to the format required by AutocompleteField
  const professionOptions = professions.map(profession => ({
    value: profession,
    label: profession,
  }));

  // Convert regions to the format required by AutocompleteField
  const locationOptions = allIndianRegions.map(region => ({
    value: region,
    label: region,
  }));

  // Convert languages to the format required by AutocompleteField
  const languageOptions = indianLanguages.map(language => ({
    value: language,
    label: language,
  }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'profileImage' | 'resume') => {
    const file = e.target.files && e.target.files[0];

    if (file) {
      if (type === 'profileImage') {
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error('Profile image must be smaller than 5MB');
          return;
        }
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.error('File must be an image');
          return;
        }
        
        setProfileImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfileImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else if (type === 'resume') {
        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          toast.error('Resume must be smaller than 10MB');
          return;
        }
        
        // Validate file type
        const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!validTypes.includes(file.type)) {
          toast.error('Resume must be a PDF or Word document');
          return;
        }
        
        setResume(file);
        setResumeName(file.name);
      }
    }
  };

  const onSubmit = async (data: any) => {
    if (!user) {
      toast.error('You must be logged in to create a profile');
      navigate('/login');
      return;
    }

    try {
      setIsUploading(true);
      
      const result = await createWorkerProfile.mutateAsync({
        name: data.name,
        profession: data.profession,
        location: data.location,
        experience: data.experience,
        hourlyRate: data.hourlyRate,
        skills: data.skills,
        languages: data.languages,
        about: data.about,
        profileImage: profileImage,
        resume: resume,
      });

      setIsUploading(false);
      toast.success('Profile created successfully! Please login to access your account.');
      // Navigate to login page after creating profile
      navigate('/login');
    } catch (error: any) {
      setIsUploading(false);
      console.error('Error creating worker profile:', error);
      toast.error(error?.message || 'Failed to create worker profile');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow bg-orange-50/40 dark:bg-gray-900 pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="px-8 py-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">Join as a Worker</h2>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex justify-center mb-6">
                  <div className="relative group cursor-pointer">
                    <Avatar className="w-24 h-24 border-4 border-gray-100">
                      {profileImagePreview ? (
                        <AvatarImage src={profileImagePreview} alt="Profile Preview" />
                      ) : (
                        <AvatarFallback className="bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <Camera className="h-8 w-8 text-gray-400" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Upload className="h-6 w-6 text-white" />
                    </div>
                    <input
                      type="file"
                      id="profileImage"
                      name="profileImage"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'profileImage')}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
                <p className="text-center text-sm text-gray-500 mb-6">Click the avatar to upload your profile picture</p>

                <div className="mb-4">
                  <Label htmlFor="name" className="text-base">Full Name</Label>
                  <Input
                    type="text"
                    id="name"
                    {...register("name", { required: "Name is required" })}
                    placeholder="Your Full Name"
                    className="mt-1"
                    required
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>

                <div className="mb-4">
                  <AutocompleteField
                    name="profession"
                    control={control}
                    label="Profession"
                    placeholder="e.g., Electrician, Plumber"
                    options={professionOptions}
                    description="Select your profession from the list or type to search"
                  />
                </div>

                <div className="mb-4">
                  <AutocompleteField
                    name="location"
                    control={control}
                    label="Location"
                    placeholder="Your City, State"
                    options={locationOptions}
                    description="Select your location from the list or type to search"
                  />
                </div>

                <div className="mb-4">
                  <Label htmlFor="experience" className="text-base">Years of Experience</Label>
                  <Input
                    type="text"
                    id="experience"
                    {...register("experience", { required: "Experience is required" })}
                    placeholder="e.g., 5 years, 10+ years"
                    className="mt-1"
                    required
                  />
                </div>

                <div className="mb-4">
                  <Label htmlFor="hourlyRate" className="text-base">Hourly Rate</Label>
                  <Input
                    type="text"
                    id="hourlyRate"
                    {...register("hourlyRate", { required: "Hourly rate is required" })}
                    placeholder="e.g., $25/hr, $40/hr"
                    className="mt-1"
                    required
                  />
                </div>

                <div className="mb-4">
                  <SuggestiveInputField
                    name="skills"
                    control={control}
                    label="Skills"
                    placeholder="e.g., Wiring, Plumbing, Carpentry"
                    suggestions={skillSuggestions}
                    description="List your skills, separated by commas"
                  />
                </div>

                <div className="mb-4">
                  <AutocompleteField
                    name="languages"
                    control={control}
                    label="Languages"
                    placeholder="English, Hindi, Tamil"
                    options={languageOptions}
                    description="Select languages you speak"
                    searchable={true}
                  />
                </div>

                <div className="mb-4">
                  <Label htmlFor="about" className="text-base">About</Label>
                  <Textarea
                    id="about"
                    {...register("about")}
                    placeholder="Tell us about yourself"
                    className="mt-1"
                    rows={4}
                  />
                </div>

                <div className="mb-4">
                  <Label htmlFor="resume" className="text-base">Resume</Label>
                  <Input
                    type="file"
                    id="resume"
                    name="resume"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileChange(e, 'resume')}
                    className="mt-1"
                  />
                  {resumeName && (
                    <p className="mt-1 text-sm text-gray-500">Selected: {resumeName}</p>
                  )}
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isUploading}>
                  {isUploading ? 'Creating Profile...' : 'Create Profile'}
                </Button>
              </form>
              <div className="mt-6 text-center">
                <Link to="/login" className="text-sm text-gray-600 dark:text-gray-400 hover:underline">
                  Already have an account? Login
                </Link>
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
