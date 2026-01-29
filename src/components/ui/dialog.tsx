
import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useThemeStore } from '@/stores/theme.store';

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay
        ref={ref}
        className={cn(
            'tc-fixed tc-inset-0 tc-z-50 tc-bg-black/60 data-[state=open]:tc-animate-in data-[state=closed]:tc-animate-out data-[state=closed]:tc-fade-out-0 data-[state=open]:tc-fade-in-0',
            className
        )}
        {...props}
    />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => {
    const resolvedTheme = useThemeStore((state) => state.resolvedTheme);
    return (
    <DialogPortal>
        <div className={cn('ten-connect', resolvedTheme === 'dark' && 'dark')} data-portal-wrapper>
            <DialogOverlay />
            <DialogPrimitive.Content
                ref={ref}
                className={cn(
                    'tc-fixed tc-left-[50%] tc-top-[50%] tc-z-50 tc-grid tc-w-full tc-border-0 tc-max-w-lg tc-translate-x-[-50%] tc-translate-y-[-50%] tc-gap-4 tc-bg-background tc-p-6 tc-shadow-lg tc-duration-200 data-[state=open]:tc-animate-in data-[state=closed]:tc-animate-out data-[state=closed]:tc-fade-out-0 data-[state=open]:tc-fade-in-0 data-[state=closed]:tc-zoom-out-95 data-[state=open]:tc-zoom-in-95 data-[state=closed]:tc-slide-out-to-left-1/2 data-[state=closed]:tc-slide-out-to-top-[48%] data-[state=open]:tc-slide-in-from-left-1/2 data-[state=open]:tc-slide-in-from-top-[48%] sm:tc-rounded-lg',
                    className
                )}
                {...props}
            >
                {children}
                <DialogPrimitive.Close className="tc-absolute tc-right-4 tc-top-4 tc-rounded-sm tc-opacity-70 tc-ring-offset-background tc-transition-opacity hover:tc-opacity-100 focus:tc-outline-none focus:tc-ring-2 focus:tc-ring-ring focus:tc-ring-offset-2 disabled:tc-pointer-events-none data-[state=open]:tc-bg-accent data-[state=open]:tc-text-muted-foreground">
                    <X className="tc-h-4 tc-w-4" />
                    <span className="tc-sr-only">Close</span>
                </DialogPrimitive.Close>
            </DialogPrimitive.Content>
        </div>
    </DialogPortal>
);
});
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn('tc-flex tc-flex-col tc-space-y-1.5 tc-text-center sm:tc-text-left', className)}
        {...props}
    />
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn('tc-flex tc-flex-col-reverse sm:tc-flex-row sm:tc-justify-end sm:tc-space-x-2', className)}
        {...props}
    />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Title
        ref={ref}
        className={cn('tc-text-lg tc-font-semibold tc-leading-none tc-tracking-tight', className)}
        {...props}
    />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Description
        ref={ref}
        className={cn('tc-text-sm tc-text-muted-foreground', className)}
        {...props}
    />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
    Dialog,
    DialogPortal,
    DialogOverlay,
    DialogTrigger,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
};
