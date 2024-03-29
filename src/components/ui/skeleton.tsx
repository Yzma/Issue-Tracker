/* eslint-disable react/jsx-props-no-spreading */
import { cn } from '@/lib/utils'

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-slate-500 dark:bg-slate-800',
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
