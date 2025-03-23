
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

  // Ensure suggestions is always an array
  const safeSuggestions = Array.isArray(suggestions) ? suggestions : []

  // Update inputValue when props.value changes
  React.useEffect(() => {
    if (value !== undefined) {
      setInputValue(value.toString())
    }
  }, [value])

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue.trim()) {
        const filtered = safeSuggestions.filter(suggestion => 
          suggestion.toLowerCase().includes(inputValue.toLowerCase())
        )
        setFilteredSuggestions(filtered.slice(0, 8)) // Limit to 8 suggestions
        setOpen(filtered.length > 0)
        setHighlightedIndex(-1) // Reset highlighted index when suggestions change
      } else {
        setFilteredSuggestions([])
        setOpen(false)
      }
    }, 200)

    return () => clearTimeout(timer)
  }, [inputValue, safeSuggestions])

  // Close suggestions when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current && 
        !inputRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && highlightedIndex < filteredSuggestions.length) {
          handleSuggestionClick(filteredSuggestions[highlightedIndex])
        }
        break
      case 'Escape':
        setOpen(false)
        break
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    onChange?.(e)
  }

  const handleSuggestionClick = (value: string) => {
    setInputValue(value)
    setOpen(false)
    
    // Create a synthetic event that accurately mimics a real input event
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value"
    )?.set
    
    if (inputRef.current && nativeInputValueSetter) {
      nativeInputValueSetter.call(inputRef.current, value)
      
      const event = new Event('input', { bubbles: true })
      inputRef.current.dispatchEvent(event)
    }
    
    // Also call the custom handlers to ensure both React's synthetic events and custom handlers work
    if (onChange) {
      const syntheticEvent = {
        target: { value },
        currentTarget: { value }
      } as React.ChangeEvent<HTMLInputElement>
      onChange(syntheticEvent)
    }
    
    if (onSuggestionClick) {
      onSuggestionClick(value)
    }
  }

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
  }
}
