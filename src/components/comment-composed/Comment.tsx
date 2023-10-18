/* eslint-disable react/require-default-props */
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
import dynamic from 'next/dynamic'
import { cn } from '@/lib/utils'
import { CustomLink } from '../ui/common'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { EditorProps } from './types'

const MdEditor = dynamic(() => import('react-markdown-editor-lite'), {
  ssr: false,
})

const COMMENTS_NAME = 'Comment'

type ScopedProps<P> = P & { __scopeComment?: Scope }
const [createCommentContext] = createContextScope(COMMENTS_NAME)

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

const Comment = React.forwardRef<HTMLDivElement, CommentProps>(
  (props: ScopedProps<CommentProps>, ref) => {
    const {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      __scopeComment,
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
        scope={__scopeComment}
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
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <CardContent ref={ref} className={cn('px-4 py-3', className)} {...props} />
))
CommentContent.displayName = 'CommentContent'

const CommentTabsContent = React.forwardRef<
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
CommentTabsContent.displayName = 'CommentTabsContent'

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

function CommentMarkdownEditor({
  ...props
}: ScopedProps<Omit<EditorProps, 'renderHTML'>>) {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { __scopeComment, onChange } = props
  const context = useCommentContext(COMMENTS_NAME, __scopeComment)
  return (
    <MdEditor
      value={context.value}
      style={{ height: '400px' }}
      view={{ menu: true, md: true, html: false }}
      canView={{
        md: false,
        menu: true,
        fullScreen: false,
        hideMenu: true,
        html: false,
        both: false,
      }}
      onChange={(e) => {
        if (onChange) {
          onChange(e)
        }
        if (context && context.onValueChange) {
          context.onValueChange(e.text)
        }
      }}
      {...props}
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/ban-ts-comment
      // @ts-ignore
      renderHTML={() => <ReactMarkdown>{context.value}</ReactMarkdown>}
    />
  )
}

function CommentMarkdownRender({
  className,
  ...props
}: ScopedProps<Omit<ReactMarkdownOptions, 'children'>>) {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { __scopeComment } = props
  const context = useCommentContext(COMMENTS_NAME, __scopeComment)
  return (
    <div>
      {!context.value ? (
        <div>There is nothing to preview.</div>
      ) : (
        <ReactMarkdown
          className={cn('prose', className)}
          remarkPlugins={[remarkGfm]}
          {...props}
        >
          {context.value}
        </ReactMarkdown>
      )}
    </div>
  )
}

export {
  Comment,
  CommentHeader,
  CommentTabs,
  CommentTabsList,
  CommentTabTrigger,
  CommentContent,
  CommentTabsContent,
  CommentFooter,
  CommentMarkdownMessage,
  CommentMarkdownRender,
  CommentMarkdownEditor,
}
