import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-md bg-primary/10 animate-pulse",
        "motion-reduce:animate-none [@media(prefers-reduced-motion:reduce)]:animate-none",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
