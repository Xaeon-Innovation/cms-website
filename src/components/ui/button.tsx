import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "link" | "danger"
  size?: "default" | "sm" | "lg" | "icon"
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", asChild = false, ...props }, ref) => {
    
    // Base styles from DESIGN.md "Soft-Touch"
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50"
    
    const variants = {
      primary: "bg-primary-fixed text-on-primary-fixed shadow-sm hover:tracking-wide hover:bg-opacity-95",
      secondary: "glass ghost-border text-primary-container shadow-sm hover:bg-white/10",
      ghost: "hover:bg-surface-container-high hover:text-primary-container text-foreground",
      danger: "bg-error text-on-error shadow-sm hover:bg-error/90",
      link: "text-primary-container underline-offset-4 hover:underline",
    }
    
    const sizes = {
      default: "h-11 px-6 py-2",
      sm: "h-9 px-4 text-sm",
      lg: "h-14 px-8 text-lg font-semibold",
      icon: "h-11 w-11",
    }

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
