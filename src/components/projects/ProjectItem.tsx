import Link from 'next/link'
import moment from 'moment'
import { Project } from '@/types/types'

export default function ProjectItem({ project }: { project: Project }) {
  return (
    <div>
      <div>
        <div className="flex flex-col gap-y-1 py-3">
          <div>
            <Link
              href={`/${project.namespace}/${project.name}`}
              className="inline text-2xl text-blue-600 hover:text-blue-900 hover:cursor-pointer hover:underline pr-1"
            >
              {project.name}
            </Link>

            <span className="text-sm text-center font-semibold text-white px-1.5 bg-gray-700 rounded-full">
              {project.private ? <>Private</> : <>Public</>}
            </span>
          </div>
          <div>
            <p className="text-base text-gray-600">{project.description}</p>
          </div>
          <div className="flex gap-x-3">
            <p className="text-base text-gray-600">
              Created: {moment(project.updatedAt).format('MMM Do YY')}
            </p>
            <p className="text-base text-gray-600">
              Last Updated: {moment(project.createdAt).fromNow()}
            </p>
          </div>
        </div>
        <hr className="border-gray-300 mx-auto w-full" />
      </div>
    </div>
  )
}
