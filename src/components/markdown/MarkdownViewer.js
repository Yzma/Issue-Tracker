import React from "react"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

const MarkdownViewer = ({ text }) => {
  return (
    <ReactMarkdown className="prose" remarkPlugins={[remarkGfm]}>
      {text}
    </ReactMarkdown>
  )
}

export default MarkdownViewer
