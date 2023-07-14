import { Label } from '@prisma/client'

export type Issue = {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
  open: boolean
  labels: Pick<Label, 'name' | 'description' | 'color'>[]
  user: {
    username: string
  }
  project: {
    name: string
    namespace: {
      name: string
    }
  }
}
