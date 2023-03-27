import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import moment from "moment";

const OrganizationSection = ({ organizations }) => {
  const router = useRouter();

  const handleCreateOrganization = () => {
    router.push("/orgs/create");
  };

  return (
    <section className="bg-white shadow-md rounded-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Organizations</h2>
        <button
          onClick={handleCreateOrganization}
          className="btn bg-green-600 hover:bg-green-500 text-white"
        >
          Create Organization
        </button>
      </div>
      {typeof organizations === "undefined" ? (
        <p>No Organization Found</p>
      ) : (
        <>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {organizations.map((organization) => (
                <tr key={organization.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <Link href={`/${organization.name}`}>
                      {organization.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {moment(organization.createdAt).format("MMM Do YY")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </section>
  )
};

export default OrganizationSection;

// import React from "react";
// import Link from "next/link";
// import { useRouter } from "next/router";

// const OrganizationSection = ({ organizations }) => {
//   const router = useRouter();

//   const handleCreateOrganization = () => {
//     router.push("/orgs/create");
//   };

//   return (
//     <section className="bg-white shadow-md rounded-md p-6">
//       {typeof organizations === "undefined" ? (
//         <p>No Organization Found</p>
//       ) : (
//         <>
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Name
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Created At
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {organizations.map((organization) => (
//                 <tr key={organization.id}>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                     <Link href={`/orgs/${organization.name}`}>
//                       {organization.name}
//                     </Link>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {new Date(organization.createdAt).toLocaleDateString()}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </>
//       )}
//       <div className="flex justify-center mt-4">
//         <button
//           onClick={handleCreateOrganization}
//           className="btn bg-green-600 hover:bg-green-500 text-white"
//         >
//           Create Organization
//         </button>
//       </div>
//     </section>
//   );
// };

// export default OrganizationSection;
