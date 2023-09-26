import Link from 'next/link'
import moment from 'moment'
import { Badge } from '../ui/badge'
import { Project } from '@/server/routers/common'

type ProjectItemProps = {
  project: Project
}

export default function ProjectItem({ project }: ProjectItemProps) {
  return (
    <div className="mx-auto flex w-full flex-col gap-y-1 border-b border-gray-300 py-6">
      <div className="flex gap-x-1.5">
        <Link
          href={`/${project.namespace}/${project.name}`}
          className="inline pr-1 text-2xl text-blue-600 hover:cursor-pointer hover:text-blue-900 hover:underline"
        >
          {project.name}
        </Link>

        <div className="flex pt-2 align-middle">
          <Badge className="h-5 bg-gray-700">
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
