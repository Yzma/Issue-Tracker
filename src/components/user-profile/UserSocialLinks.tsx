import Link from "next/link"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faGithub,
  faGitlab,
  faLinkedin,
  faTwitter,
  faFacebook,
  faYoutube,
  faInstagram,
  faStackOverflow,
} from "@fortawesome/free-brands-svg-icons"
import { faEnvelope, faCode, IconDefinition } from "@fortawesome/free-solid-svg-icons"

type SocialLink = {
  regex: RegExp,
  icon: IconDefinition
}

const socialLinksTable: SocialLink[] = [
  {
    regex: new RegExp('^(https?:\/\/)?(www\.)?github\.com', 'i'),
    icon: faGithub
  },
  {
    regex: new RegExp('^(https?:\/\/)?(www\.)?gitlab\.com', 'i'),
    icon: faGitlab
  },
  {
    regex: new RegExp('^(https?:\/\/)?(www\.)?linkedin\.com', 'i'),
    icon: faLinkedin
  },
  {
    regex: new RegExp('^(https?:\/\/)?(www\.)?twitter\.com', 'i'),
    icon: faTwitter
  },
  {
    regex: new RegExp('^(https?:\/\/)?(www\.)?facebook\.com', 'i'),
    icon: faFacebook
  },
  {
    regex: new RegExp('^(https?:\/\/)?(www\.)?youtube\.com', 'i'),
    icon: faYoutube
  },
  {
    regex: new RegExp('^(https?:\/\/)?(www\.)?instagram\.com', 'i'),
    icon: faInstagram
  },
  {
    regex: new RegExp('^(https?:\/\/)?(www\.)?stackoverflow\.com', 'i'),
    icon: faStackOverflow
  },
  {
    regex: new RegExp('\A[A-Z0-9+_.-]+@[A-Z0-9.-]+', 'i'),
    icon: faEnvelope
  }
]

export default function UserSocialLinks({ links }: { links: string[] }) {

  function lookupLinkIconDefinition(link: string): IconDefinition {
    const foundLinkIcon = socialLinksTable.find(value => value.regex.test(link))
    return foundLinkIcon?.icon || faCode
  }

  return (
    <div className="flex space-x-2 mb-2">
      {links.map((link, index) => {
        const icon = lookupLinkIconDefinition(link)
        return (
          <Link key={index} href={link} passHref legacyBehavior>
            <a className="text-gray-500 hover:text-gray-700">
              <FontAwesomeIcon icon={icon} />
            </a>
          </Link>
        )
      })}
    </div>
  )
}
