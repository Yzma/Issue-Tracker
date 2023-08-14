import Link from 'next/link'
import moment from 'moment'
import { Badge } from '../ui/badge'
import { Project } from '@/server/routers/common'

type ProjectItemProps = {
  project: Project
}

export default function ProjectItem({ project }: ProjectItemProps) {
  return (
    <div className="flex flex-col gap-y-1 py-6 border-gray-300 border-b mx-auto w-full">
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
          Last Updated: {moment(project.createdAt).fromNow()}
        </p>
      </div>
    </div>
  )
}
