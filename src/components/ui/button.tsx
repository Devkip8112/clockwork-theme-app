import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-3 whitespace-nowrap font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0 active:scale-95 select-none",
  {
    variants: {
      variant: {
        default: "bg-gradient-primary text-primary-foreground hover:shadow-glow hover:scale-105 shadow-elegant",
        primary: "bg-primary text-primary-foreground hover:bg-primary-hover shadow-elegant hover:shadow-glow",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary-hover border border-border",
        success: "bg-success text-success-foreground hover:bg-success/90 shadow-elegant",
        warning: "bg-warning text-warning-foreground hover:bg-warning/90 shadow-elegant",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-elegant",
        outline: "border-2 border-primary text-primary bg-background hover:bg-primary hover:text-primary-foreground",
        ghost: "hover:bg-secondary hover:text-secondary-foreground",
        link: "text-primary underline-offset-4 hover:underline p-0",
        tablet: "bg-gradient-primary text-primary-foreground hover:shadow-glow hover:scale-105 shadow-elegant min-h-[72px] text-lg font-bold rounded-2xl",
        clock: "bg-gradient-primary text-primary-foreground hover:shadow-glow hover:scale-105 shadow-elegant min-h-[88px] text-xl font-bold rounded-3xl border-4 border-primary-glow/20"
      },
      size: {
        default: "h-12 px-6 py-3 text-base rounded-xl",
        sm: "h-9 rounded-lg px-4 text-sm",
        lg: "h-14 rounded-xl px-8 text-lg",
        xl: "h-16 rounded-2xl px-10 text-xl",
        icon: "h-12 w-12 rounded-xl",
        tablet: "h-16 px-8 rounded-2xl text-lg min-w-[200px]",
        clock: "h-20 px-12 rounded-3xl text-xl min-w-[280px]"
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
