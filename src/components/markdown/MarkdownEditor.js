import React, { useState } from "react"

import SSRProvider from "react-bootstrap/SSRProvider"
import Tab from "react-bootstrap/Tab"
import Tabs from "react-bootstrap/Tabs"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import MarkdownIt from "markdown-it"

import dynamic from "next/dynamic"

import "react-markdown-editor-lite/lib/index.css"

const MdEditor = dynamic(() => import("react-markdown-editor-lite"), {
  ssr: true
})

const mdParser = new MarkdownIt({})

const MarkdownEditor = (props) => {
  const [text, setText] = useState(props.placeholder)
  return (
    <SSRProvider>
      <div className="card">
        <div className="card-header">
          <Tabs
            defaultActiveKey="write"
            id="uncontrolled-tab-example"
            className="mb-3"
          >
            <Tab eventKey="write" title="Write">
              <div className="card-body">
                <MdEditor
                  value={text}
                  style={{ height: "350px" }}
                  renderHTML={(text) => mdParser.render(text)}
                  onChange={({ html, text }, event) => {
                    setText(text)
                    props.onChange?.(text)
                  }}
                  view={{ menu: true, md: true, html: false }}
                />
              </div>
            </Tab>

            <Tab eventKey="preview" title="Preview">
              <div className="card-body">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {text}
                </ReactMarkdown>
              </div>
            </Tab>
          </Tabs>
        </div>

        {props.children}
      </div>
    </SSRProvider>
  )
}
export default MarkdownEditor
