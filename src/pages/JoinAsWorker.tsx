
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
  const [isFormReady, setIsFormReady] = useState(false);

  // CRITICAL: Validate all arrays to ensure they're always valid 
  // This is key to fixing the "undefined is not iterable" error
  const safeIndianRegions = React.useMemo(() => 
    Array.isArray(allIndianRegions) ? allIndianRegions : [], 
  []);
  
  const safeProfessions = React.useMemo(() => 
    Array.isArray(professions) ? professions : [],
  []);
  
  const safeIndianLanguages = React.useMemo(() => 
    Array.isArray(indianLanguages) ? indianLanguages : [],
  []);
  
  const safeSkillSuggestions = React.useMemo(() => 
    Array.isArray(skillSuggestions) ? skillSuggestions : [],
  []);

  // Convert professions to the format required by AutocompleteField
  const professionOptions = React.useMemo(() => 
    safeProfessions.map(profession => ({
      value: profession,
      label: profession,
    })),
  [safeProfessions]);

  // Convert regions to the format required by AutocompleteField
  const locationOptions = React.useMemo(() => 
    safeIndianRegions.map(region => ({
      value: region,
      label: region,
    })),
  [safeIndianRegions]);

  // Convert languages to the format required by AutocompleteField
  const languageOptions = React.useMemo(() => 
    safeIndianLanguages.map(language => ({
      value: language,
      label: language,
    })),
  [safeIndianLanguages]);

  useEffect(() => {
    // Set form as ready once all arrays are properly initialized
    setIsFormReady(true);
    
    // Log validation for debugging purposes
    console.log('Options validation:');
    console.log('Profession options:', professionOptions);
    console.log('Location options:', locationOptions);
    console.log('Language options:', languageOptions);
  }, [professionOptions, locationOptions, languageOptions]);

  const onSubmit = async (data: any) => {
    if (!user) {
      toast.error('You must be logged in to create a profile');
      navigate('/login');
      return;
    }

    try {
      setIsUploading(true);
      
      // Ensure we have valid data with fallbacks
      const validatedData = {
        name: data.name || '',
        profession: data.profession || '',
        location: data.location || '',
        experience: data.experience || '',
        hourlyRate: data.hourlyRate || '',
        skills: data.skills || '',
        languages: data.languages || '',
        about: data.about || '',
      };
      
      // Log the data before submission to help with debugging
      console.log('Submitting worker profile with data:', validatedData);
      
      const result = await createWorkerProfile.mutateAsync({
        name: validatedData.name,
        profession: validatedData.profession,
        location: validatedData.location,
        experience: validatedData.experience,
        hourlyRate: validatedData.hourlyRate,
        skills: validatedData.skills,
        languages: validatedData.languages,
        about: validatedData.about,
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

  if (!isFormReady) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-orange-50/40 dark:bg-gray-900 pt-32 pb-16">
          <div className="container mx-auto px-4 text-center">
            Loading form...
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
            skillSuggestions={safeSkillSuggestions}
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
