'use client';

import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';

import { cn } from '@/lib/utils';

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
    <SelectPrimitive.Trigger
        ref={ref}
        className={cn(
            'tc-flex tc-h-9 tc-w-full tc-items-center tc-justify-between tc-whitespace-nowrap tc-rounded-md tc-border tc-border-input tc-bg-transparent tc-px-3 tc-py-2 tc-text-sm tc-shadow-sm tc-ring-offset-background placeholder:tc-text-muted-foreground focus:tc-outline-none focus:tc-ring-1 focus:tc-ring-ring disabled:tc-cursor-not-allowed disabled:tc-opacity-50 [&>span]:tc-line-clamp-1',
            className
        )}
        {...props}
    >
        {children}
        <SelectPrimitive.Icon asChild>
            <ChevronDown className="tc-h-4 tc-w-4 tc-opacity-50" />
        </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
    <SelectPrimitive.ScrollUpButton
        ref={ref}
        className={cn('tc-flex tc-cursor-default tc-items-center tc-justify-center tc-py-1', className)}
        {...props}
    >
        <ChevronUp className="tc-h-4 tc-w-4" />
    </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
    <SelectPrimitive.ScrollDownButton
        ref={ref}
        className={cn('tc-flex tc-cursor-default tc-items-center tc-justify-center tc-py-1', className)}
        {...props}
    >
        <ChevronDown className="tc-h-4 tc-w-4" />
    </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
    <SelectPrimitive.Portal>
        <div className="ten-connect" data-portal-wrapper>
            <SelectPrimitive.Content
                ref={ref}
                className={cn(
                    'tc-relative tc-z-50 tc-max-h-96 tc-min-w-[8rem] tc-overflow-hidden tc-rounded-md tc-border tc-bg-popover tc-text-popover-foreground tc-shadow-md data-[state=open]:tc-animate-in data-[state=closed]:tc-animate-out data-[state=closed]:tc-fade-out-0 data-[state=open]:tc-fade-in-0 data-[state=closed]:tc-zoom-out-95 data-[state=open]:tc-zoom-in-95 data-[side=bottom]:tc-slide-in-from-top-2 data-[side=left]:tc-slide-in-from-right-2 data-[side=right]:tc-slide-in-from-left-2 data-[side=top]:tc-slide-in-from-bottom-2',
                    position === 'popper' &&
                        'data-[side=bottom]:tc-translate-y-1 data-[side=left]:tc--translate-x-1 data-[side=right]:tc-translate-x-1 data-[side=top]:tc--translate-y-1',
                    className
                )}
                position={position}
                {...props}
            >
                <SelectScrollUpButton />
                <SelectPrimitive.Viewport
                    className={cn(
                        'tc-p-1',
                        position === 'popper' &&
                            'tc-h-[var(--radix-select-trigger-height)] tc-w-full tc-min-w-[var(--radix-select-trigger-width)]'
                    )}
                >
                    {children}
                </SelectPrimitive.Viewport>
                <SelectScrollDownButton />
            </SelectPrimitive.Content>
        </div>
    </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Label>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
    <SelectPrimitive.Label
        ref={ref}
        className={cn('tc-px-2 tc-py-1.5 tc-text-sm tc-font-semibold', className)}
        {...props}
    />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
    <SelectPrimitive.Item
        ref={ref}
        className={cn(
            'tc-relative tc-flex tc-w-full tc-cursor-default tc-select-none tc-items-center tc-rounded-sm tc-py-1.5 tc-pl-2 tc-pr-8 tc-text-sm tc-outline-none focus:tc-bg-accent focus:tc-text-accent-foreground data-[disabled]:tc-pointer-events-none data-[disabled]:tc-opacity-50',
            className
        )}
        {...props}
    >
        <span className="tc-absolute tc-right-2 tc-flex tc-h-3.5 tc-w-3.5 tc-items-center tc-justify-center">
            <SelectPrimitive.ItemIndicator>
                <Check className="tc-h-4 tc-w-4" />
            </SelectPrimitive.ItemIndicator>
        </span>
        <SelectPrimitive.ItemText asChild={true}>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Separator>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
    <SelectPrimitive.Separator
        ref={ref}
        className={cn('tc--mx-1 tc-my-1 tc-h-px tc-bg-muted', className)}
        {...props}
    />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
    Select,
    SelectGroup,
    SelectValue,
    SelectTrigger,
    SelectContent,
    SelectLabel,
    SelectItem,
    SelectSeparator,
    SelectScrollUpButton,
    SelectScrollDownButton,
};
