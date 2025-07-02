"use client"

import type * as React from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface SplitButtonProps {
  children: React.ReactNode
  dropdownTrigger: React.ReactNode
  dropdownContent: React.ReactNode
  className?: string
  asChild?: boolean
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  onClick?: () => void
  disabled?: boolean
}

export function SplitButton({
  children,
  dropdownTrigger,
  dropdownContent,
  className,
  asChild = false,
  variant = "default",
  size = "default",
  onClick,
  disabled = false,
}: SplitButtonProps) {
  return (
    <div className={cn("flex", className)}>
      <Button
        variant={variant}
        size={size}
        onClick={onClick}
        asChild={asChild}
        className="rounded-r-none border-r-0 flex-1"
        disabled={disabled}
      >
        {asChild ? (
          children
        ) : (
          <div onClick={onClick} className="flex items-center justify-center">
            {children}
          </div>
        )}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={disabled}>
          <Button variant={variant} size={size} className="rounded-l-none px-2 sm:px-3" disabled={disabled}>
            {dropdownTrigger}
            <ChevronDown className="h-4 w-4 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        {dropdownContent}
      </DropdownMenu>
    </div>
  )
}
