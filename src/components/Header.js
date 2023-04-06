import React, { useState } from "react"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBug, faBars } from "@fortawesome/free-solid-svg-icons"
import { useSession, signIn, signOut } from "next-auth/react"

const Header = () => {
  const { data: session } = useSession()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <header className="sticky top-0 bg-green-300 border-b border-gray-200 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 -mb-px">
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="flex items-center text-gray-700 font-bold text-lg hover:text-gray-900"
            >
              <FontAwesomeIcon icon={faBug} size="2x" className="pr-2" />
              <div>Bug-Zapper</div>
            </Link>
            <Link
              href="/globalissue"
              className="text-gray-600 font-bold hover:text-gray-800 hover:underline"
            >
              Issues
            </Link>
          </div>
          <nav className="flex items-center space-x-3">
            <ul className="flex items-center space-x-3">
              <li>
                <a
                  href={`/${session?.namespace}`}
                  className="text-gray-600 hover:text-gray-800 hover:underline"
                >
                  {session?.namespace}
                </a>
              </li>
              <li className="relative">
                <button
                  className="text-gray-500 hover:text-gray-600"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <FontAwesomeIcon icon={faBars} />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-gray-700 divide-y divide-gray-100">
                    <Link
                      href="/projects/create"
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Create Project
                    </Link>
                    <Link
                      href="/orgs/create"
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Create Organization
                    </Link>
                    <Link
                      href="/invites"
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      My Invites
                    </Link>
                    {session ? (
                      <a
                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                        onClick={() => signOut({ callbackUrl: "/" })}
                      >
                        Sign Out
                      </a>
                    ) : (
                      <a
                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                        onClick={() => signIn()}
                      >
                        Sign In
                      </a>
                    )}
                  </div>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
