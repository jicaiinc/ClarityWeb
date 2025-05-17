import { useState } from "react"
import { ChevronDown } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~components/ui/select"
import { cn } from "~lib/utils"
import type { SelectOption } from "~types/chat"

interface CustomSelectProps {
  options: SelectOption[]
  defaultValue?: string
  value?: string
  onValueChange: (value: string) => void
  placeholder: string
  label?: string
  className?: string
  position?: "item-aligned" | "popper"
  side?: "top" | "right" | "bottom" | "left"
  sideOffset?: number
}

export function CustomSelect({
  options,
  defaultValue,
  value,
  onValueChange,
  placeholder,
  label,
  className,
  position = "item-aligned",
  side = "bottom",
  sideOffset = 4,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false)

  return (
    <Select
      onValueChange={onValueChange}
      defaultValue={defaultValue}
      value={value}
      onOpenChange={setOpen}
    >
      <SelectTrigger className={cn("w-[180px]", className)}>
        <SelectValue placeholder={placeholder} />
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </SelectTrigger>
      <SelectContent position={position} side={side} sideOffset={sideOffset}>
        <SelectGroup>
          {label && <SelectLabel>{label}</SelectLabel>}
          {options.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
