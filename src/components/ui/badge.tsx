import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
    'tc-inline-flex tc-items-center tc-rounded-md tc-border tc-px-2.5 tc-py-0.5 tc-text-xs tc-font-semibold tc-transition-colors focus:tc-outline-none focus:tc-ring-2 focus:tc-ring-ring focus:tc-ring-offset-2',
    {
        variants: {
            variant: {
                default:
                    'tc-border-transparent tc-bg-primary tc-text-primary-foreground tc-shadow hover:tc-bg-primary/80',
                secondary:
                    'tc-border-transparent tc-bg-secondary tc-text-secondary-foreground hover:tc-bg-secondary/80',
                destructive:
                    'tc-border-transparent tc-bg-destructive tc-text-destructive-foreground tc-shadow hover:tc-bg-destructive/80',
                outline: 'tc-text-foreground',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
    return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
