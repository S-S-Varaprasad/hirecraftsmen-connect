
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AutocompleteField } from '@/components/ui/autocomplete-field';
import { SuggestiveInputField } from '@/components/ui/suggestive-input-field';
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
  // Ensure all array props are valid arrays - CRITICAL for preventing undefined is not iterable errors
  const safeProfessionOptions = Array.isArray(professionOptions) ? professionOptions : [];
  const safeLocationOptions = Array.isArray(locationOptions) ? locationOptions : [];
  const safeLanguageOptions = Array.isArray(languageOptions) ? languageOptions : [];
  const safeSkillSuggestions = Array.isArray(skillSuggestions) ? skillSuggestions : [];
  
  // Prevent form submission when interacting with fields
  const preventPropagation = (e: React.MouseEvent | React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
  };
  
  return (
    <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
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

      <div className="mb-4 autocomplete-field-wrapper" 
        onClick={preventPropagation} 
        onMouseDown={preventPropagation}
      >
        <AutocompleteField
          name="profession"
          control={control}
          label="Profession"
          placeholder="e.g., Electrician, Plumber"
          options={safeProfessionOptions}
          description="Select your profession from the list or type to search"
        />
      </div>

      <div className="mb-4 autocomplete-field-wrapper" 
        onClick={preventPropagation} 
        onMouseDown={preventPropagation}
      >
        <AutocompleteField
          name="location"
          control={control}
          label="Location"
          placeholder="Your City, State"
          options={safeLocationOptions}
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

      <div className="mb-4 suggestive-field-wrapper" 
        onClick={preventPropagation} 
        onMouseDown={preventPropagation}
      >
        <SuggestiveInputField
          name="skills"
          control={control}
          label="Skills"
          placeholder="e.g., Wiring, Plumbing, Carpentry"
          suggestions={safeSkillSuggestions}
          description="List your skills, separated by commas"
        />
      </div>

      <div className="mb-4 autocomplete-field-wrapper" 
        onClick={preventPropagation} 
        onMouseDown={preventPropagation}
      >
        <AutocompleteField
          name="languages"
          control={control}
          label="Languages"
          placeholder="English, Hindi, Tamil"
          options={safeLanguageOptions}
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
    </div>
  );
};

export default BasicInfoFields;
