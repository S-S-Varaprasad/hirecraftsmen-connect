import React from 'react';
import { Worker } from '@/services/workerService';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ProfileImageUpload from './ProfileImageUpload';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Save, X } from 'lucide-react';

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  profession: z.string().min(2, "Profession is required"),
  location: z.string().min(2, "Location is required"),
  experience: z.string().min(1, "Experience is required"),
  hourly_rate: z.string().min(1, "Hourly rate is required"),
  about: z.string().optional(),
  skills: z.string().optional(),
  languages: z.string().optional(),
  is_available: z.boolean().default(true)
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileEditFormProps {
  worker: Worker;
  onSubmit: (data: ProfileFormValues) => Promise<void>;
  onCancel: () => void;
  onImageUpload: (file: File) => Promise<void>;
  onImageRemove: () => Promise<void>;
  uploading: boolean;
}

const ProfileEditForm = ({
  worker,
  onSubmit,
  onCancel,
  onImageUpload,
  onImageRemove,
  uploading
}: ProfileEditFormProps) => {
  const formatHourlyRate = (rate: string) => {
    if (!rate) return '';
    
    const cleanedRate = rate.replace(/[₹$€£]/g, '').trim();
    return cleanedRate;
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: worker.name,
      profession: worker.profession,
      location: worker.location,
      experience: worker.experience,
      hourly_rate: formatHourlyRate(worker.hourly_rate),
      about: worker.about || '',
      skills: worker.skills.join(', '),
      languages: worker.languages.join(', '),
      is_available: worker.is_available
    }
  });

  const handleSubmit = async (data: ProfileFormValues) => {
    const formattedData = {
      ...data,
      hourly_rate: data.hourly_rate.startsWith('₹') 
        ? data.hourly_rate 
        : `₹${data.hourly_rate}`
    };
    
    await onSubmit(formattedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <ProfileImageUpload 
          worker={worker} 
          isEditing={true} 
          onImageUpload={onImageUpload} 
          onImageRemove={onImageRemove} 
          uploading={uploading}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="profession"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profession</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Years of Experience</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="hourly_rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hourly Rate (₹)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">₹</span>
                    <Input {...field} className="pl-7" placeholder="500" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="skills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Skills (comma separated)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  Enter skills separated by commas
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="languages"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Languages (comma separated)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  Enter languages separated by commas
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="about"
          render={({ field }) => (
            <FormItem>
              <FormLabel>About</FormLabel>
              <FormControl>
                <Textarea {...field} rows={4} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="is_available"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  id="is_available"
                  className="rounded border-gray-300"
                />
              </FormControl>
              <FormLabel htmlFor="is_available" className="!mt-0">Available for work</FormLabel>
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2">
          <Button 
            type="button"
            variant="outline" 
            onClick={onCancel}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button 
            type="submit"
            variant="orange" 
            className="flex items-center gap-1"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfileEditForm;
