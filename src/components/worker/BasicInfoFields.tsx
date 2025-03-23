
import React, { useMemo } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ManualInputField } from '@/components/ui/manual-input-field';
import { UseFormRegister, FieldErrors, Control } from 'react-hook-form';

interface BasicInfoFieldsProps {
  register: UseFormRegister<any>;
  errors: FieldErrors;
  control: Control<any>;
  professionOptions: { value: string; label: string }[];
  locationOptions: { value: string; label: string }[];
  languageOptions: { value: string; label: string }[];
  skillSuggestions: string[];
}

const BasicInfoFields = ({
  register,
  errors,
  control,
  professionOptions = [],
  locationOptions = [],
  languageOptions = [],
  skillSuggestions = []
}: BasicInfoFieldsProps) => {
  // Extract suggestion values from option objects
  const professionSuggestions = useMemo(() => {
    if (!Array.isArray(professionOptions)) return [];
    return professionOptions.map(option => option.label || option.value);
  }, [professionOptions]);
  
  const locationSuggestions = useMemo(() => {
    if (!Array.isArray(locationOptions)) return [];
    return locationOptions.map(option => option.label || option.value);
  }, [locationOptions]);
  
  const languageSuggestions = useMemo(() => {
    if (!Array.isArray(languageOptions)) return [];
    return languageOptions.map(option => option.label || option.value);
  }, [languageOptions]);
  
  const safeSkillSuggestions = useMemo(() => {
    return Array.isArray(skillSuggestions) ? skillSuggestions : [];
  }, [skillSuggestions]);
  
  console.log('Location suggestions count:', locationSuggestions.length);

  return (
    <div className="space-y-4">
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
        {errors.name && <p className="text-red-500 text-sm mt-1">{(errors.name as any).message}</p>}
      </div>

      <div className="mb-4">
        <ManualInputField
          name="profession"
          control={control}
          label="Profession"
          placeholder="Type your profession and press Enter"
          suggestions={professionSuggestions}
          description="Select your profession or add a custom one"
          helperText="For example: Electrician, Plumber, Carpenter"
        />
      </div>

      <div className="mb-4">
        <ManualInputField
          name="location"
          control={control}
          label="Location"
          placeholder="Type your location and press Enter"
          suggestions={locationSuggestions}
          description="Select your location or add a custom one"
          helperText="For example: Mumbai, Delhi, Bangalore"
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
        {errors.experience && <p className="text-red-500 text-sm mt-1">{(errors.experience as any).message}</p>}
      </div>

      <div className="mb-4">
        <Label htmlFor="hourlyRate" className="text-base">Hourly Rate (₹)</Label>
        <div className="relative">
          <span className="absolute left-3 top-2 text-gray-500">₹</span>
          <Input
            type="text"
            id="hourlyRate"
            {...register("hourlyRate", { required: "Hourly rate is required" })}
            placeholder="e.g., 500, 1000"
            className="pl-7 mt-1"
            required
          />
        </div>
        {errors.hourlyRate && <p className="text-red-500 text-sm mt-1">{(errors.hourlyRate as any).message}</p>}
      </div>

      <div className="mb-4">
        <ManualInputField
          name="skills"
          control={control}
          label="Skills"
          placeholder="Type a skill and press Enter"
          suggestions={safeSkillSuggestions}
          description="Add your skills one by one"
          helperText="For example: Wiring, Plumbing, Carpentry"
        />
      </div>

      <div className="mb-4">
        <ManualInputField
          name="languages"
          control={control}
          label="Languages"
          placeholder="Type a language and press Enter"
          suggestions={languageSuggestions}
          description="Add languages you speak"
          helperText="For example: English, Hindi, Tamil"
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
    </div>
  );
};

export default BasicInfoFields;
