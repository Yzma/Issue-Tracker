import Link from 'next/link'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faCircleDot } from '@fortawesome/free-solid-svg-icons'
import { Issue } from './types'
import Labels from '@/components/labels/Labels'

type IssueItemProps = {
  issue: Issue
  showFullPath: boolean
}

export default function IssueItem({ issue, showFullPath }: IssueItemProps) {
  return (
    <div className="flex items-center hover:bg-slate-200 border-t border-gray-300 h-20">
      <div className="flex gap-y-1 px-5">
        <div className="flex mx-2 pt-2">
          {issue.open ? (
            <FontAwesomeIcon icon={faCircleDot} className="text-green-600" />
          ) : (
            <FontAwesomeIcon icon={faCheckCircle} className="text-purple-600" />
          )}
        </div>
        <div className="pl-1">
          <div className="flex">
            {showFullPath && (
              <Link
                href={`/${issue.project.namespace.name}/${issue.project.name}/issues/${issue.id}`}
                className="inline text-l font-bold text-lg text-gray-500 hover:text-blue-900 hover:cursor-pointer hover:underline pr-1"
              >
                {issue.project.namespace.name}/{issue.project.name}
              </Link>
            )}

            <Link
              href={`/${issue.project.namespace.name}/${issue.project.name}/issues/${issue.id}`}
              className="inline text-l font-bold text-lg text-blue-600 hover:text-blue-900 hover:cursor-pointer hover:underline pr-1"
            >
              {issue.name}
            </Link>
            <Labels labels={issue.labels} />
          </div>
          <div>
            <p className="text-sm text-gray-600">
              {issue.open ? 'Opened' : 'Closed'} on{' '}
              {moment(issue.updatedAt).format('MMM Do, YYYY')} by{' '}
              <Link
                href={`/${issue.user.username}`}
                className="font-semibold text-blue-600 hover:text-blue-900 hover:cursor-pointer hover:underline pr-1"
              >
                {issue.user.username}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
