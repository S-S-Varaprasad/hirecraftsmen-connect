
import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { SearchSuggestionList } from "./search/search-suggestion-list"
import { useSearchInput } from "./search/use-search-input"

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  suggestions?: string[]
  onSuggestionClick?: (value: string) => void
  suggestionsContainerClassName?: string
  icon?: React.ReactNode
}

export function SearchInput({
  className,
  suggestions = [],
  onSuggestionClick,
  suggestionsContainerClassName,
  icon,
  ...props
}: SearchInputProps) {
  // CRITICAL: Ensure suggestions is always an array to prevent "undefined is not iterable" error
  const safeSuggestions = React.useMemo(() => {
    if (!Array.isArray(suggestions)) {
      console.error("suggestions is not an array in SearchInput:", suggestions);
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
  
  const {
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
  } = useSearchInput({
    suggestions: safeSuggestions,
    value: props.value as string | number, // Cast to fix type error
    onChange: props.onChange,
    onSuggestionClick
  });

  // Log validation for debugging
  React.useEffect(() => {
    console.log('SearchInput - safeSuggestions:', safeSuggestions?.length);
  }, [safeSuggestions]);

  return (
    <div className="relative w-full">
      <div className="flex items-center">
        {icon && <div className="absolute left-3 z-10">{icon}</div>}
        <Input
          {...props}
          ref={inputRef}
          className={cn(
            "w-full",
            icon && "pl-10",
            className
          )}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (filteredSuggestions.length > 0 && inputValue.trim()) {
              if (isMounted.current) {
                setOpen(true);
              }
            }
          }}
          aria-expanded={open}
        />
      </div>

      <SearchSuggestionList
        open={open}
        suggestions={filteredSuggestions}
        highlightedIndex={highlightedIndex}
        onSuggestionClick={handleSuggestionClick}
        className={suggestionsContainerClassName}
      />
    </div>
  )
}
