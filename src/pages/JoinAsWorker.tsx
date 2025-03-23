
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
        setProfileImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfileImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else if (type === 'resume') {
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

      toast.success('Profile created successfully! Please login to access your account.');
      // Navigate to login page after creating profile
      navigate('/login');
    } catch (error: any) {
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
                  <Label htmlFor="profileImage" className="text-base">Profile Image</Label>
                  <Input
                    type="file"
                    id="profileImage"
                    name="profileImage"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'profileImage')}
                    className="mt-1"
                  />
                  {profileImagePreview && (
                    <div className="mt-2">
                      <img
                        src={profileImagePreview}
                        alt="Profile Preview"
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    </div>
                  )}
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

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  Create Profile
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
