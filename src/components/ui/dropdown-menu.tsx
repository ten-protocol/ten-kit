import * as React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { Check, ChevronRight, Circle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useThemeStore } from '@/stores/theme.store';

const DropdownMenu = DropdownMenuPrimitive.Root;

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const DropdownMenuGroup = DropdownMenuPrimitive.Group;

const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

const DropdownMenuSub = DropdownMenuPrimitive.Sub;

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const DropdownMenuSubTrigger = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
        inset?: boolean;
    }
>(({ className, inset, children, ...props }, ref) => (
    <DropdownMenuPrimitive.SubTrigger
        ref={ref}
        className={cn(
            'tc-flex tc-cursor-default tc-select-none tc-items-center tc-rounded-sm tc-px-2 tc-py-1.5 tc-text-sm tc-outline-none focus:tc-bg-accent data-[state=open]:tc-bg-accent',
            inset && 'tc-pl-8',
            className
        )}
        {...props}
    >
        {children}
        <ChevronRight className="tc-ml-auto tc-h-4 tc-w-4" />
    </DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName =
    DropdownMenuPrimitive.SubTrigger.displayName;

const DropdownMenuSubContent = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => {
    const resolvedTheme = useThemeStore((state) => state.resolvedTheme);
    return (
    <div className={cn('ten-connect', resolvedTheme === 'dark' && 'dark')} data-portal-wrapper>
        <DropdownMenuPrimitive.SubContent
            ref={ref}
            className={cn(
                'tc-z-50 tc-min-w-[8rem] tc-overflow-hidden tc-rounded-md tc-border tc-bg-popover tc-p-1 tc-text-popover-foreground tc-shadow-lg data-[state=open]:tc-animate-in data-[state=closed]:tc-animate-out data-[state=closed]:tc-fade-out-0 data-[state=open]:tc-fade-in-0 data-[state=closed]:tc-zoom-out-95 data-[state=open]:tc-zoom-in-95 data-[side=bottom]:tc-slide-in-from-top-2 data-[side=left]:tc-slide-in-from-right-2 data-[side=right]:tc-slide-in-from-left-2 data-[side=top]:tc-slide-in-from-bottom-2',
                className
            )}
            {...props}
        />
    </div>
);
});
DropdownMenuSubContent.displayName =
    DropdownMenuPrimitive.SubContent.displayName;

const DropdownMenuContent = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => {
    const resolvedTheme = useThemeStore((state) => state.resolvedTheme);
    return (
    <DropdownMenuPrimitive.Portal>
        <div className={cn('ten-connect', resolvedTheme === 'dark' && 'dark')} data-portal-wrapper>
            <DropdownMenuPrimitive.Content
                ref={ref}
                sideOffset={sideOffset}
                className={cn(
                    'tc-z-50 tc-min-w-[8rem] tc-overflow-hidden tc-rounded-md tc-bg-popover tc-p-1 tc-text-popover-foreground tc-shadow-md data-[state=open]:tc-animate-in data-[state=closed]:tc-animate-out data-[state=closed]:tc-fade-out-0 data-[state=open]:tc-fade-in-0 data-[state=closed]:tc-zoom-out-95 data-[state=open]:tc-zoom-in-95 data-[side=bottom]:tc-slide-in-from-top-2 data-[side=left]:tc-slide-in-from-right-2 data-[side=right]:tc-slide-in-from-left-2 data-[side=top]:tc-slide-in-from-bottom-2',
                    className
                )}
                {...props}
            />
        </div>
    </DropdownMenuPrimitive.Portal>
);
});
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownMenuItem = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
        inset?: boolean;
    }
>(({ className, inset, ...props }, ref) => (
    <DropdownMenuPrimitive.Item
        ref={ref}
        className={cn(
            'tc-relative tc-flex tc-cursor-default tc-select-none tc-items-center tc-rounded-sm tc-px-2 tc-py-1.5 tc-text-sm tc-outline-none tc-transition-colors focus:tc-bg-primary-foreground focus:tc-text-accent-foreground data-[disabled]:tc-pointer-events-none data-[disabled]:tc-opacity-50',
            inset && 'tc-pl-8',
            className
        )}
        {...props}
    />
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuCheckboxItem = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
    <DropdownMenuPrimitive.CheckboxItem
        ref={ref}
        className={cn(
            'tc-relative tc-flex tc-cursor-default tc-select-none tc-items-center tc-rounded-sm tc-py-1.5 tc-pl-8 tc-pr-2 tc-text-sm tc-outline-none tc-transition-colors focus:tc-bg-accent focus:tc-text-accent-foreground data-[disabled]:tc-pointer-events-none data-[disabled]:tc-opacity-50',
            className
        )}
        checked={checked}
        {...props}
    >
        <span className="tc-absolute tc-left-2 tc-flex tc-h-3.5 tc-w-3.5 tc-items-center tc-justify-center">
            <DropdownMenuPrimitive.ItemIndicator>
                <Check className="tc-h-4 tc-w-4" />
            </DropdownMenuPrimitive.ItemIndicator>
        </span>
        {children}
    </DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName =
    DropdownMenuPrimitive.CheckboxItem.displayName;

const DropdownMenuRadioItem = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
    <DropdownMenuPrimitive.RadioItem
        ref={ref}
        className={cn(
            'tc-relative tc-flex tc-cursor-default tc-select-none tc-items-center tc-rounded-sm tc-py-1.5 tc-pl-8 tc-pr-2 tc-text-sm tc-outline-none tc-transition-colors focus:tc-bg-accent focus:tc-text-accent-foreground data-[disabled]:tc-pointer-events-none data-[disabled]:tc-opacity-50',
            className
        )}
        {...props}
    >
        <span className="tc-absolute tc-left-2 tc-flex tc-h-3.5 tc-w-3.5 tc-items-center tc-justify-center">
            <DropdownMenuPrimitive.ItemIndicator>
                <Circle className="tc-h-2 tc-w-2 tc-fill-current" />
            </DropdownMenuPrimitive.ItemIndicator>
        </span>
        {children}
    </DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

const DropdownMenuLabel = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Label>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
        inset?: boolean;
    }
>(({ className, inset, ...props }, ref) => (
    <DropdownMenuPrimitive.Label
        ref={ref}
        className={cn(
            'tc-px-2 tc-py-1.5 tc-text-sm tc-font-semibold',
            inset && 'tc-pl-8',
            className
        )}
        {...props}
    />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
    <DropdownMenuPrimitive.Separator
        ref={ref}
        className={cn('tc--mx-1 tc-my-1 tc-h-px tc-bg-muted', className)}
        {...props}
    />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const DropdownMenuShortcut = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
    return (
        <span
            className={cn('tc-ml-auto tc-text-xs tc-tracking-widest tc-opacity-60', className)}
            {...props}
        />
    );
};
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut';

export {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuRadioItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuGroup,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuRadioGroup,
};
