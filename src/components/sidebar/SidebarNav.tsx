import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
    shouldRender?: boolean
  }[]
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav
      className={cn(
        'flex-col space-x-0 rounded-md border lg:space-y-1',
        className
      )}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      <div className="inline-flex items-center px-4 py-2 text-sm font-bold">
        Organization Permissions
      </div>
      {items
        .filter((menuItem) => menuItem.shouldRender ?? true)
        .map((item) => (
          <Slot
            key={item.href}
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              pathname === item.href
                ? 'hover:bg-muted bg-gray-200'
                : 'hover:bg-transparent hover:underline',
              'relative flex justify-start'
            )}
          >
            <Link href={item.href}>
              {pathname === item.href && (
                <div className="absolute top-[calc(50%-20px)] left-0 z-30 h-full w-[0.20rem] rounded-md bg-orange-500" />
              )}
              {item.title}
            </Link>
          </Slot>
        ))}
    </nav>
  )
}
