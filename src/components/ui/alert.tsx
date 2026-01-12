import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "tc-relative tc-w-full tc-rounded-lg tc-border tc-px-4 tc-py-3 tc-text-sm [&>svg+div]:tc-translate-y-[-3px] [&>svg]:tc-absolute [&>svg]:tc-left-4 [&>svg]:tc-top-4 [&>svg]:tc-text-foreground [&>svg~*]:tc-pl-7",
  {
    variants: {
      variant: {
        default: "tc-bg-background tc-text-foreground",
        destructive:
          "tc-border-destructive/50 tc-text-destructive dark:tc-border-destructive [&>svg]:tc-text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("tc-mb-1 tc-font-medium tc-leading-none tc-tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("tc-text-sm [&_p]:tc-leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
