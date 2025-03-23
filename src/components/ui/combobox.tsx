
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
  const [open, setOpen] = React.useState(false);
  
  // Ensure options is always a valid array
  const safeOptions = Array.isArray(options) ? options : [];

  // Prevent form submission and event propagation
  const handleTriggerClick = (e: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!disabled) {
      setOpen(!open);
    }
  };

  // Safely handle option selection and prevent event propagation
  const handleOptionSelect = (currentValue: string, optionValue: string) => {
    if (onChange) {
      onChange(optionValue === value ? "" : optionValue);
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", triggerClassName)}
          disabled={disabled}
          onClick={handleTriggerClick}
          type="button" // Explicitly set to prevent form submission
        >
          {value && safeOptions.length > 0
            ? safeOptions.find((option) => option.value === value)?.label || placeholder
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-full p-0" 
        onMouseDown={(e) => e.stopPropagation()} 
        onClick={(e) => e.stopPropagation()}
        align="start"
        side="bottom"
        sideOffset={4}
      >
        <Command shouldFilter={true}>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandEmpty>{emptyMessage}</CommandEmpty>
          <CommandGroup className="max-h-60 overflow-y-auto">
            {safeOptions.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={(currentValue) => handleOptionSelect(currentValue, option.value)}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
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
