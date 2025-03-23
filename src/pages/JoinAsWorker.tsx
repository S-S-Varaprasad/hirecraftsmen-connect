
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
  const [isInitializing, setIsInitializing] = useState(true);

  // Log all data sources to help debugging
  useEffect(() => {
    console.log("Data sources initial check:");
    console.log("allIndianRegions:", allIndianRegions);
    console.log("professions:", professions);
    console.log("indianLanguages:", indianLanguages);
    console.log("skillSuggestions:", skillSuggestions);
  }, []);

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
  // Added fallback to empty array to fix "undefined is not iterable" error
  const professionOptions = React.useMemo(() => {
    if (!Array.isArray(safeProfessions)) {
      console.error("professions is not an array:", safeProfessions);
      return [];
    }
    return safeProfessions.map(profession => ({
      value: profession,
      label: profession,
    }));
  }, [safeProfessions]);

  // Convert regions to the format required by AutocompleteField
  // Added fallback to empty array to fix "undefined is not iterable" error
  const locationOptions = React.useMemo(() => {
    if (!Array.isArray(safeIndianRegions)) {
      console.error("allIndianRegions is not an array:", safeIndianRegions);
      return [];
    }
    return safeIndianRegions.map(region => ({
      value: region,
      label: region,
    }));
  }, [safeIndianRegions]);

  // Convert languages to the format required by AutocompleteField
  // Added fallback to empty array to fix "undefined is not iterable" error
  const languageOptions = React.useMemo(() => {
    if (!Array.isArray(safeIndianLanguages)) {
      console.error("indianLanguages is not an array:", safeIndianLanguages);
      return [];
    }
    return safeIndianLanguages.map(language => ({
      value: language,
      label: language,
    }));
  }, [safeIndianLanguages]);

  useEffect(() => {
    // Add a delay to ensure all arrays are properly initialized
    const timer = setTimeout(() => {
      // Set form as ready once all arrays are properly initialized
      setIsFormReady(true);
      setIsInitializing(false);
      
      // Log validation for debugging purposes
      console.log('Options validation (processed):');
      console.log('Profession options:', professionOptions);
      console.log('Location options:', locationOptions);
      console.log('Language options:', languageOptions);
    }, 500);
    
    return () => clearTimeout(timer);
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

  if (isInitializing) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-orange-50/40 dark:bg-gray-900 pt-32 pb-16">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent border-primary align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
            </div>
            <p className="mt-4 text-lg">Initializing form...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isFormReady) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-orange-50/40 dark:bg-gray-900 pt-32 pb-16">
          <div className="container mx-auto px-4 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-app-orange mx-auto"></div>
            <p className="mt-4">Loading form...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Double-check that all options arrays are valid before rendering the form
  if (!Array.isArray(professionOptions) || !Array.isArray(locationOptions) || !Array.isArray(languageOptions)) {
    console.error("Critical error: Options arrays are not valid", {
      professionOptions,
      locationOptions,
      languageOptions
    });
    
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-orange-50/40 dark:bg-gray-900 pt-32 pb-16">
          <div className="container mx-auto px-4 text-center">
            <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <h3 className="text-xl font-semibold text-red-600 dark:text-red-400">Error Loading Form</h3>
              <p className="mt-2">There was an error initializing the form data. Please try refreshing the page.</p>
            </div>
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
