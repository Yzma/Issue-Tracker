import Link from "next/link"
import * as Avatar from "@radix-ui/react-avatar"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faGithub,
  faLinkedin,
  faTwitter
} from "@fortawesome/free-brands-svg-icons"
import { faEnvelope } from "@fortawesome/free-solid-svg-icons"

export default function ProfileContainer({ data }) {
  return (
    <div className="relative">
      <div className="flex flex-col">
        <div className="flex items-center justify-center">
          <div className="w-72 h-72 mb-4 bg-gray-200 text-gray-600 rounded-full" />
        </div>

        <div className="flex flex-col gap-y-0 items-start justify-start left-0 text-left">
          <div>
            <p className="text-xl font-bold">Full Name</p>
            <p className="text-xl font-light">Username</p>
          </div>

          <div className="flex flex-col gap-y-2">
            <p className="text-gray-500 py-2">
              {data.bio ||
                "This is a random bio, nothing of value here. Move on."}
            </p>
            <Link className="btn" href="/usersettings">
              Edit Profile
            </Link>
            {/* <Link className="text-gray-500 hover:text-gray-700" href={"/"}>
                <FontAwesomeIcon className="pr-1" icon={faGithub} />Yzma
              </Link>
              <Link className="text-gray-500 hover:text-gray-700" href={"/"}>
                <FontAwesomeIcon className="pr-1" icon={faGithub} />Yzma
              </Link> */}
          </div>
        </div>

        <div className="flex space-x-2 mb-2">
          {data.github && (
            <Link
              className="text-gray-500 hover:text-gray-700"
              href={data.github}
            >
              <FontAwesomeIcon icon={faGithub} />
            </Link>
          )}

          {data.linkedIn && (
            <Link
              className="text-gray-500 hover:text-gray-700"
              href={data.linkedIn}
            >
              <FontAwesomeIcon icon={faLinkedin} />
            </Link>
          )}

          {data.twitter && (
            <Link
              className="text-gray-500 hover:text-gray-700"
              href={data.twitter}
            >
              <FontAwesomeIcon icon={faTwitter} />
            </Link>
          )}

          {data.publicEmail && (
            <Link
              className="text-gray-500 hover:text-gray-700"
              href={`mailto:${data.publicEmail}`}
            >
              <FontAwesomeIcon icon={faEnvelope} />
            </Link>
          )}
        </div>
      </div>
      <hr className="border-gray-300 my-4 mx-auto w-full" />
      <div className="flex flex-col gap-y-2 items-start justify-start left-0 text-left">
        <p className="text-xl font-bold">Organizations</p>
        <Avatar.Root className="inline-flex hover:cursor-pointer h-[45px] w-[45px] select-none items-center justify-center overflow-hidden rounded align-middle">
          <Avatar.Fallback
            className="text-violet11 leading-1 flex h-full w-full items-center justify-center bg-white text-[15px] font-medium"
            delayMs={600}
          >
            A
          </Avatar.Fallback>
        </Avatar.Root>
      </div>
    </div>
  )
}
