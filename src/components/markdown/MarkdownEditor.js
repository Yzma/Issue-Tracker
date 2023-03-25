import React, { useState } from "react"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import MarkdownIt from "markdown-it"

import dynamic from "next/dynamic"

import "react-markdown-editor-lite/lib/index.css"
import { Tab as Tab2 } from "@headlessui/react"

const MdEditor = dynamic(() => import("react-markdown-editor-lite"), {
  ssr: true
})

const mdParser = new MarkdownIt({})

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

const MarkdownEditor = (props) => {
  const [text, setText] = useState(props.placeholder)

  return (
    <>
      <div className="w-full max-w-md px-2 py-5 sm:px-0">
        <Tab2.Group>
          <Tab2.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
            <Tab2
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-white shadow"
                    : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                )
              }
            >
              Write
            </Tab2>

            <Tab2
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-white shadow"
                    : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                )
              }
            >
              Preview
            </Tab2>
          </Tab2.List>
          <Tab2.Panels className="mt-2">
            <Tab2.Panel
              className={classNames(
                "rounded-xl bg-white p-3",
                "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
              )}
            >
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
            </Tab2.Panel>

            <Tab2.Panel
              className={classNames(
                "rounded-xl bg-white p-3",
                "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
              )}
            >
              <article class="prose md:prose-lg lg:prose-xl">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {text}
                </ReactMarkdown>
              </article>
            </Tab2.Panel>
          </Tab2.Panels>
        </Tab2.Group>
        {props.children}
      </div>
    </>
  )
}
export default MarkdownEditor
