import React from "react"
import styles from "@/styles/LabelList.module.css"

const LabelList = ({ labels }) => {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Title
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Label
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {labels.map((label, index) => (
          <tr key={index}>
            <td className={styles.cell}>{label.name}</td>
            <td className={styles.cell}>{label.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default LabelList
