/* eslint-disable react/function-component-definition */
/* eslint-disable react/jsx-props-no-spreading */
import Link, { LinkProps } from 'next/link'
import React from 'react'
import { cn } from '@/lib/utils'

export type CustomLinkProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  keyof LinkProps
> &
  LinkProps & {
    children?: React.ReactNode
  } & React.RefAttributes<HTMLAnchorElement>

const CustomLink = ({
  className,
  children,
  href,
  ...props
}: CustomLinkProps) => (
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
