
import * as React from "react"
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem,
  CommandList
} from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

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
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState(props.value?.toString() || "")
  const [filteredSuggestions, setFilteredSuggestions] = React.useState<string[]>([])
  const inputRef = React.useRef<HTMLInputElement>(null)
  const suggestionsRef = React.useRef<HTMLDivElement>(null)

  // Update inputValue when props.value changes
  React.useEffect(() => {
    if (props.value !== undefined) {
      setInputValue(props.value.toString());
    }
  }, [props.value]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue.trim()) {
        const filtered = suggestions.filter(suggestion => 
          suggestion.toLowerCase().includes(inputValue.toLowerCase())
        )
        setFilteredSuggestions(filtered.slice(0, 8)) // Limit to 8 suggestions
        setOpen(filtered.length > 0)
      } else {
        setFilteredSuggestions([])
        setOpen(false)
      }
    }, 200)

    return () => clearTimeout(timer)
  }, [inputValue, suggestions])

  // Close suggestions when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current && 
        !inputRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    props.onChange?.(e)
  }

  const handleSuggestionClick = (value: string) => {
    setInputValue(value)
    setOpen(false)
    
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
    if (props.onChange) {
      const syntheticEvent = {
        target: { value },
        currentTarget: { value }
      } as React.ChangeEvent<HTMLInputElement>;
      props.onChange(syntheticEvent);
    }
    
    if (onSuggestionClick) {
      onSuggestionClick(value);
    }
  }

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
          onFocus={() => {
            if (filteredSuggestions.length > 0 && inputValue.trim()) {
              setOpen(true)
            }
          }}
        />
      </div>

      {open && filteredSuggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className={cn(
            "absolute z-50 w-full mt-1 bg-popover text-popover-foreground rounded-md border shadow-md suggestions-container",
            suggestionsContainerClassName
          )}
        >
          <Command>
            <CommandList>
              <CommandGroup>
                {filteredSuggestions.map((suggestion, index) => (
                  <CommandItem
                    key={index}
                    onSelect={() => handleSuggestionClick(suggestion)}
                    onMouseDown={(e) => {
                      e.preventDefault(); // Prevent blur before click
                    }}
                    className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
                  >
                    {suggestion}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  )
}
