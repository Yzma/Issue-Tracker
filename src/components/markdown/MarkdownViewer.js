import React from "react"

import SSRProvider from "react-bootstrap/SSRProvider"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

const MarkdownViewer = ({ text }) => {
  return (
    <SSRProvider>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
    </SSRProvider>
  )
}

export default MarkdownViewer
