import * as React from "react"
import { cn } from "@/lib/utils"

// "Medical Insight" Chip
// Pill-shaped indicator using secondary_container with on_secondary_container text

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "danger" | "success"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  
  const variants = {
    default: "bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80",
    secondary: "bg-surface-container-high text-primary-container",
    outline: "text-foreground ghost-border",
    danger: "bg-error-container text-on-error-container",
    success: "bg-primary-container text-on-primary-container",
  }
  
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold font-body transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
