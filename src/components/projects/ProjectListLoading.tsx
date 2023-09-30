/* eslint-disable react/prop-types */
import React from 'react'
import { Skeleton } from '../ui/skeleton'
import { Separator } from '../ui/separator'
import { cn } from '@/lib/utils'

const ProjectListLoadingTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((_, ref) => {
  return (
    <div className="w-full" ref={ref}>
      <div className="space-y-2">
        <Skeleton className="h-7 w-full" />
        <Separator />
      </div>
    </div>
  )
})
ProjectListLoadingTitle.displayName = 'ProjectListLoadingTitle'

const ProjectListLoadingBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((_, ref) => {
  return (
    <>
      <div className="w-full" ref={ref}>
        <div className="mx-auto flex w-full flex-col gap-y-1 py-6">
          <div className="flex gap-x-1.5">
            <Skeleton className="h-7 w-40" />
          </div>
          <div>
            <Skeleton className="h-7 w-full" />
          </div>
          <div className="flex gap-x-3">
            <Skeleton className="h-7 w-full" />
          </div>
        </div>
      </div>
      <Separator />
    </>
  )
})
ProjectListLoadingBody.displayName = 'ProjectListLoadingBody'

const ProjectListLoading = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className }, ref) => {
  return (
    <div className={cn(className)} ref={ref}>
      <ProjectListLoadingTitle />
      <ProjectListLoadingBody />
      <ProjectListLoadingBody />
      <ProjectListLoadingBody />
    </div>
  )
})
ProjectListLoading.displayName = 'ProjectListLoading'

export { ProjectListLoadingTitle, ProjectListLoadingBody, ProjectListLoading }
