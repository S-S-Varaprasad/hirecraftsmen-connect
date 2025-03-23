
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
  // Use useRef to track mounted state
  const mounted = React.useRef(true);
  
  // Initialize state with controlled open state
  const [open, setOpen] = React.useState(false);
  
  // CRITICAL FIX: Always ensure options is a valid array with defensive check
  // This prevents the "undefined is not iterable" error
  const safeOptions = React.useMemo(() => {
    return Array.isArray(options) ? options : [];
  }, [options]);
  
  // Clean up when component unmounts
  React.useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  // Safely handle button click with error prevention
  const handleButtonClick = (e: React.MouseEvent) => {
    try {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      
      if (!disabled && mounted.current) {
        setOpen(!open);
      }
    } catch (error) {
      console.error("Error in Combobox handleButtonClick:", error);
    }
  };

  // Safely handle option selection
  const handleSelectOption = (currentValue: string, selectedValue: string) => {
    try {
      if (onChange && mounted.current) {
        // Only call onChange if it exists and component is still mounted
        onChange(currentValue === value ? "" : selectedValue);
      }
      
      if (mounted.current) {
        setOpen(false);
      }
    } catch (error) {
      console.error("Error in Combobox handleSelectOption:", error);
    }
  };

  // Safely handle popover state changes
  const handleOpenChange = (newOpen: boolean) => {
    try {
      if (mounted.current) {
        setOpen(newOpen);
      }
    } catch (error) {
      console.error("Error in Combobox handleOpenChange:", error);
    }
  };

  // Don't render if options is not valid (should never happen now with safeOptions)
  if (!Array.isArray(safeOptions)) {
    console.error("Invalid options prop provided to Combobox:", options);
    return null;
  }

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
