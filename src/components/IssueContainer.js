import React from 'react'
import Link from 'next/link'
import moment from 'moment'

// TODO: We're prop drilling here, figure out a way to make the routing nicer. Context API?
function Issue({ issue, routePath }) {
  console.log('routePath', routePath)
  return (
    <tr>
      <td className="p-2 text-left">
        <Link href={`${routePath}/issues/${issue.id}`}>{issue.name}</Link>
      </td>
      <td className="p-2 text-left">
        {issue.labels.map((label) => label.name).join(', ')}
      </td>
      <td className="p-2 text-left">{issue.open ? 'Open' : 'Closed'}</td>
      <td className="p-2 text-left">
        {moment(issue.createdAt).format('MMM Do YY')}
      </td>
      <td className="p-2 text-left">
        {moment(issue.updatedAt).format('MMM Do YY')}
      </td>
    </tr>
  )
}

export default Issue
