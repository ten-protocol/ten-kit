"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"
import { useThemeStore } from "@/stores/theme.store"

const Sheet = SheetPrimitive.Root

const SheetTrigger = SheetPrimitive.Trigger

const SheetClose = SheetPrimitive.Close

const SheetPortal = SheetPrimitive.Portal

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "tc-fixed tc-inset-0 tc-z-50 tc-bg-black/80 dark:tc-bg-white/80 data-[state=open]:tc-animate-in data-[state=closed]:tc-animate-out data-[state=closed]:tc-fade-out-0 data-[state=open]:tc-fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

const sheetVariants = cva(
  "tc-fixed tc-z-50 tc-gap-4 tc-bg-background tc-p-6 tc-shadow-lg tc-transition tc-ease-in-out data-[state=closed]:tc-duration-300 data-[state=open]:tc-duration-500 data-[state=open]:tc-animate-in data-[state=closed]:tc-animate-out",
  {
    variants: {
      side: {
        top: "tc-inset-x-0 tc-top-0 tc-border-b data-[state=closed]:tc-slide-out-to-top data-[state=open]:tc-slide-in-from-top",
        bottom:
          "tc-inset-x-0 tc-bottom-0 tc-border-t data-[state=closed]:tc-slide-out-to-bottom data-[state=open]:tc-slide-in-from-bottom",
        left: "tc-inset-y-0 tc-left-0 tc-h-full tc-w-3/4 tc-border-r data-[state=closed]:tc-slide-out-to-left data-[state=open]:tc-slide-in-from-left sm:tc-max-w-sm",
        right:
          "tc-inset-y-0 tc-right-0 tc-h-full tc-w-3/4 tc-border-l data-[state=closed]:tc-slide-out-to-right data-[state=open]:tc-slide-in-from-right sm:tc-max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
)

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => {
  const resolvedTheme = useThemeStore((state) => state.resolvedTheme);
  return (
  <SheetPortal>
    <div className={cn("ten-connect", resolvedTheme === "dark" && "dark")} data-portal-wrapper>
      <SheetOverlay />
      <SheetPrimitive.Content
        ref={ref}
        className={cn(sheetVariants({ side }), className)}
        {...props}
      >
        <SheetPrimitive.Close className="tc-absolute tc-right-4 tc-top-4 tc-rounded-sm tc-opacity-70 tc-ring-offset-background tc-transition-opacity hover:tc-opacity-100 focus:tc-outline-none focus:tc-ring-2 focus:tc-ring-ring focus:tc-ring-offset-2 disabled:tc-pointer-events-none data-[state=open]:tc-bg-secondary">
          <X className="tc-h-4 tc-w-4" />
          <span className="tc-sr-only">Close</span>
        </SheetPrimitive.Close>
        {children}
      </SheetPrimitive.Content>
    </div>
  </SheetPortal>
);
})
SheetContent.displayName = SheetPrimitive.Content.displayName

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "tc-flex tc-flex-col tc-space-y-2 tc-text-center sm:tc-text-left",
      className
    )}
    {...props}
  />
)
SheetHeader.displayName = "SheetHeader"

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "tc-flex tc-flex-col-reverse sm:tc-flex-row sm:tc-justify-end sm:tc-space-x-2",
      className
    )}
    {...props}
  />
)
SheetFooter.displayName = "SheetFooter"

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn("tc-text-lg tc-font-semibold tc-text-foreground", className)}
    {...props}
  />
))
SheetTitle.displayName = SheetPrimitive.Title.displayName

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("tc-text-sm tc-text-muted-foreground", className)}
    {...props}
  />
))
SheetDescription.displayName = SheetPrimitive.Description.displayName

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
