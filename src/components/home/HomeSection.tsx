/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import * as React from 'react'

import { cn } from '@/lib/utils'

const HomeSectionTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('h2 mb-4 text-center text-gray-800', className)}
    {...props}
  />
))
HomeSectionTitle.displayName = 'HomeSectionTitle'

const HomeSectionDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('mb-8 text-lg text-gray-600', className)}
    {...props}
  />
))
HomeSectionDescription.displayName = 'HomeSectionDescription'

export { HomeSectionTitle, HomeSectionDescription }
