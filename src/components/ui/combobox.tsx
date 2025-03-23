
"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ComboboxProps {
  placeholder?: string
  emptyMessage?: string
  options: { value: string; label: string }[]
  value?: string
  onChange: (value: string) => void
  triggerClassName?: string
  searchPlaceholder?: string
  disabled?: boolean
}

export function Combobox({
  placeholder = "Select option...",
  emptyMessage = "No results found.",
  options,
  value,
  onChange,
  triggerClassName,
  searchPlaceholder = "Search...",
  disabled = false,
}: ComboboxProps) {
  // Initialize state with controlled open state
  const [open, setOpen] = React.useState(false);
  
  // CRITICAL: Ensure options is always a valid array with defensive check
  // This is the key fix for the "undefined is not iterable" error
  const safeOptions = Array.isArray(options) ? options : [];
  
  // Ref to track if component is mounted to prevent state updates after unmount
  const isMounted = React.useRef(true);
  React.useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Handle button click with prevention of form submission and additional safety
  const handleButtonClick = (e: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!disabled && isMounted.current) {
      setOpen(!open);
    }
  };

  // Safely handle option selection with proper error handling
  const handleSelectOption = (currentValue: string, selectedValue: string) => {
    try {
      if (onChange && isMounted.current) {
        // Only call onChange if it exists and component is still mounted
        onChange(selectedValue === value ? "" : selectedValue);
      }
      
      if (isMounted.current) {
        setOpen(false);
      }
    } catch (error) {
      console.error("Error in ComboBox selection handler:", error);
      if (isMounted.current) {
        setOpen(false);
      }
    }
  };

  // Handle popover open/close events safely
  const handleOpenChange = (newOpen: boolean) => {
    try {
      if (isMounted.current) {
        setOpen(newOpen);
      }
    } catch (error) {
      console.error("Error in ComboBox open change handler:", error);
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", triggerClassName)}
          disabled={disabled}
          onClick={handleButtonClick}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          type="button" // Explicitly set type to prevent form submission
        >
          {value && safeOptions.length > 0
            ? safeOptions.find((option) => option.value === value)?.label || placeholder
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-full p-0" 
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }} 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        align="start"
        side="bottom"
        sideOffset={4}
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandEmpty>{emptyMessage}</CommandEmpty>
          <CommandGroup className="max-h-60 overflow-y-auto">
            {safeOptions.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={(currentValue) => handleSelectOption(currentValue, option.value)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === option.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
