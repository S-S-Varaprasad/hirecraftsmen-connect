
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
  options = [], // Ensure options has a default empty array
  value,
  onChange,
  triggerClassName,
  searchPlaceholder = "Search...",
  disabled = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const safeOptions = Array.isArray(options) ? options : []; // Ensure options is an array

  // Handler to prevent default event behavior
  const handleTriggerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!disabled) {
      setOpen(!open);
    }
  }

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
          type="button" // Explicitly set button type to prevent form submission
        >
          {value
            ? safeOptions.find((option) => option.value === value)?.label || placeholder
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandEmpty>{emptyMessage}</CommandEmpty>
          <CommandGroup className="max-h-60 overflow-y-auto">
            {safeOptions.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={(currentValue) => {
                  onChange(option.value === value ? "" : option.value);
                  setOpen(false);
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
