
import IssueItem from "./IssueItem"
import type { Issue } from "./types"

export default function IssueListBody({ issues: issues }: { issues: Issue[] }) {
  return (
    <>
      {issues.length === 0 ? <div className="p-4">No issues found! Try creating some</div>
      :
      issues.map((issue, index) => (
        <IssueItem key={index} issue={issue} />
      ))
      }
    </>
  )
}
