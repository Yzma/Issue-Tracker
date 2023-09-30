/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookBookmark } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'
import { cn } from '@/lib/utils'
import { Badge } from '../ui/badge'
import { ProjectItemType } from './types'
import { Button, ButtonProps } from '../ui/button'
import { Separator } from '../ui/separator'
import { CustomLink } from '../ui/common'
import { Input, InputProps } from '../ui/input'

const ProjectList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      className={cn('content-start gap-x-1 pt-6', className)}
      ref={ref}
      {...props}
    />
  )
})
ProjectList.displayName = 'ProjectList'

const ProjectListHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div className="w-full space-y-2">
      <div
        className={cn('flex w-full gap-x-2 gap-y-2 max-md:flex-col', className)}
        ref={ref}
        {...props}
      />
      <Separator />
    </div>
  )
})
ProjectListHeader.displayName = 'ProjectListHeader'

const ProjectListInputSearch = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className }, ref) => {
    return (
      <Input
        ref={ref}
        type="search"
        placeholder="Find a project..."
        className={cn(className)}
      />
    )
  }
)
ProjectListInputSearch.displayName = 'ProjectListInputSearch'

const ProjectListInputButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Button ref={ref} size="sm" className={cn(className)} {...props}>
        {children}
      </Button>
    )
  }
)
ProjectListInputButton.displayName = 'ProjectListInputButton'

// This could be split up into multiple smaller sub-components, but since this never changes, it will be left as is for now.
const ProjectListItem = React.forwardRef<HTMLDivElement, ProjectItemType>(
  ({ project }, ref) => {
    return (
      <div
        className="mx-auto flex w-full flex-col gap-y-1 border-b border-gray-300 py-6"
        ref={ref}
      >
        <div className="flex gap-x-1.5">
          <CustomLink
            href={`/${project.namespace}/${project.name}`}
            className="pr-1 text-2xl"
          >
            {project.name}
          </CustomLink>

          <div className="flex pt-2 align-middle">
            <Badge className="h-5 bg-gray-700">
              {project.private ? <>Private</> : <>Public</>}
            </Badge>
          </div>
        </div>
        <div>
          <p className="text-base text-gray-600">{project.description}</p>
        </div>
        <div className="flex gap-x-3">
          <p className="text-base text-gray-600">
            Last Updated: {moment(project.createdAt).fromNow()}
          </p>
        </div>
      </div>
    )
  }
)
ProjectListItem.displayName = 'ProjectListItem'

const ProjectListEmpty = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-y-5 p-10 text-4xl',
        className
      )}
      ref={ref}
      {...props}
    >
      <FontAwesomeIcon size="lg" icon={faBookBookmark} />
      No projects found
      {children}
    </div>
  )
})
ProjectListEmpty.displayName = 'ProjectListEmpty'

export {
  ProjectList,
  ProjectListHeader,
  ProjectListItem,
  ProjectListEmpty,
  ProjectListInputSearch,
  ProjectListInputButton,
}
