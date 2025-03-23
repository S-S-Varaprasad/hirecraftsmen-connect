
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
  options,
  searchable = true,
}: AutocompleteFieldProps) {
  // Validate options to ensure it's always an array
  const safeOptions = Array.isArray(options) ? options : [];
  
  // Safer value change handler to prevent form submission
  const handleValueChange = (field: any, value: string) => {
    if (field && typeof field.onChange === 'function') {
      field.onChange(value);
    }
  };
  
  // Prevent event propagation to avoid form submission
  const preventPropagation = (e: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
  };
  
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>{label}</FormLabel>
          {searchable ? (
            <FormControl>
              <div 
                onClick={preventPropagation}
                onMouseDown={preventPropagation}
                className="form-control-wrapper"
              >
                <Combobox
                  options={safeOptions}
                  value={field.value || ''}
                  onChange={(value) => handleValueChange(field, value)}
                  placeholder={placeholder}
                  triggerClassName="w-full"
                />
              </div>
            </FormControl>
          ) : (
            <Select 
              onValueChange={(value) => handleValueChange(field, value)} 
              defaultValue={field.value || ''}
              onOpenChange={(open) => {
                // Prevent form submission when opening/closing the select
                if (open) {
                  setTimeout(() => {
                    if (field && typeof field.onBlur === 'function') {
                      field.onBlur();
                    }
                  }, 100);
                }
              }}
            >
              <FormControl>
                <SelectTrigger onClick={preventPropagation} onMouseDown={preventPropagation}>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent onClick={preventPropagation} onMouseDown={preventPropagation}>
                {safeOptions.map((option) => (
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
