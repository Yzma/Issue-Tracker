import Link from 'next/link'
import moment from 'moment'
import { Issue } from './types'
import Labels from '@/components/labels/Labels'

export default function IssueItem({ issue }: { issue: Issue }) {
  return (
    <div className="border-x border-b border-gray-200">
      <div className="flex flex-col gap-y-1 p-2">
        <div className="flex">
          <Link
            href={`/${issue.project.namespace.name}/${issue.project.name}/issues/${issue.id}`}
            className="inline text-l font-bold text-blue-600 hover:text-blue-900 hover:cursor-pointer hover:underline pr-1"
          >
            {issue.name}
          </Link>
          <Labels labels={issue.labels} />
        </div>

        <div>
          <p className="text-xs text-gray-600">
            Opened on {moment(issue.updatedAt).format('MMM Do, YYYY')} by{' '}
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
  )
}
