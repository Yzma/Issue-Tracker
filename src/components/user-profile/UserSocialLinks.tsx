import Link from 'next/link'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faGithub,
  faGitlab,
  faLinkedin,
  faTwitter,
  faFacebook,
  faYoutube,
  faInstagram,
  faStackOverflow,
} from '@fortawesome/free-brands-svg-icons'
import {
  faEnvelope,
  faCode,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons'

import { SocialLink } from './types'

const socialLinksTable: SocialLink[] = [
  {
    regex: /^(https?:\/\/)?(www.)?github.com/i,
    icon: faGithub,
  },
  {
    regex: /^(https?:\/\/)?(www.)?gitlab.com/i,
    icon: faGitlab,
  },
  {
    regex: /^(https?:\/\/)?(www.)?linkedin.com/i,
    icon: faLinkedin,
  },
  {
    regex: /^(https?:\/\/)?(www.)?twitter.com/i,
    icon: faTwitter,
  },
  {
    regex: /^(https?:\/\/)?(www.)?facebook.com/i,
    icon: faFacebook,
  },
  {
    regex: /^(https?:\/\/)?(www.)?youtube.com/i,
    icon: faYoutube,
  },
  {
    regex: /^(https?:\/\/)?(www.)?instagram.com/i,
    icon: faInstagram,
  },
  {
    regex: /^(https?:\/\/)?(www.)?stackoverflow.com/i,
    icon: faStackOverflow,
  },
  {
    regex: /A[A-Z0-9+_.-]+@[A-Z0-9.-]+/i,
    icon: faEnvelope,
  },
]

export default function UserSocialLinks({ links }: { links: string[] }) {
  function lookupLinkIconDefinition(link: string): IconDefinition {
    const foundLinkIcon = socialLinksTable.find((value) =>
      value.regex.test(link)
    )
    return foundLinkIcon?.icon || faCode
  }

  return (
    <div className="flex flex-col space-y-2 mb-2">
      {links
        .filter((e) => e || e.length > 0)
        .map((link) => {
          const icon = lookupLinkIconDefinition(link)
          return (
            <Link key={link} href={link} passHref legacyBehavior>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a className="text-gray-500 hover:text-gray-700">
                <FontAwesomeIcon className="pr-2" icon={icon} />
                {link}
              </a>
            </Link>
          )
        })}
    </div>
  )
}
