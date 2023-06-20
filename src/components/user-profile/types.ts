import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { UserResponse } from '@/types/types'

export type UserResponseType = UserResponse['user']

export type SocialLinks = {
  links: UserResponse['user']['socialLinks']
}

export interface SocialLink {
  regex: RegExp
  icon: IconDefinition
}
