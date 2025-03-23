
import React from 'react';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Combobox } from '@/components/ui/combobox';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

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
  options = [], // Ensure options has a default empty array
  searchable = true,
}: AutocompleteFieldProps) {
  // Handle value change without triggering form submission
  const handleValueChange = (field: any, value: string) => {
    field.onChange(value);
  };
  
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
                options={options || []} // Ensure options is never undefined
                value={field.value}
                onChange={(value) => handleValueChange(field, value)}
                placeholder={placeholder}
              />
            </FormControl>
          ) : (
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
              onOpenChange={(open) => {
                // Prevent event propagation when opening/closing the select
                if (open) {
                  setTimeout(() => field.onBlur(), 100);
                }
              }}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {(options || []).map((option) => (
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
