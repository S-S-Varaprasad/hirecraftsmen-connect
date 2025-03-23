
import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import BasicInfoFields from './BasicInfoFields';
import ProfileImageUpload from './ProfileImageUpload';
import ResumeUpload from './ResumeUpload';

interface WorkerRegistrationFormProps {
  onSubmit: (data: any) => void;
  isUploading: boolean;
  professionOptions: { value: string; label: string }[];
  locationOptions: { value: string; label: string }[];
  languageOptions: { value: string; label: string }[];
  skillSuggestions: string[];
  setProfileImage: (file: File | null) => void;
  setResume: (file: File | null) => void;
}

const WorkerRegistrationForm = ({
  onSubmit,
  isUploading,
  professionOptions = [],
  locationOptions = [],
  languageOptions = [],
  skillSuggestions = [],
  setProfileImage,
  setResume
}: WorkerRegistrationFormProps) => {
  // Initialize the form with react-hook-form
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
    },
    mode: 'onChange', // Validate on change to catch errors early
  });

  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [resumeName, setResumeName] = useState<string | null>(null);
  
  // CRITICAL: Ensure all array props are valid arrays with useMemo
  const safeProfessionOptions = useMemo(() => {
    if (!Array.isArray(professionOptions)) {
      console.error("Invalid professionOptions:", professionOptions);
      return [];
    }
    return professionOptions;
  }, [professionOptions]);
  
  const safeLocationOptions = useMemo(() => {
    if (!Array.isArray(locationOptions)) {
      console.error("Invalid locationOptions:", locationOptions);
      return [];
    }
    return locationOptions;
  }, [locationOptions]);
  
  const safeLanguageOptions = useMemo(() => {
    if (!Array.isArray(languageOptions)) {
      console.error("Invalid languageOptions:", languageOptions);
      return [];
    }
    return languageOptions;
  }, [languageOptions]);
  
  const safeSkillSuggestions = useMemo(() => {
    if (!Array.isArray(skillSuggestions)) {
      console.error("Invalid skillSuggestions:", skillSuggestions);
      return [];
    }
    return skillSuggestions;
  }, [skillSuggestions]);
  
  // Log all props for debugging
  React.useEffect(() => {
    console.log("WorkerRegistrationForm props check:");
    console.log("professionOptions:", professionOptions?.length);
    console.log("locationOptions:", locationOptions?.length);
    console.log("languageOptions:", languageOptions?.length);
    console.log("skillSuggestions:", skillSuggestions?.length);
  }, [professionOptions, locationOptions, languageOptions, skillSuggestions]);
  
  // Stop event propagation to prevent unwanted form submissions
  const preventDefaultSubmit = (e: React.FormEvent) => {
    // Only prevent propagation for child events, not the form submission itself
    if (e.target !== e.currentTarget) {
      e.stopPropagation();
    }
  };

  // Properly handle form submission with error handling
  const onFormSubmit = (data: any) => {
    try {
      // Validate data before submission
      const validData = {
        ...data,
        // Ensure no undefined values
        name: data.name || '',
        profession: data.profession || '',
        location: data.location || '',
        experience: data.experience || '',
        hourlyRate: data.hourlyRate || '',
        skills: data.skills || '',
        languages: data.languages || '',
        about: data.about || '',
      };
      
      console.log("Form submitted with data:", validData);
      onSubmit(validData);
    } catch (error) {
      console.error("Error in form submission:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">Join as a Worker</h2>
        <form 
          onSubmit={handleSubmit(onFormSubmit)} 
          onClick={preventDefaultSubmit}
          onMouseDown={preventDefaultSubmit}
          className="space-y-6"
        >
          <ProfileImageUpload
            profileImagePreview={profileImagePreview}
            setProfileImagePreview={setProfileImagePreview}
            setProfileImage={setProfileImage}
          />
          
          <BasicInfoFields
            register={register}
            errors={errors}
            control={control}
            professionOptions={safeProfessionOptions}
            locationOptions={safeLocationOptions}
            languageOptions={safeLanguageOptions}
            skillSuggestions={safeSkillSuggestions}
          />
          
          <ResumeUpload
            resumeName={resumeName}
            setResumeName={setResumeName}
            setResume={setResume}
          />

          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 mt-4" 
            disabled={isUploading}
          >
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
  );
};

export default WorkerRegistrationForm;
