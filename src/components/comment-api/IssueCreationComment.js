import React, { useState } from "react"
import { Tab } from "@headlessui/react"

import CommentApi from "./CommentApi"
import MarkdownEditor from "@/components/markdown/MarkdownEditor"
import MarkdownViewer from "@/components/markdown/MarkdownViewer"

const IssueCreationComment = ({}) => {
  const [text, setText] = useState(placeholder)

  return (
    <>
      <CommentApi className="">
        <CommentApi.Header>
          <div class="tabs">
            <a class="tab tab-lifted">Write</a>
            <a class="tab tab-lifted tab-active">Preview</a>
          </div>
        </CommentApi.Header>

        <CommentApi.Body>
          <div className="border">
            {/* <MarkdownViewer text={issueState.description} /> */}
            <MarkdownEditor
              placeholder={""}
              // onChange={(text) => setText(text)}
            />
          </div>

          <div className="flex flex-row justify-end pt-3 gap-3">
            <button className="btn-xs h-7 w-28 bg-red-500 hover:bg-red-600 text-white">
              Cancel
            </button>
            <button className="btn-xs h-7 w-28 bg-emerald-500 hover:bg-emerald-600 text-white">
              Update Issue
            </button>
          </div>
        </CommentApi.Body>
      </CommentApi>
    </>
  )
}

export default IssueCreationComment
