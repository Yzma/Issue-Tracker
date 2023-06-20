import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { UserResponse } from '@/types/types'

export type UserResponseType = UserResponse['user']

// export type UserResponse = {
//   type: 'User'
//   namespace: {
//     id: string
//     name: string
//     userId: string
//   }
//   user: {
//     username: string
//     bio: string
//     socialLink1: string
//     socialLink2: string
//     socialLink3: string
//     socialLink4: string
//     projects: Project[]
//     organizations: string[]
//   }
// }

export type UserResponseType1 = {
  data: UserResponse['user']
}

export type SocialLinks = {
  links: UserResponse['user']['socialLinks']
}

export interface SocialLink {
  regex: RegExp
  icon: IconDefinition
}
