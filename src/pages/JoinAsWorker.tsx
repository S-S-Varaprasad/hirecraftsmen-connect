
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
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Process location options with useMemo to prevent unnecessary recalculations
  const locationOptions = React.useMemo(() => {
    // Make sure we have valid data before mapping
    if (!Array.isArray(allIndianRegions) || allIndianRegions.length === 0) {
      console.warn('allIndianRegions is not a valid array');
      return [];
    }
    
    return allIndianRegions.map(region => ({
      value: region,
      label: region,
    }));
  }, []);

  // Convert arrays to the format required by inputs with proper fallbacks
  const professionOptions = React.useMemo(() => {
    if (!Array.isArray(professions) || professions.length === 0) {
      console.warn('professions is not a valid array');
      return [];
    }
    
    return professions.map(profession => ({
      value: profession,
      label: profession,
    }));
  }, []);

  const languageOptions = React.useMemo(() => {
    if (!Array.isArray(indianLanguages) || indianLanguages.length === 0) {
      console.warn('indianLanguages is not a valid array');
      return [];
    }
    
    return indianLanguages.map(language => ({
      value: language,
      label: language,
    }));
  }, []);
  
  // Make sure skillSuggestions is a valid array
  const safeSkillSuggestions = React.useMemo(() => {
    return Array.isArray(skillSuggestions) ? skillSuggestions : [];
  }, []);

  // Simulate loading to ensure all data is prepared before rendering the form
  useEffect(() => {
    // Short timeout to ensure data is processed
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

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
        resume: null, // Always pass null as we've removed resume upload
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
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <WorkerRegistrationForm
              onSubmit={onSubmit}
              isUploading={isUploading}
              professionOptions={professionOptions}
              locationOptions={locationOptions}
              languageOptions={languageOptions}
              skillSuggestions={safeSkillSuggestions}
              setProfileImage={setProfileImage}
              setResume={() => {}} // Keep the prop but make it a no-op function
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default JoinAsWorker;
