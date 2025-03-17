
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        
        // New standardized variants based on our color palette
        blue: "border-transparent bg-app-blue text-white",
        orange: "border-transparent bg-app-orange text-white",
        yellow: "border-transparent bg-app-yellow text-app-charcoal",
        teal: "border-transparent bg-app-teal text-white",
        red: "border-transparent bg-app-red text-white",
        
        // Subtle variants
        "blue-subtle": "bg-app-blue/10 text-app-blue border-app-blue/20",
        "orange-subtle": "bg-app-orange/10 text-app-orange border-app-orange/20",
        "yellow-subtle": "bg-app-yellow/10 text-app-charcoal border-app-yellow/20",
        "teal-subtle": "bg-app-teal/10 text-app-teal border-app-teal/20",
        "red-subtle": "bg-app-red/10 text-app-red border-app-red/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
