import React, { createContext, useState, Fragment } from "react"

import { Tab } from "@headlessui/react"

import TimeAgo from "react-timeago"

import * as DropdownMenu from "@radix-ui/react-dropdown-menu"

import CommentApi from "./CommentApi"
import MarkdownEditor from "@/components/markdown/MarkdownEditor"
import MarkdownViewer from "@/components/markdown/MarkdownViewer"
import moment from "moment"

const IssueComment = ({
  text: placeholder,
  username,
  createdAt,
  formatter,
  canEdit,
  now,
  editing,
  showButtons = true,
  onChange,
  onSubmit,
  onEdit,
  onCancel
}) => {
  const [text, setText] = useState(placeholder)

  return (
    <div className="shadow-md">
      {editing ? (
        <Tab.Group defaultIndex={0}>
          <CommentApi>
            <CommentApi.Header>
              <Tab.List class="tabs">
                <Tab as={Fragment}>
                  {({ selected }) => (
                    /* Use the `selected` state to conditionally style the selected tab. */
                    <button
                      className={
                        selected
                        ? "tab tab-active bg-gray-400 rounded-lg"
                          : "tab"
                      }
                    >
                      Write
                    </button>
                  )}
                </Tab>
                <Tab as={Fragment}>
                  {({ selected }) => (
                    /* Use the `selected` state to conditionally style the selected tab. */
                    <button
                      className={
                        selected
                          ? "tab tab-active bg-gray-400 rounded-lg"
                          : "tab"
                      }
                    >
                      Preview
                    </button>
                  )}
                  
                </Tab>
                {/* <Tab class="tab">Write</Tab>
                <Tab class="tab tab-active">Preview</Tab> */}
              </Tab.List>
            </CommentApi.Header>

            <Tab.Panels>
              <Tab.Panel>
                <CommentApi.Body>
                  <div className="border">
                    <MarkdownEditor
                      placeholder={text}
                      onChange={(text) => {
                        setText(text)
                        onChange(text)
                      }}
                    />
                  </div>

                  {showButtons && (
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
                  )}
                </CommentApi.Body>
              </Tab.Panel>

              <Tab.Panel>
                <CommentApi.Body>
                  <div className="border">
                    {!text ? (
                      <p>Nothing to preview</p>
                    ) : (
                      <>
                        <MarkdownViewer text={text} />{" "}
                      </>
                    )}
                  </div>

                  {showButtons && (
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
                  )}

                  {/* <div className="flex flex-row justify-end pt-3 gap-3">
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
                      Update Issue
                    </button>
                  </div> */}
                </CommentApi.Body>
              </Tab.Panel>
            </Tab.Panels>
          </CommentApi>
        </Tab.Group>
      ) : (
        <>
          <header className="flex flex-row justify-between px-3 py-2 h-12 bg-gray-300 border rounded-t">
            <div className="font-semibold text-slate-800">
              {username} commented {moment(createdAt).fromNow()}
              {/* <TimeAgo
                date={createdAt}
                live={false}
                now={() => now}
                formatter={formatter}
              /> */}
            </div>

            {canEdit && (
              <div className="font-semibold text-slate-800">
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <svg className="w-8 fill-current " viewBox="0 0 32 32">
                      <circle cx="16" cy="16" r="2" />
                      <circle cx="10" cy="16" r="2" />
                      <circle cx="22" cy="16" r="2" />
                    </svg>
                  </DropdownMenu.Trigger>

                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      className="DropdownMenuContent"
                      sideOffset={5}
                    >
                      {canEdit && (
                        <DropdownMenu.Item
                          className="DropdownMenuItem"
                          onClick={() => onEdit()}
                        >
                          Edit
                        </DropdownMenu.Item>
                      )}

                      <DropdownMenu.Item className="DropdownMenuItem">
                        Copy Link
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </div>
            )}
          </header>
          <div className="px-3 py-2 bg-white">
            <MarkdownViewer text={text} />
          </div>
        </>
      )}
    </div>
  )
}

const TabContext = createContext({
  selectedTabIndex: 0
})

function TabsList({ children }) {
  return (
    <TabContext.Provider value={{ selectedTabIndex: 0 }}>
      {children}
    </TabContext.Provider>
  )
}

function Tabb() {
  return <></>
}

function TabContentList() {}

function TabContent() {}

export default IssueComment

{
  /* <Tab.Group defaultIndex={0}>
        <CommentApi>
          <CommentApi.Header>
            <Tab.List className="tabs tabs-boxed">
              <Tab>
                {({ selected }) => (
                  <a
                    className={ selected ? "tab tab-active" : "tab"}
                  >
                    Write
                  </a>
                )}
                
              </Tab>
              
              <Tab >
                {({ selected }) => (
             <a
             className={ selected ? "tab tab-active" : "tab"}
           >
             Preview
           </a>
                )}
                
              </Tab>
            </Tab.List>
          </CommentApi.Header>

          <CommentApi.Body>
            <Tab.Panels>
              <Tab.Panel>
                <div className="border">
                  {/* <MarkdownViewer text={issueState.description} /> 
                  <MarkdownEditor
                    placeholder={text}
                    onChange={(text) => setText(text)}
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
              </Tab.Panel>
              <Tab.Panel>
                <MarkdownViewer text={text} />
              </Tab.Panel>
            </Tab.Panels>
          </CommentApi.Body>
        </CommentApi>
      </Tab.Group> */
}
