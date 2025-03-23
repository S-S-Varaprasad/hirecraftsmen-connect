
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
  options = [],
  searchable = true,
}: AutocompleteFieldProps) {
  // CRITICAL: Always validate options and provide default value
  const safeOptions = React.useMemo(() => {
    return Array.isArray(options) ? options : [];
  }, [options]);
  
  // Safer value change handler with error boundary
  const handleValueChange = (field: any, value: string) => {
    try {
      if (field && typeof field.onChange === 'function') {
        field.onChange(value);
      }
    } catch (error) {
      console.error("Error in AutocompleteField handleValueChange:", error);
    }
  };
  
  // Prevent event propagation helper
  const preventPropagation = (e: React.MouseEvent | React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
  };
  
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // Ensure field value is always a string
        const safeValue = field.value || '';
        
        return (
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
                    value={safeValue}
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
                      try {
                        if (field && typeof field.onBlur === 'function') {
                          field.onBlur();
                        }
                      } catch (error) {
                        console.error("Error in onOpenChange:", error);
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
        );
      }}
    />
  );
}
