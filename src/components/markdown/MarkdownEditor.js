import MarkdownIt from "markdown-it"
import dynamic from "next/dynamic"

import "react-markdown-editor-lite/lib/index.css"

const MdEditor = dynamic(() => import("react-markdown-editor-lite"), {
  ssr: true
})

const mdParser = new MarkdownIt({})

const MarkdownEditor = (props) => {
  return (
    <>
      <MdEditor
        renderHTML={(text) => mdParser.render(text)}
        view={{ menu: true, md: true, html: false }}
        {...props}
      />
      {props.children}
    </>
  )
}

export default MarkdownEditor
