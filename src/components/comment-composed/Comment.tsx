/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import * as React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMarkdown } from '@fortawesome/free-brands-svg-icons'
import { cn } from '@/lib/utils'
import { CustomLink } from '../ui/common'
import { Button, ButtonProps } from '../ui/button'
import { CardFooter } from '../ui/card'

const CommentFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }) => (
  <CardFooter
    className={cn(
      'flex justify-between border-t border-slate-200 p-2 px-4 pt-3',
      className
    )}
    {...props}
  >
    {children}
  </CardFooter>
))
CommentFooter.displayName = 'CommentFooter'

const CommentMarkdownMessage = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className }) => (
  <CustomLink
    href="https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax"
    className={cn('flex items-center gap-x-1 text-sm', className)}
  >
    <FontAwesomeIcon icon={faMarkdown} />
    Styling with Markdown is supported
  </CustomLink>
))
CommentMarkdownMessage.displayName = 'CommentMarkdownMessage'

const CommentButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <Button
        className={cn(className)}
        ref={ref}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      />
    )
  }
)
CommentButton.displayName = 'CommentButton'

export { CommentFooter, CommentMarkdownMessage, CommentButton }
