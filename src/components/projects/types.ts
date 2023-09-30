import { Project } from '@/types/types'

export type ProjectListProjectItem = Pick<
  Project,
  'name' | 'namespace' | 'description' | 'private' | 'createdAt'
>

export type ProjectItemType = {
  project: ProjectListProjectItem
}

export type SharedProjectListProps = {
  loading: boolean
  createProjectLink: string | undefined
  projects: ProjectListProjectItem[]
}
