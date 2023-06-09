import React, { createContext, useContext } from 'react'

import Link from 'next/link'

export default function BelowNavbar({ children }) {
  return <>{children}</>
}

function BreadcrumbLinks({ children }) {
  return (
    <div className="px-4 sm:px-6 lg:px-8 pt-7 pb-1 w-full max-w-9xl mx-auto">
      <div className="flex flex-row pl-2">
        {React.Children.map(children, (child, index) => (
          <>
            {child}
            {children.length > 1 &&
              index !== children.length - 1 &&
              children.length !== 1 && (
                <p className="text-2xl px-1 font-light">/</p>
              )}
          </>
        ))}
      </div>
    </div>
  )
}

BelowNavbar.BreadcrumbLinks = BreadcrumbLinks

function BreadcrumbLink({ children }) {
  return (
    <p className="text-2xl text-blue-600 hover:text-blue-900 hover:underline">
      {children}
    </p>
  )
}

BelowNavbar.BreadcrumbLink = BreadcrumbLink

const NavbarContext = createContext({ selected: '' })

function MenuList({ children, selected = '' }) {
  return (
    <NavbarContext.Provider value={{ selected }}>
      <div className="px-4 sm:px-6 lg:px-8 pt-6 pb-2 w-full max-w-9xl mx-auto border-b-2 border-gray-400">
        <div className="flex flex-row gap-x-4">{children}</div>
      </div>
    </NavbarContext.Provider>
  )
}

BelowNavbar.MenuList = MenuList

function MenuListItem({ children, id, href }) {
  const { selected } = useContext(NavbarContext)
  console.log(`Selected from context (${selected})`)
  return (
    <Link href={href}>
      <div
        className={`flex flex-row px-2 py-2 rounded hover:bg-gray-300 ${selected === id && 'border-b-4 border-indigo-500'
          }`}
      >
        {children}
      </div>
    </Link>
  )
}

BelowNavbar.MenuListItem = MenuListItem
