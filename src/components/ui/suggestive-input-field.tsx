
import React from 'react';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { SearchInput } from '@/components/ui/search-input';

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
  suggestions = [], // Ensure suggestions has a default empty array
}: SuggestiveInputFieldProps) {
  // Ensure suggestions is always an array
  const safeSuggestions = Array.isArray(suggestions) ? suggestions : [];
  
  // Prevent form submission when interacting with the input
  const preventPropagation = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <div onClick={preventPropagation}>
                <SearchInput
                  suggestions={safeSuggestions}
                  placeholder={placeholder}
                  value={field.value || ''}
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
              </div>
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
