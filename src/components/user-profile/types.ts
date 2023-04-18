import { IconDefinition } from "@fortawesome/fontawesome-svg-core"

export interface ProfileInformation {
  name: string
  username: string
  profilePictureURL: string
  bio?: string
  socialLinks?: string[]
  organizations?: Organizations[]
}

export interface SocialLink {
  regex: RegExp,
  icon: IconDefinition
}
export interface Organizations {
  name: string
}
