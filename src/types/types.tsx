import { OrganizationRole } from "@prisma/client"

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

export type Project = {
  id: string
  name: string
  description: string
  private: Boolean
  createdAt: Date
  updatedAt: Date
}

export type SharedProperties = {
  namespace: {
    id: string
    name: string
    projects: Project[]
  }
}

export type UserProfileProps = SharedProperties & {
  type: "User"
  user: User,
  organizations: {
    name: string
  }[]
}

export type OrganizationProps = SharedProperties & {
  type: "Organization"
  organization: {
    id: string
    name: string
    createdAt: Date
    updatedAt: Date
    members: OrganizationMember[];
  }
}
