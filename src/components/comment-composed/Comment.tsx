/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMarkdown } from '@fortawesome/free-brands-svg-icons'
import {
  ReactMarkdown,
  ReactMarkdownOptions,
} from 'react-markdown/lib/react-markdown'
import remarkGfm from 'remark-gfm'
import { Scope, createContextScope } from '@radix-ui/react-context'
import { useControllableState } from '@radix-ui/react-use-controllable-state'
import { cn } from '@/lib/utils'
import { CustomLink } from '../ui/common'
import { Button, ButtonProps } from '../ui/button'
import { Card, CardFooter, CardHeader } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'

const COMMENTS_NAME = 'Comment'

type ScopedProps<P> = P & { __scopeTabs?: Scope }
const [createCommentContext, createCommentScope] =
  createContextScope(COMMENTS_NAME)

type CommentContextValue = {
  baseId: string
  value?: string
  onValueChange?: (value: string) => void
}

const [CommentProvider, useCommentContext] =
  createCommentContext<CommentContextValue>(COMMENTS_NAME)

type CommentProps = React.HTMLAttributes<HTMLDivElement> & {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}

// const Comment = Card

// T, Props
const Comment = React.forwardRef<HTMLDivElement, CommentProps>(
  (props: ScopedProps<CommentProps>, ref) => {
    const {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      __scopeTabs,
      value: valueProp,
      onValueChange,
      defaultValue,
      ...tabsProps
    } = props
    const [value, setValue] = useControllableState({
      prop: valueProp,
      onChange: onValueChange,
      defaultProp: defaultValue,
    })

    return (
      <CommentProvider
        scope={__scopeTabs}
        baseId={React.useId()}
        value={value}
        onValueChange={setValue}
      >
        <Card {...tabsProps} ref={ref} />
      </CommentProvider>
    )
  }
)
Comment.displayName = COMMENTS_NAME

const CommentHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <CardHeader ref={ref} className={cn('p-2 px-4 pb-6', className)} {...props}>
    {children}
  </CardHeader>
))
CommentHeader.displayName = 'CommentHeader'

const CommentTabs = Tabs

const CommentTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, children, ...props }, ref) => (
  <TabsList
    ref={ref}
    className={cn(
      'z-40 flex w-full justify-start space-x-2 rounded-none border-b bg-white p-2 px-4',
      className
    )}
    {...props}
  >
    {children}
  </TabsList>
))
CommentTabsList.displayName = 'CommentTabsList'

const CommentTabTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsTrigger
    ref={ref}
    className={cn(
      'z-10 -mb-[-5px] w-20 rounded-none rounded-t-lg border-[0.0625rem] p-3 outline-none ring-0 ring-offset-0 transition-none focus-visible:outline-none data-[state=inactive]:border-transparent data-[state=active]:border-b-white data-[state=active]:bg-white data-[state=active]:shadow-none',
      className
    )}
    {...props}
  />
))
CommentTabTrigger.displayName = 'CommentTabTrigger'

const CommentContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsContent
    ref={ref}
    className={cn(
      'focus-visible:ring-slate-950 dark:ring-offset-slate-950 mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-slate-300',
      className
    )}
    {...props}
  />
))
CommentContent.displayName = 'CommentContent'

const CommentFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <CardFooter
    ref={ref}
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

function CommentMarkdownMessage({ className }: { className?: string }) {
  return (
    <CustomLink
      target="_blank"
      href="https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax"
      className={cn('flex items-center gap-x-1 text-sm', className)}
    >
      <FontAwesomeIcon icon={faMarkdown} />
      Styling with Markdown is supported
    </CustomLink>
  )
}

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

function CommentMarkdownRender({ className, ...props }: ReactMarkdownOptions) {
  const { __scopeTabs, value } = props
  const context = useCommentContext(COMMENTS_NAME, __scopeTabs)
  return (
    <ReactMarkdown
      className={cn('prose', className)}
      remarkPlugins={[remarkGfm]}
      {...props}
    >
      {context.value}
    </ReactMarkdown>
  )
}

export {
  Comment,
  CommentHeader,
  CommentTabs,
  CommentTabsList,
  CommentTabTrigger,
  CommentContent,
  CommentFooter,
  CommentMarkdownMessage,
  CommentMarkdownRender,
  CommentButton,
}
