
import React from 'react';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Combobox } from '@/components/ui/combobox';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { SearchInput } from '@/components/ui/search-input';

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
      render={({ field }) => (
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
                // Trigger field.onBlur to mark the field as touched
                setTimeout(() => field.onBlur(), 100);
              }}
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg"
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
