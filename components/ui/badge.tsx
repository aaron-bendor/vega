import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-brand-p1/30 bg-transparent text-brand-p3",
        secondary:
          "border-brand-p1/30 bg-transparent text-brand-p3",
        destructive:
          "border-brand-red/40 bg-transparent text-brand-red",
        outline:
          "border-[rgba(51,51,51,0.18)] text-foreground",
        success:
          "border-brand-green/40 bg-transparent text-brand-green",
        warning:
          "border-brand-orange/40 bg-transparent text-brand-orange",
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
