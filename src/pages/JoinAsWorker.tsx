
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

  // Validate all arrays to ensure they're always valid
  const safeIndianRegions = Array.isArray(allIndianRegions) ? allIndianRegions : [];
  const safeProfessions = Array.isArray(professions) ? professions : [];
  const safeIndianLanguages = Array.isArray(indianLanguages) ? indianLanguages : [];
  const safeSkillSuggestions = Array.isArray(skillSuggestions) ? skillSuggestions : [];

  // Convert professions to the format required by AutocompleteField
  const professionOptions = safeProfessions.map(profession => ({
    value: profession,
    label: profession,
  }));

  // Convert regions to the format required by AutocompleteField
  const locationOptions = safeIndianRegions.map(region => ({
    value: region,
    label: region,
  }));

  // Convert languages to the format required by AutocompleteField
  const languageOptions = safeIndianLanguages.map(language => ({
    value: language,
    label: language,
  }));

  useEffect(() => {
    // Log validation for debugging purposes
    console.log('Options validation:');
    console.log('Profession options:', professionOptions);
    console.log('Location options:', locationOptions);
    console.log('Language options:', languageOptions);
  }, []);

  const onSubmit = async (data: any) => {
    if (!user) {
      toast.error('You must be logged in to create a profile');
      navigate('/login');
      return;
    }

    try {
      setIsUploading(true);
      
      // Ensure we have valid data
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
