import IssueItem from './IssueItem'
import type { Issue } from './types'

export default function IssueListBody({ issues }: { issues: Issue[] }) {
  return (
    <div>
      {issues.length === 0 ? (
        <div className="p-4">No issues found! Try creating some</div>
      ) : (
        issues.map((issue) => <IssueItem key={issue.id} issue={issue} />)
      )}
    </div>
  )
}
