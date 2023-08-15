import { PropsWithChildren } from 'react'

export type ProjectLayoutPageProps = {
  page: React.ReactElement
  namespaceName: string
  projectName: string
}

export type ProjectLayoutProps = PropsWithChildren &
  Omit<ProjectLayoutPageProps, 'page'>

export type ProjectMemberLayoutProps = PropsWithChildren &
  Omit<ProjectLayoutPageProps, 'page'>
