/* eslint-disable no-nested-ternary */
import { Skeleton } from '../ui/skeleton'
import IssueItem from './IssueItem'
import type { Issue } from './types'

type IssueListBodyProps = {
  issues: Issue[]
  showFullPath: boolean
  loading: boolean
}

function LoadingListItem() {
  return (
    <div className="flex flex-col gap-y-1 border-b border-gray-300 h-20 pt-5">
      <Skeleton className="h-4 mx-4" />
      <Skeleton className="h-4 mx-4 w-[350px]" />
    </div>
  )
}

export default function IssueListBody({
  issues,
  loading,
  showFullPath,
}: IssueListBodyProps) {
  return (
    <div>
      {loading ? (
        <div className="font-bold text-3xl border-t border-gray-300">
          <LoadingListItem />
          <LoadingListItem />
          <LoadingListItem />
          <LoadingListItem />
        </div>
      ) : issues.length === 0 ? (
        <div className="flex items-center justify-center h-56 font-bold text-3xl border-t border-gray-300">
          No issues found!
        </div>
      ) : (
        issues.map((issue) => (
          <IssueItem key={issue.id} showFullPath={showFullPath} issue={issue} />
        ))
      )}
    </div>
  )
}
