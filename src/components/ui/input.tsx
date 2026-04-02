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
          // Clearer border + "alive" focus/hover feedback (works in light/dark via tokens)
          "flex h-12 w-full rounded-sm bg-surface-container-low px-4 py-2 font-body text-base text-foreground",
          "placeholder:text-outline-variant/70",
          "border border-outline-variant/25 shadow-[0_1px_0_rgba(255,255,255,0.06)_inset]",
          "transition-[background-color,border-color,box-shadow,transform] duration-200",
          "hover:border-outline-variant/45 hover:bg-surface-container-low/90",
          "focus-visible:outline-none focus-visible:border-primary/70 focus-visible:bg-surface-container",
          "focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset,0_18px_60px_rgba(0,0,0,0.18)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error &&
            "border-error/70 hover:border-error focus-visible:border-error focus-visible:ring-error/25",
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
