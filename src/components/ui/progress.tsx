import * as React from 'react';
import { cn } from '@/lib/utils';

const Progress = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        value?: number;
    }
>(({ className, value, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            'tc-relative tc-h-4 tc-w-full tc-overflow-hidden tc-rounded-full tc-bg-secondary',
            className
        )}
        {...props}
    >
        <div
            className="tc-h-full tc-w-full tc-flex-1 tc-bg-primary tc-transition-all"
            style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
    </div>
));
Progress.displayName = 'Progress';

export { Progress };
