import React from "react"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faLock,
  faEllipsis,
  faThumbTack,
  faTrash,
  faGear
} from "@fortawesome/free-solid-svg-icons"
{/* <BelowNavbar>
<BelowNavbar.Breadcrumb>
  <BelowNavbar.BreadcrumbItem>

  </BelowNavbar.BreadcrumbItem>
  <BelowNavbar.BreadcrumbItem>

  </BelowNavbar.BreadcrumbItem>
</BelowNavbar.Breadcrumb>

<BelowNavbar.Menu>
  <BelowNavbar.MenuItem>

  </BelowNavbar.MenuItem>
  <BelowNavbar.MenuItem>

  </BelowNavbar.MenuItem>
</BelowNavbar.Menu>
</BelowNavbar> */}

export default function BelowNavbar({children}) {
  return (
    <>
      {children}
    </>
  )
}

// function Section({ children }) {
//   return (
//     <div className="px-4 sm:px-6 lg:px-8 pt-7 pb-1 w-full max-w-9xl mx-auto">
//       <div className="flex flex-row pl-2">
//         {children}
//       </div>
//     </div>
//   )
// }

// BelowNavbar.Section = Section

{/* <BelowNavbar.BreadcrumbLinks>
<BelowNavbar.BreadcrumbLink>
  <Link href={`/${namespaceName}`}>{namespaceName}</Link>
</BelowNavbar.BreadcrumbLink>

<BelowNavbar.BreadcrumbLink>
  <Link href={`/${namespaceName}/${projectName}`}>{projectName}</Link>
</BelowNavbar.BreadcrumbLink>
</BelowNavbar.BreadcrumbLinks> */}

function BreadcrumbLinks({ children }) {
  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 pt-7 pb-1 w-full max-w-9xl mx-auto">
        <div className="flex flex-row pl-2">
          {React.Children.map(children, (child, index) => (
            <>
              {child}
              {index !== children.length - 1 && (
                <p className="text-2xl px-1 font-light">/</p>
              )}
            </>
          ))}
          {/* {children.map((e, index) => (
            <>
              {e}
              {index !== children.length - 1 && (
                <p className="text-2xl px-1 font-light">/</p>
              )}
            </>
          ))} */}
        </div>
      </div>
    </>
  )
}

BelowNavbar.BreadcrumbLinks = BreadcrumbLinks

function BreadcrumbLink({ children }) {
  return (
    <>
      <p className="text-2xl text-blue-600 hover:text-blue-900 hover:underline">
        {children}
      </p>
    </>
  )
}

BelowNavbar.BreadcrumbLink = BreadcrumbLink

function MenuListItem({ children, href }) {
  return (
    <>
      <Link href={href}>
        <div className="flex flex-row px-2 py-2 rounded hover:bg-gray-300">
          {children}
        </div>
      </Link>

      {/* <div className="flex flex-row px-2 py-2 rounded hover:bg-gray-300">
        {children}
      </div> */}

      {/* <div className="flex flex-row px-2 py-2 rounded text-gray-400 no-underline	 hover:underline hover:bg-gray-300">
        {/* <FontAwesomeIcon icon={faBug} /> 
        <Link
          className="text-gray-400 no-underline hover:no-underline"
          href={`/d/$d`}
        >
          <div className="pl-2">Issues</div>
        </Link>
      </div> */}
    </>
  )
}

BelowNavbar.MenuListItem = MenuListItem

function MenuList({ children }) {
  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 pt-6 pb-2 w-full max-w-9xl mx-auto border-b-2 border-gray-400">
        <div className="flex flex-row gap-x-4">

          {children}

        </div>
      </div>
    </>
  )
}

BelowNavbar.MenuList = MenuList


// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// import { faBug, faGear } from "@fortawesome/free-solid-svg-icons"

// import Link from "next/link"

// function BelowNavbar({ namespaceName, projectName }) {
//   return (
//     <>
//       <div className="px-4 sm:px-6 lg:px-8 pt-7 pb-1 w-full max-w-9xl mx-auto">
//         <div className="flex flex-row pl-2">
          // <p className="text-2xl text-blue-600 hover:text-blue-900 hover:underline">
          //   <Link href={`/${namespaceName}`}>{namespaceName}</Link>
          // </p>
//           <p className="text-2xl px-1 font-light">/</p>
//           <p className="text-2xl font-semibold text-blue-600 hover:text-blue-900 hover:underline">
//             <Link href={`/${namespaceName}/${projectName}`}>{projectName}</Link>
//           </p>
//           <div className="pl-3" />
//           <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-black border-2 border-gray-600 rounded-full">
//             Public
//           </span>
//         </div>
//       </div>

//       <div className="px-4 sm:px-6 lg:px-8 pt-6 pb-2 w-full max-w-9xl mx-auto border-b-2 border-gray-400">
//         <div className="flex flex-row gap-x-4">

          // <Link href={`/${namespaceName}/${projectName}`}>
          //   <div className="flex flex-row px-2 py-2 rounded hover:bg-gray-300">
          //     <div className="">
          //       <FontAwesomeIcon icon={faBug} />
          //     </div>
          //     <div className="pl-2">Issues</div>
          //   </div>
          // </Link>

//           <Link href={`/${namespaceName}/${projectName}/members`}>
//             <div className="flex flex-row px-2 py-2 rounded hover:bg-gray-300">
//               <div className="">
//                 <FontAwesomeIcon icon={faGear} />
//               </div>
//               <div className="pl-2">Settings</div>
//             </div>
//           </Link>

//         </div>
//       </div>
//     </>
//   )
// }

// export default BelowNavbar
