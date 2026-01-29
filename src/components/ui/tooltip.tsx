"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"
import { useThemeStore } from "@/stores/theme.store"

function TooltipProvider({
                             delayDuration = 0,
                             ...props
                         }: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
    return (
        <TooltipPrimitive.Provider
            data-slot="tooltip-provider"
            delayDuration={delayDuration}
            {...props}
        />
    )
}

function Tooltip({
                     ...props
                 }: React.ComponentProps<typeof TooltipPrimitive.Root>) {
    return (
        <TooltipProvider>
            <TooltipPrimitive.Root data-slot="tooltip" {...props} />
        </TooltipProvider>
    )
}

function TooltipTrigger({
                            ...props
                        }: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
    return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

function TooltipContent({
                            className,
                            sideOffset = 0,
                            children,
                            ...props
                        }: React.ComponentProps<typeof TooltipPrimitive.Content>) {
    const resolvedTheme = useThemeStore((state) => state.resolvedTheme);
    return (
        <TooltipPrimitive.Portal>
            <div className={cn("ten-connect", resolvedTheme === "dark" && "dark")} data-portal-wrapper>
                <TooltipPrimitive.Content
                    data-slot="tooltip-content"
                    sideOffset={sideOffset}
                    className={cn(
                        "tc-bg-foreground tc-text-background tc-animate-in tc-fade-in-0 tc-zoom-in-95 data-[state=closed]:tc-animate-out data-[state=closed]:tc-fade-out-0 data-[state=closed]:tc-zoom-out-95 data-[side=bottom]:tc-slide-in-from-top-2 data-[side=left]:tc-slide-in-from-right-2 data-[side=right]:tc-slide-in-from-left-2 data-[side=top]:tc-slide-in-from-bottom-2 tc-z-50 tc-w-fit tc-origin-(--radix-tooltip-content-transform-origin) tc-rounded-md tc-px-3 tc-py-1.5 tc-text-xs tc-text-balance",
                        className
                    )}
                    {...props}
                >
                    {children}
                    <TooltipPrimitive.Arrow className="tc-bg-foreground tc-fill-foreground tc-z-50 tc-size-2.5 tc-translate-y-[calc(-50%_-_2px)] tc-rotate-45 tc-rounded-[2px]" />
                </TooltipPrimitive.Content>
            </div>
        </TooltipPrimitive.Portal>
    )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
