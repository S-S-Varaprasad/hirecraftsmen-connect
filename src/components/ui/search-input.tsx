
import * as React from "react"
import { Search } from "lucide-react"
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
  icon = <Search className="h-5 w-5 text-gray-400" />,
  ...props
}: SearchInputProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState(props.value?.toString() || "")
  const [filteredSuggestions, setFilteredSuggestions] = React.useState<string[]>([])
  const inputRef = React.useRef<HTMLInputElement>(null)

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    props.onChange?.(e)
  }

  const handleSuggestionClick = (value: string) => {
    setInputValue(value)
    setOpen(false)
    
    // Call the parent onChange handler with a synthetic event
    const syntheticEvent = {
      target: { value },
      currentTarget: { value }
    } as React.ChangeEvent<HTMLInputElement>
    
    props.onChange?.(syntheticEvent)
    onSuggestionClick?.(value)
    
    // Focus the input after selection
    inputRef.current?.focus()
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
          onFocus={() => filteredSuggestions.length > 0 && setOpen(true)}
          onBlur={() => {
            // Small delay to allow clicking on suggestions
            setTimeout(() => setOpen(false), 200)
          }}
        />
      </div>

      {open && filteredSuggestions.length > 0 && (
        <div className={cn(
          "absolute z-50 w-full mt-1 bg-popover text-popover-foreground rounded-md border shadow-md",
          suggestionsContainerClassName
        )}>
          <Command>
            <CommandList>
              <CommandGroup>
                {filteredSuggestions.map((suggestion, index) => (
                  <CommandItem
                    key={index}
                    onSelect={() => handleSuggestionClick(suggestion)}
                    className="cursor-pointer"
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
