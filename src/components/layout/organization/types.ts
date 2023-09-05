import { PropsWithChildren } from 'react'
import { OrganizationBelowNavbarProps } from '../../navbar/OrganizationBelowNavbar'

export type OrganizationLayoutPageProps = {
  page: React.ReactElement
  organizationName: string
  variant: OrganizationBelowNavbarProps['variant']
}

export type OrganizationLayoutProps = PropsWithChildren &
  Omit<OrganizationLayoutPageProps, 'page'>

export type OrganizationMemberLayoutProps = PropsWithChildren &
  Omit<OrganizationLayoutPageProps, 'page' | 'variant'>
