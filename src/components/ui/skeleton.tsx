import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("tc-animate-pulse tc-rounded-md tc-bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton } 