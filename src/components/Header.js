import React, { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBug } from "@fortawesome/free-solid-svg-icons";
import { useSession, signIn, signOut } from "next-auth/react";
import { faBars } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 bg-green-300 border-b border-gray-200 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 -mb-px">

          <div className="flex items-center space-x-3">
            <FontAwesomeIcon icon={faBug} size="2x" className="text-gray-500" />
            <Link href="/" className="text-gray-800 font-bold text-lg">
              Bug-Zapper
            </Link>
          </div>
          <nav className="flex items-center space-x-3">
            <ul className="flex items-center space-x-3">
              <li>
                <Link href="/globalissue" className="text-gray-600 hover:text-gray-800">
                  Issues
                </Link>
              </li>
              <li>
                <a href={`/${session?.namespace}`} className="text-gray-600 hover:text-gray-800">
                  {session?.namespace}
                </a>
              </li>
              <li className="relative">
                <button className="text-gray-500 hover:text-gray-600" onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <FontAwesomeIcon icon={faBars} />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-gray-700 divide-y divide-gray-100">
                    <Link href="/projects/create" className="block px-4 py-2 text-sm hover:bg-gray-100">
                      Create Project
                    </Link>
                    <Link href="/orgs/create" className="block px-4 py-2 text-sm hover:bg-gray-100">
                      Create Organization
                    </Link>
                    {session ? (
                      <button
                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                        onClick={() => signOut()}
                      >
                        Sign Out
                      </button>
                    ) : (
                      <button
                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                        onClick={() => signIn()}
                      >
                        Sign In
                      </button>
                    )}
                  </div>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

