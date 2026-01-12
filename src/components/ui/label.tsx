import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const labelVariants = cva(
    'tc-text-sm tc-font-medium tc-leading-none peer-disabled:tc-cursor-not-allowed peer-disabled:tc-opacity-70'
);

const Label = React.forwardRef<
    HTMLLabelElement,
    React.LabelHTMLAttributes<HTMLLabelElement> &
        VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
    <label
        ref={ref}
        className={cn(labelVariants(), className)}
        {...props}
    />
));
Label.displayName = 'Label';

export { Label }
