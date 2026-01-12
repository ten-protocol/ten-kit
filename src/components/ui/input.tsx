import * as React from 'react';

import { cn } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    'tc-flex tc-h-9 tc-w-full tc-rounded-md tc-border tc-border-input tc-px-3 tc-py-1 tc-bg-background/70 tc-text-base tc-shadow-sm tc-transition-colors file:tc-border-0 file:tc-bg-transparent file:tc-text-sm file:tc-font-medium file:tc-text-foreground placeholder:tc-text-muted-foreground focus-visible:tc-outline-none focus-visible:tc-ring-1 focus-visible:tc-ring-ring disabled:tc-cursor-not-allowed disabled:tc-opacity-50 md:tc-text-sm',
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Input.displayName = 'Input';

export { Input };
