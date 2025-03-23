
import React, { useState, useEffect } from 'react';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface ManualInputFieldProps {
  name: string;
  control: any;
  label: string;
  placeholder?: string;
  description?: string;
  suggestions?: string[];
  helperText?: string;
}

export function ManualInputField({
  name,
  control,
  label,
  placeholder,
  description,
  suggestions = [],
  helperText,
}: ManualInputFieldProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  
  // Ensure suggestions is always an array
  const safeSuggestions = Array.isArray(suggestions) ? suggestions : [];
  
  // Filter suggestions based on input
  useEffect(() => {
    if (inputValue.trim() === '') {
      setFilteredSuggestions([]);
      return;
    }
    
    const filtered = safeSuggestions.filter(
      suggestion => suggestion.toLowerCase().includes(inputValue.toLowerCase())
    ).slice(0, 5); // Limit to 5 suggestions
    
    setFilteredSuggestions(filtered);
  }, [inputValue, safeSuggestions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (e.target.value.trim() !== '') {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string, onChange: (value: string) => void) => {
    onChange(suggestion);
    setInputValue('');
    setShowSuggestions(false);
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // Split comma-separated values
        const values = field.value ? field.value.split(',').map((v: string) => v.trim()).filter(Boolean) : [];
        
        // Function to add a value
        const addValue = (value: string) => {
          if (!value.trim()) return;
          
          // Don't add duplicates
          if (values.includes(value.trim())) return;
          
          const newValue = [...values, value.trim()].join(', ');
          field.onChange(newValue);
        };
        
        // Function to remove a value
        const removeValue = (index: number) => {
          const newValues = [...values];
          newValues.splice(index, 1);
          field.onChange(newValues.join(', '));
        };
        
        return (
          <FormItem className="w-full">
            <FormLabel>{label}</FormLabel>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1 mb-2">
                {values.map((value: string, index: number) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {value}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeValue(index)}
                    />
                  </Badge>
                ))}
              </div>
              
              <div className="relative">
                <FormControl>
                  <Input
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && inputValue.trim()) {
                        e.preventDefault();
                        addValue(inputValue);
                        setInputValue('');
                      }
                    }}
                    onFocus={() => {
                      if (inputValue.trim() !== '') {
                        setShowSuggestions(true);
                      }
                    }}
                    onBlur={() => {
                      // Delay hiding suggestions to allow clicks
                      setTimeout(() => setShowSuggestions(false), 200);
                    }}
                  />
                </FormControl>
                
                {showSuggestions && filteredSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-48 overflow-y-auto">
                    <ul className="py-1">
                      {filteredSuggestions.map((suggestion, index) => (
                        <li
                          key={index}
                          className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                          onMouseDown={(e) => {
                            e.preventDefault(); // Prevent blur
                            handleSuggestionClick(suggestion, addValue);
                          }}
                        >
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            
            {helperText && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {helperText}
              </p>
            )}
            
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
