import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function HomeFooter() {
  return (
    <div className="border-t border-gray-200 py-4 px-4 md:flex md:items-center md:justify-between md:py-8">
      <div className="mr-4 mb-4 text-sm md:mb-0">
        &copy; Issue Tracker. All rights reserved.
      </div>
      <ul className="mb-4 flex md:mb-0">
        <li className="flex">
          <a
            href="https://github.com/Yzma/Issue-Tracker"
            className="flex content-center items-center justify-center"
          >
            <FontAwesomeIcon
              className="h-4 w-4 hover:text-gray-900"
              icon={faGithub}
            />
          </a>
        </li>

        <li className="ml-4 flex">
          <a
            href="https://www.linkedin.com/in/andrew-caruso-7129b419a/"
            className="flex content-center items-center justify-center"
          >
            <FontAwesomeIcon
              className="h-4 w-4 hover:text-gray-900"
              icon={faLinkedin}
            />
          </a>
        </li>
      </ul>
    </div>
  )
}
