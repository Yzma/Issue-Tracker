import { Project } from '@/server/routers/common'

export type ProjectListProjectItem = Pick<
  Project,
  'name' | 'namespace' | 'description' | 'private' | 'createdAt'
>

export type ProjectItemType = {
  project: ProjectListProjectItem
}

export type SharedProjectListProps = {
  status: 'success' | 'loading' | 'error'
  createProjectLink: string | undefined
  projects: Project[] | undefined
}
