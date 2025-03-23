
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
    suggestions,
    value: props.value,
    onChange: props.onChange,
    onSuggestionClick
  })

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
              setOpen(true)
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
