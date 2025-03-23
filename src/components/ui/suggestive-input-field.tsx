
import React, { useMemo } from 'react';
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
  suggestions = [], 
}: SuggestiveInputFieldProps) {
  // CRITICAL: Memoize the suggestions array to ensure it's always valid
  const safeSuggestions = useMemo(() => {
    if (!Array.isArray(suggestions)) {
      console.error("suggestions is not an array in SuggestiveInputField:", suggestions);
      return [];
    }
    return suggestions;
  }, [suggestions]);
  
  // Ref to track if component is mounted
  const isMounted = React.useRef(true);
  
  // Clean up on unmount
  React.useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  // Prevent form submission when interacting with the input
  const preventPropagation = (e: React.MouseEvent | React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // Log validation for debugging
  React.useEffect(() => {
    console.log(`SuggestiveInputField (${name}) - safeSuggestions:`, safeSuggestions?.length);
  }, [name, safeSuggestions]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // Ensure field.value is a string
        const safeValue = field.value || '';
        
        return (
          <FormItem>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <div 
                onClick={preventPropagation} 
                onMouseDown={preventPropagation}
                className="form-control-wrapper"
              >
                <SearchInput
                  suggestions={safeSuggestions}
                  placeholder={placeholder}
                  value={safeValue}
                  onChange={(e) => {
                    try {
                      if (typeof e === 'object' && e !== null && 'target' in e) {
                        if (isMounted.current) {
                          field.onChange(e.target.value || '');
                        }
                      } else if (typeof e === 'string') {
                        if (isMounted.current) {
                          field.onChange(e);
                        }
                      } else {
                        if (isMounted.current) {
                          field.onChange('');
                        }
                      }
                    } catch (error) {
                      console.error("Error in onChange handler:", error);
                    }
                  }}
                  onSuggestionClick={(value) => {
                    try {
                      if (isMounted.current) {
                        field.onChange(value || '');
                        setTimeout(() => {
                          if (typeof field.onBlur === 'function' && isMounted.current) {
                            field.onBlur();
                          }
                        }, 100);
                      }
                    } catch (error) {
                      console.error("Error in onSuggestionClick:", error);
                    }
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
