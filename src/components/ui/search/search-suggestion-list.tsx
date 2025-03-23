
import * as React from "react"
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandItem,
  CommandList
} from "@/components/ui/command"
import { cn } from "@/lib/utils"

interface SearchSuggestionListProps {
  open: boolean
  suggestions: string[]
  highlightedIndex: number
  onSuggestionClick: (suggestion: string) => void
  className?: string
}

export function SearchSuggestionList({
  open,
  suggestions,
  highlightedIndex,
  onSuggestionClick,
  className
}: SearchSuggestionListProps) {
  // Safety check to ensure suggestions is an array
  const safeSuggestions = Array.isArray(suggestions) ? suggestions : []
  
  if (!open || safeSuggestions.length === 0) {
    return null
  }

  return (
    <div 
      className={cn(
        "absolute z-50 w-full mt-1 bg-popover text-popover-foreground rounded-md border shadow-md suggestions-container",
        className
      )}
    >
      <Command>
        <CommandList>
          {safeSuggestions.length > 0 ? (
            <CommandGroup>
              {safeSuggestions.map((suggestion, index) => (
                <CommandItem
                  key={index}
                  onSelect={() => onSuggestionClick(suggestion)}
                  onMouseDown={(e) => {
                    e.preventDefault() // Prevent blur before click
                  }}
                  className={cn(
                    "cursor-pointer hover:bg-accent hover:text-accent-foreground",
                    index === highlightedIndex && "bg-accent text-accent-foreground"
                  )}
                >
                  {suggestion}
                </CommandItem>
              ))}
            </CommandGroup>
          ) : (
            <CommandEmpty>No suggestions found</CommandEmpty>
          )}
        </CommandList>
      </Command>
    </div>
  )
}
