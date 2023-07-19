import Link from 'next/link'
import moment from 'moment'
import { Project } from '@/types/types'
import { Badge } from '../ui/badge'

type ProjectItemProps = {
  project: Project
}

export default function ProjectItem({ project }: ProjectItemProps) {
  return (
    <div>
      <div>
        <div className="flex flex-col gap-y-1 py-6">
          <div className="flex gap-x-1.5">
            <Link
              href={`/${project.namespace}/${project.name}`}
              className="inline text-2xl text-blue-600 hover:text-blue-900 hover:cursor-pointer hover:underline pr-1"
            >
              {project.name}
            </Link>

            <div className="flex align-middle pt-2">
              <Badge className="bg-gray-700 h-5">
                {project.private ? <>Private</> : <>Public</>}
              </Badge>
            </div>
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
