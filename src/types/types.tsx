import { OrganizationRole } from '@prisma/client'

export type User = {
  id: string
  username: string
  bio: string | null
  socialLink1: string | null
  socialLink2: string | null
  socialLink3: string | null
  socialLink4: string | null
}

export type OrganizationMember = {
  id: string
  role: OrganizationRole
  createdAt: Date
  userId: string
  organizationId: string
}

export type SharedProperties = {
  namespace: {
    id: string
    name: string
    projects: Project[]
  }
}

export type UserProfileProps = SharedProperties & {
  type: 'User'
  user: User
  organizations: {
    name: string
  }[]
}

export type OrganizationProps = SharedProperties & {
  type: 'Organization'
  organization: {
    id: string
    name: string
    createdAt: Date
    updatedAt: Date
    members: OrganizationMember[]
  }
}

export type Project = {
  id: string
  name: string
  namespace: string
  description: string
  private: boolean
  createdAt: Date
  updatedAt: Date
}

export type UserResponse = {
  type: 'User'
  namespace: {
    id: string
    name: string
    userId: string
  }
  user: {
    username: string
    bio: string | undefined
    socialLinks: string[]
    projects: Project[]
    organizations: string[]
  }
}

export type OrganizationResponse = {
  type: 'Organization'
  namespace: {
    id: string
    name: string
    organizationId: string
  }
  organization: {
    id: string
    name: string
    createdAt: Date
    projects: Project[]
  }
  member: {
    role: OrganizationRole | undefined
  }
}

export type SearchFilters = {
  open: boolean
  sort: 'newest' | 'oldest' | 'recently-updated' | 'least-recently-updated'
}

export type Optional<T, K extends keyof T> = {
  [P in keyof T]: P extends K ? T[P] | undefined : T[P]
}
