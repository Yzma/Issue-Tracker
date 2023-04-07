import React from "react"
import { useRouter } from "next/router"
import Link from "next/link"

const UserSection = ({ users }) => {
  const router = useRouter()
  const { namespaceName } = router.query

  return (
    <section className="bg-white shadow-md rounded-md p-6 w-3/4 mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Users</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <Link href={`/${user}`} passHref>
                  <span className="cursor-pointer hover:text-blue-600">
                    {user}
                  </span>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

export default UserSection
