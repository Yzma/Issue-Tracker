import { IconDefinition } from '@fortawesome/fontawesome-svg-core'

export type MenuItem = {
  title: string
  href: string
  icon: IconDefinition
  isActive?: (pathname: string) => boolean
  shouldRender?: boolean
}
