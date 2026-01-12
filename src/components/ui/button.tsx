import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
    'tc-inline-flex tc-items-center tc-justify-center tc-gap-x-2 tc-whitespace-nowrap tc-rounded-lg tc-text-sm tc-font-medium tc-transition-colors focus-visible:tc-outline-none focus-visible:tc-ring-1 focus-visible:tc-ring-ring disabled:tc-pointer-events-none disabled:tc-opacity-50 [&_svg]:tc-pointer-events-none [&_svg]:tc-size-4 [&_svg]:tc-shrink-0',
    {
        variants: {
            variant: {
                default: 'tc-bg-primary tc-text-primary-foreground tc-shadow hover:tc-bg-foreground/10',
                destructive:
                    'tc-bg-destructive tc-text-destructive-foreground tc-shadow-sm hover:tc-bg-destructive/90',
                outline:
                    'tc-border tc-border-input tc-bg-background tc-shadow-sm hover:tc-bg-foreground/5 hover:tc-text-accent-foreground',
                secondary: 'tc-bg-secondary tc-text-secondary-foreground tc-shadow-sm hover:tc-bg-secondary/80',
                ghost: 'hover:tc-bg-primary-foreground',
                link: 'tc-text-primary tc-underline-offset-4 hover:tc-underline',
            },
            size: {
                default: 'tc-px-4 tc-py-2',
                sm: 'tc-rounded-md tc-px-3 tc-text-xs',
                lg: 'tc-rounded-md tc-px-8',
                icon: 'tc-h-9 tc-w-9',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button';
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
