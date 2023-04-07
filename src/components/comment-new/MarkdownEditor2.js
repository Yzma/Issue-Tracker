import React, { createContext, useState, Fragment } from "react"
import Link from "next/link"

import { Tab } from "@headlessui/react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons"

import MarkdownViewer from "@/components/markdown/MarkdownViewer"
import MarkdownEditor from "@/components/markdown/MarkdownEditor"


{
  /* <IssueComment
text={comment.description}
username={comment.user.username}
createdAt={comment.createdAt}
formatter={formatter}
canEdit={
  session &&
  session.namespace === comment.user.username
}
now={props.now}
onChange={(text) =>
  setFieldValue("description", text)
}
onEdit={() =>
  setEditComment({ id: comment.id })
} //setShowDescription(true)
onCancel={() => setEditComment(null)}
onSubmit={() => submitForm()}
editing={
  showEditComment !== null &&
  showEditComment.id === comment.id
}
/> */
}

export default function MarkdownEditor2(props) {
  const { placeholder, onChange, onSubmit, onCancel } = props
  const [text, setText] = useState(placeholder)
  return (
    <>
      <Tab.Group defaultIndex={0}>
        <div className="flex flex-row justify-between px-3 py-2 h-12 rounded-t bg-gray-300">
          <Tab.List class="tabs">
            <Tab as={Fragment}>
              {({ selected }) => (
                <button
                  className={
                    selected ? "tab tab-active bg-gray-400 rounded-lg" : "tab"
                  }
                >
                  Write
                </button>
              )}
            </Tab>
            <Tab as={Fragment}>
              {({ selected }) => (
                <button
                  className={
                    selected ? "tab tab-active bg-gray-400 rounded-lg" : "tab"
                  }
                >
                  Preview
                </button>
              )}
            </Tab>
          </Tab.List>
        </div>

        <div className="flex flex-col">
          <div className="p-3 bg-gray-50 border-slate-100">
            <Tab.Panels>
              <Tab.Panel>
                <div className="border">
                  <MarkdownEditor
                    onChange={({ html, text }, event) => {
                      if(!onChange || onChange?.(text)) {
                        setText(text)
                      }
                    }}
                    value={text}
                    className="h-96"
                  />
                </div>
              </Tab.Panel>

              <Tab.Panel>
                <div className="border h-96 min-h-full p-3">
                  {!text ? (
                    <p>Nothing to preview</p>
                  ) : (
                    <MarkdownViewer text={text} />
                  )}
                </div>
              </Tab.Panel>
            </Tab.Panels>
            <div className="flex flex-row justify-between pt-3 gap-3">
              <div>
                <Link
                  className="underline hover:text-gray-800"
                  href={
                    "https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax"
                  }
                >
                  <FontAwesomeIcon className="pr-1" icon={faCircleQuestion} />
                  Styling with Markdown is supported
                </Link>
              </div>
              <div className="flex gap-x-2">
                <button
                  className="btn-xs h-7 w-28 bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => onCancel?.()}
                >
                  Cancel
                </button>

                <button
                  className="btn-xs h-7 w-28 bg-emerald-500 hover:bg-emerald-600 text-white"
                  onClick={() => onSubmit?.()}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </Tab.Group>
    </>
  )
}

{
  /* {showButtons && (
            <div className="flex flex-row justify-end pt-3 gap-3">
              {canEdit && (
                <button
                  className="btn-xs h-7 w-28 bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => onCancel()}
                >
                  Cancel
                </button>
              )}

              <button
                className="btn-xs h-7 w-28 bg-emerald-500 hover:bg-emerald-600 text-white"
                onClick={() => onSubmit()}
              >
                {canEdit ? <>Update Issue</> : <>Submit</>}
              </button>
            </div>
          )} */
}

