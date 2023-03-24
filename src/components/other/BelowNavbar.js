import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBug, faGear } from "@fortawesome/free-solid-svg-icons"

import Link from "next/link"

function BelowNavbar({ namespaceName, projectName }) {
  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 pt-7 pb-1 w-full max-w-9xl mx-auto">
        <div className="flex flex-row pl-2">
          <p className="text-2xl text-blue-600 hover:text-blue-900 hover:underline">
            <Link href={`/${namespaceName}`}>{namespaceName}</Link>
          </p>
          <p className="text-2xl px-1 font-light">/</p>
          <p className="text-2xl font-semibold text-blue-600 hover:text-blue-900 hover:underline">
            <Link href={`/${namespaceName}/${projectName}`}>{projectName}</Link>
          </p>
          <div className="pl-3" />
          <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-black border-2 border-gray-600 rounded-full">
            Public
          </span>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 pt-6 pb-2 w-full max-w-9xl mx-auto border-b-2 border-gray-400">
        <div className="flex flex-row gap-x-4">

          <Link href={`/${namespaceName}/${projectName}`}>
            <div className="flex flex-row px-2 py-2 rounded hover:bg-gray-300">
              <div className="">
                <FontAwesomeIcon icon={faBug} />
              </div>
              <div className="pl-2">Issues</div>
            </div>
          </Link>

          <Link href={`/${namespaceName}/${projectName}/members`}>
            <div className="flex flex-row px-2 py-2 rounded hover:bg-gray-300">
              <div className="">
                <FontAwesomeIcon icon={faGear} />
              </div>
              <div className="pl-2">Settings</div>
            </div>
          </Link>

        </div>
      </div>
    </>
  )
}

export default BelowNavbar
