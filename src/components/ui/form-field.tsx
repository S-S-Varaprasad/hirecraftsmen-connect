import React, { useEffect, useState } from 'react';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Combobox } from '@/components/ui/combobox';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { SearchInput } from '@/components/ui/search-input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Wand2, Loader2 } from 'lucide-react';
import { professions } from '@/utils/suggestions';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface AutocompleteFieldProps {
  name: string;
  control: any;
  label: string;
  placeholder?: string;
  description?: string;
  options: { value: string; label: string }[];
  searchable?: boolean;
}

export function AutocompleteField({
  name,
  control,
  label,
  placeholder,
  description,
  options,
  searchable = true,
}: AutocompleteFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          {searchable ? (
            <FormControl>
              <Combobox
                options={options}
                value={field.value}
                onChange={field.onChange}
                placeholder={placeholder}
              />
            </FormControl>
          ) : (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

interface SuggestiveInputFieldProps {
  name: string;
  control: any;
  label: string;
  placeholder?: string;
  description?: string;
  suggestions?: string[];
}

export function SuggestiveInputField({
  name,
  control,
  label,
  placeholder,
  description,
  suggestions = [],
}: SuggestiveInputFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <SearchInput
                suggestions={suggestions}
                placeholder={placeholder}
                value={field.value}
                onChange={(e) => {
                  if (typeof e === 'object' && e !== null && 'target' in e) {
                    field.onChange(e.target.value);
                  } else {
                    field.onChange(e);
                  }
                }}
                onSuggestionClick={(value) => {
                  field.onChange(value);
                  setTimeout(() => {
                    field.onBlur();
                  }, 100);
                }}
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg"
              />
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

interface JobDescriptionGeneratorProps {
  name: string;
  control: any;
  label: string;
  placeholder?: string;
  description?: string;
  jobTitle?: string;
}

export function JobDescriptionGenerator({
  name,
  control,
  label,
  placeholder = "Describe the job requirements, responsibilities, and other important details...",
  description,
  jobTitle = "",
}: JobDescriptionGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const extractProfession = (title: string): string => {
    if (!title) return "";
    
    const lowerTitle = title.toLowerCase();
    return professions.find(profession => 
      lowerTitle.includes(profession.toLowerCase())
    ) || "";
  };

  const generateDescription = async (title: string, setValue: (value: string) => void, currentValue: string) => {
    setIsGenerating(true);
    
    const profession = extractProfession(title);
    if (!profession) {
      toast.error("Could not identify job category. Please specify a job title first.");
      setIsGenerating(false);
      return;
    }
    
    try {
      const { data, error } = await supabase.functions.invoke("openai-chat", {
        body: { 
          prompt: `Generate a detailed, professional job description for a ${profession} position. Include required skills, responsibilities, and qualifications. The description should be comprehensive but concise, around 200 words.`,
          systemPrompt: "You are a professional job description writer with expertise in skilled trades and labor positions. Create detailed, accurate, and appealing job descriptions."
        },
      });

      if (error) {
        throw new Error(error.message || "Failed to generate description");
      }
      
      const newValue = currentValue ? `${currentValue}\n\n${data.response}` : data.response;
      setValue(newValue);
      toast.success(`Generated description for ${profession} position!`);
    } catch (error) {
      console.error("Error generating description:", error);
      toast.error("Failed to generate description. Please try again.");

      // Fallback to hardcoded descriptions if AI generation fails
      let generatedDescription = "";
      
      switch(profession.toLowerCase()) {
        case "plumber":
          generatedDescription = `Looking for an experienced Plumber to handle various plumbing installations, repairs, and maintenance tasks. The ideal candidate should have expertise in fixing leaks, unclogging drains, installing fixtures, and troubleshooting plumbing issues. Strong knowledge of plumbing codes and safety practices is required.`;
          break;
        case "electrician":
          generatedDescription = `Seeking a qualified Electrician for residential and commercial electrical work. Responsibilities include installing, maintaining, and repairing electrical systems, troubleshooting electrical issues, and ensuring all work meets safety codes and regulations. Experience with wiring, circuit breakers, and electrical panels is essential.`;
          break;
        case "carpenter":
          generatedDescription = `We need a skilled Carpenter to join our team for woodworking and construction projects. The ideal candidate will have experience in building structures, installing fixtures, and crafting wooden elements. Proficiency with various hand and power tools is required, along with knowledge of different wood types and construction methods.`;
          break;
        case "painter":
          generatedDescription = `Hiring a professional Painter for interior and exterior painting projects. The ideal candidate should have experience in surface preparation, paint application, and finishing techniques. Knowledge of different paint types, color mixing, and ability to achieve smooth, even finishes is required.`;
          break;
        case "driver":
          generatedDescription = `Looking for a reliable Driver with a clean driving record. Responsibilities include safe transportation of goods or passengers, vehicle maintenance checks, and timely delivery/pickup services. Must have valid driving license and excellent knowledge of local roads and traffic regulations.`;
          break;
        default:
          generatedDescription = `Looking for a professional ${profession} to help with various related tasks. The ideal candidate should have relevant experience, strong problem-solving skills, and attention to detail. Please share your specific requirements and expectations for this position.`;
      }
      
      const newValue = currentValue ? `${currentValue}\n\n${generatedDescription}` : generatedDescription;
      setValue(newValue);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="flex justify-between items-center">
            <FormLabel>{label}</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => generateDescription(jobTitle, field.onChange, field.value)}
              disabled={isGenerating || !jobTitle}
              className="flex items-center gap-1 text-xs h-7 px-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="h-3 w-3" />
                  Generate Description
                </>
              )}
            </Button>
          </div>
          <FormControl>
            <Textarea 
              placeholder={placeholder}
              className="min-h-[150px]"
              {...field}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
