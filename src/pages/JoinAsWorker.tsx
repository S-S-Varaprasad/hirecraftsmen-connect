
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

const JoinAsWorker = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createWorkerProfile } = useWorkerProfiles();

  const [formData, setFormData] = useState({
    name: '',
    profession: '',
    location: '',
    experience: '',
    hourlyRate: '',
    skills: '',
    languages: '',
    about: '',
    profileImage: null,
    resume: null,
  });
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [resumeName, setResumeName] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'profileImage' | 'resume') => {
    const file = e.target.files && e.target.files[0];

    if (file) {
      setFormData(prev => ({
        ...prev,
        [type]: file,
      }));

      if (type === 'profileImage') {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfileImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else if (type === 'resume') {
        setResumeName(file.name);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('You must be logged in to create a profile');
      navigate('/login');
      return;
    }

    try {
      const result = await createWorkerProfile.mutateAsync({
        name: formData.name,
        profession: formData.profession,
        location: formData.location,
        experience: formData.experience,
        hourlyRate: formData.hourlyRate,
        skills: formData.skills,
        languages: formData.languages,
        about: formData.about,
        profileImage: formData.profileImage,
        resume: formData.resume,
      });

      toast.success('Profile created successfully!');
      // Navigate to workers page after creating profile to see it listed
      navigate('/workers');
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
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <Label htmlFor="name" className="text-base">Full Name</Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Your Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1"
                    required
                  />
                </div>
                <div className="mb-4">
                  <Label htmlFor="profession" className="text-base">Profession</Label>
                  <Input
                    type="text"
                    id="profession"
                    name="profession"
                    placeholder="e.g., Electrician, Plumber"
                    value={formData.profession}
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
                    placeholder="Your City, State"
                    value={formData.location}
                    onChange={handleChange}
                    className="mt-1"
                    required
                  />
                </div>
                <div className="mb-4">
                  <Label htmlFor="experience" className="text-base">Years of Experience</Label>
                  <Input
                    type="text"
                    id="experience"
                    name="experience"
                    placeholder="e.g., 5 years, 10+ years"
                    value={formData.experience}
                    onChange={handleChange}
                    className="mt-1"
                    required
                  />
                </div>
                <div className="mb-4">
                  <Label htmlFor="hourlyRate" className="text-base">Hourly Rate</Label>
                  <Input
                    type="text"
                    id="hourlyRate"
                    name="hourlyRate"
                    placeholder="e.g., $25/hr, $40/hr"
                    value={formData.hourlyRate}
                    onChange={handleChange}
                    className="mt-1"
                    required
                  />
                </div>
                <div className="mb-4">
                  <Label htmlFor="skills" className="text-base">Skills</Label>
                  <Input
                    type="text"
                    id="skills"
                    name="skills"
                    placeholder="e.g., Wiring, Plumbing, Carpentry (comma separated)"
                    value={formData.skills}
                    onChange={handleChange}
                    className="mt-1"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">List your skills, separated by commas</p>
                </div>
                <div className="mb-4">
                  <Label htmlFor="languages" className="text-base">Languages</Label>
                  <Input
                    type="text"
                    id="languages"
                    name="languages"
                    placeholder="English, Spanish, French (comma separated)"
                    value={formData.languages}
                    onChange={handleChange}
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">List languages you speak, separated by commas</p>
                </div>
                <div className="mb-4">
                  <Label htmlFor="about" className="text-base">About</Label>
                  <Textarea
                    id="about"
                    name="about"
                    placeholder="Tell us about yourself"
                    value={formData.about}
                    onChange={handleChange}
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
