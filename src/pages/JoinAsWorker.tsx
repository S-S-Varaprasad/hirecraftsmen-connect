
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useWorkerProfiles } from '@/hooks/useWorkerProfiles';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { 
  allIndianRegions, 
  professions, 
  indianLanguages, 
  skills as skillSuggestions,
} from '@/utils/suggestions';
import WorkerRegistrationForm from '@/components/worker/WorkerRegistrationForm';

const JoinAsWorker = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createWorkerProfile } = useWorkerProfiles();

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [resume, setResume] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Convert arrays to the format required by inputs
  // With proper fallbacks if they're undefined
  const professionOptions = (professions || []).map(profession => ({
    value: profession,
    label: profession,
  }));

  const locationOptions = (allIndianRegions || []).map(region => ({
    value: region,
    label: region,
  }));

  const languageOptions = (indianLanguages || []).map(language => ({
    value: language,
    label: language,
  }));

  const onSubmit = async (data: any) => {
    if (!user) {
      toast.error('You must be logged in to create a profile');
      navigate('/login');
      return;
    }

    try {
      setIsUploading(true);
      
      // Log the data before submission to help with debugging
      console.log('Submitting worker profile with data:', data);
      
      const result = await createWorkerProfile.mutateAsync({
        name: data.name || '',
        profession: data.profession || '',
        location: data.location || '',
        experience: data.experience || '',
        hourlyRate: data.hourlyRate || '',
        skills: data.skills || '',
        languages: data.languages || '',
        about: data.about || '',
        profileImage: profileImage,
        resume: resume,
      });

      setIsUploading(false);
      toast.success('Profile created successfully! Please login to access your account.');
      
      // Always navigate to login page after creating profile
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
          <WorkerRegistrationForm
            onSubmit={onSubmit}
            isUploading={isUploading}
            professionOptions={professionOptions}
            locationOptions={locationOptions}
            languageOptions={languageOptions}
            skillSuggestions={skillSuggestions || []}
            setProfileImage={setProfileImage}
            setResume={setResume}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default JoinAsWorker;
