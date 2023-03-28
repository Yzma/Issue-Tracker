import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import moment from "moment";

const ProjectSection = ({ projects }) => {
  const router = useRouter();
  const { namespaceName } = router.query;

  const handleCreateProject = () => {
    router.push("/projects/create");
  };

  return (
    <div className="w-3/4 mx-auto">
      <section className="bg-white shadow-md rounded-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Projects</h2>
          <button
            className="btn bg-green-600 hover:bg-green-500 text-white"
            onClick={handleCreateProject}
          >
            Create Project
          </button>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Update
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects.map((project) => (
              <tr key={project.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <Link href={`/${project.namespace.name}/${project.name}`}>
                    {project.name}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {project.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {moment(project.updatedAt).format("MMM Do YY")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default ProjectSection;

