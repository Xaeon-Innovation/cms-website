import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

// "Minimalist Science"
// Underline-only or subtle background shift. Label to gold on focus.
// Error: Thin 1px line at the base

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full bg-surface-container-low px-4 py-2 font-body text-base file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-outline-variant",
          "border-b border-transparent focus-visible:outline-none focus:border-primary focus:bg-surface-container transition-all",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-error focus:border-error focus:ring-0",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
