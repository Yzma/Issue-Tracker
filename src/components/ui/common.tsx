/* eslint-disable react/function-component-definition */
/* eslint-disable react/jsx-props-no-spreading */
import Link from 'next/link'
import React from 'react'
import { cn } from '@/lib/utils'

interface LinkRefProps {
  href: string
  className?: string
  children: React.ReactNode
}

const CustomLink: React.FC<LinkRefProps> = ({
  className,
  children,
  href,
  ...props
}) => (
  <Link
    href={href}
    className={cn(
      'text-blue-600 hover:cursor-pointer hover:text-blue-900 hover:underline',
      className
    )}
    {...props}
  >
    {children}
  </Link>
)
CustomLink.displayName = 'CustomLink'

export { CustomLink }
