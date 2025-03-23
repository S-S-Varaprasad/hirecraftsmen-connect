
import * as React from "react"

interface UseSearchInputProps {
  suggestions?: string[]
  value?: string | number
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSuggestionClick?: (value: string) => void
}

export function useSearchInput({
  suggestions = [],
  value = "",
  onChange,
  onSuggestionClick
}: UseSearchInputProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState(value.toString())
  const [filteredSuggestions, setFilteredSuggestions] = React.useState<string[]>([])
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const suggestionsRef = React.useRef<HTMLDivElement>(null)
  const isMounted = React.useRef(true)

  // CRITICAL: Ensure suggestions is always an array - this is the key fix
  const safeSuggestions = React.useMemo(() => {
    if (!Array.isArray(suggestions)) {
      console.error("suggestions is not an array in useSearchInput:", suggestions);
      return [];
    }
    return suggestions;
  }, [suggestions]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Update inputValue when props.value changes
  React.useEffect(() => {
    if (value !== undefined && isMounted.current) {
      setInputValue(value.toString())
    }
  }, [value])

  // Filter suggestions based on input value
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (!isMounted.current) return;
      
      if (inputValue.trim()) {
        try {
          // Check again that safeSuggestions is an array before filtering
          if (!Array.isArray(safeSuggestions)) {
            console.error("safeSuggestions is not an array in filter effect:", safeSuggestions);
            setFilteredSuggestions([]);
            setOpen(false);
            return;
          }
          
          const filtered = safeSuggestions.filter(suggestion => 
            suggestion.toLowerCase().includes(inputValue.toLowerCase())
          );
          
          if (isMounted.current) {
            setFilteredSuggestions(filtered.slice(0, 8)); // Limit to 8 suggestions
            setOpen(filtered.length > 0);
            setHighlightedIndex(-1); // Reset highlighted index when suggestions change
          }
        } catch (error) {
          console.error("Error filtering suggestions:", error);
          if (isMounted.current) {
            setFilteredSuggestions([]);
            setOpen(false);
          }
        }
      } else {
        if (isMounted.current) {
          setFilteredSuggestions([]);
          setOpen(false);
        }
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [inputValue, safeSuggestions]);

  // Close suggestions when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current && 
        !inputRef.current.contains(event.target as Node)
      ) {
        if (isMounted.current) {
          setOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;
    
    try {
      // Ensure filteredSuggestions is an array before using its length
      if (!Array.isArray(filteredSuggestions)) {
        console.error("filteredSuggestions is not an array in handleKeyDown:", filteredSuggestions);
        return;
      }
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (isMounted.current) {
            setHighlightedIndex(prev => 
              prev < filteredSuggestions.length - 1 ? prev + 1 : 0
            );
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (isMounted.current) {
            setHighlightedIndex(prev => 
              prev > 0 ? prev - 1 : filteredSuggestions.length - 1
            );
          }
          break;
        case 'Enter':
          e.preventDefault();
          if (highlightedIndex >= 0 && highlightedIndex < filteredSuggestions.length) {
            handleSuggestionClick(filteredSuggestions[highlightedIndex]);
          }
          break;
        case 'Escape':
          if (isMounted.current) {
            setOpen(false);
          }
          break;
      }
    } catch (error) {
      console.error("Error in keyboard navigation:", error);
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const value = e.target.value;
      if (isMounted.current) {
        setInputValue(value);
      }
      
      if (onChange) {
        onChange(e);
      }
    } catch (error) {
      console.error("Error in input change handler:", error);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (value: string) => {
    try {
      if (isMounted.current) {
        setInputValue(value);
        setOpen(false);
      }
      
      // Create a synthetic event that accurately mimics a real input event
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
      )?.set;
      
      if (inputRef.current && nativeInputValueSetter) {
        nativeInputValueSetter.call(inputRef.current, value);
        
        const event = new Event('input', { bubbles: true });
        inputRef.current.dispatchEvent(event);
      }
      
      // Also call the custom handlers to ensure both React's synthetic events and custom handlers work
      if (onChange) {
        const syntheticEvent = {
          target: { value },
          currentTarget: { value }
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
      
      if (onSuggestionClick) {
        onSuggestionClick(value);
      }
    } catch (error) {
      console.error("Error in suggestion click handler:", error);
    }
  };

  return {
    open,
    inputValue,
    filteredSuggestions,
    highlightedIndex,
    inputRef,
    suggestionsRef,
    handleKeyDown,
    handleInputChange,
    handleSuggestionClick,
    setOpen
  };
}
