import React, { useState } from "react"
import { Tab } from "@headlessui/react"

import MarkdownEditor from "@/components/markdown/MarkdownEditor"
import MarkdownViewer from "@/components/markdown/MarkdownViewer"

import TimeAgo from "react-timeago"

import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import moment from "moment"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

const Comment = ({
  placeholder,
  editing,
  canEdit,
  createdAt,
  now,
  formatter
}) => {
  const [text, setText] = useState(placeholder)

  return (
    <>
      <div>
        {!editing ? (
          <>
            <header className="flex flex-row justify-between px-3 py-2 h-12 rounded-t bg-gray-300 border border-slate-100">
              <div className="font-semibold text-slate-800">
                Yzma commented{" "}
                {moment(createdAt).format("MMM Do YY")}
                {/* <TimeAgo
                  date={createdAt}
                  live={false}
                  now={() => now}
                  formatter={formatter}
                /> */}
              </div>

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
                        <DropdownMenu.Item className="DropdownMenuItem">
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
            </header>
            <div className="px-3 py-2 bg-white">
              <MarkdownViewer text={text} />
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col">
              <div className="mb-8 border-slate-100">
                <Tab.Group>
                  <Tab.List class="bg-indigo-300  pl-3 pt-4">
                    <Tab
                      className={({ selected }) =>
                        classNames(
                          "tab tab-lg tab-lifted border-none",
                          selected ? "tab-active" : ""
                        )
                      }
                    >
                      Write
                    </Tab>
                    <Tab
                      className={({ selected }) =>
                        classNames(
                          "tab tab-lg tab-lifted border-none",
                          selected ? "tab-active" : ""
                        )
                      }
                    >
                      Preview
                    </Tab>
                  </Tab.List>
                  <Tab.Panels>
                    <div className="p-4 bg-slate-200">
                      <Tab.Panel className="flex-nowrap bg-base-300 relative overflow-x-auto">
                        <MarkdownEditor
                          placeholder={text}
                          onChange={(text) => setText(text)}
                        />
                      </Tab.Panel>
                      <Tab.Panel className="flex-nowrap h-[32rem] relative overflow-x-auto">
                        <div className="col-span-full xl:col-span-8 bg-slate-200">
                          <MarkdownViewer text={text} />
                        </div>
                      </Tab.Panel>
                      <div className="flex flex-row justify-end pt-2 gap-x-3">
                        <button
                          type="submit"
                          className="btn bg-red-500 hover:bg-red-600 text-white"
                          onClick={() => setShowDescription(false)}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="btn bg-emerald-500 hover:bg-emerald-600 text-white"
                          onClick={() => setShowDescription(false)}
                        >
                          Update Comment
                        </button>
                      </div>
                    </div>
                  </Tab.Panels>
                </Tab.Group>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

            {/* <div className="flex  rounded bg-gray-200 px-3 py-2 content-end border-b border-gray-700">
                <div className="font-semibold text-slate-800 content-end">
                  Yzma posted{" "}
                  <TimeAgo
                    date={props.createdAt}
                    live={false}
                    now={() => props.now}
                    formatter={props.formatter}
                  />
                </div>
                <div className="font-semibold text-slate-800">
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <svg
                        className="w-8 h-8 fill-current "
                        viewBox="0 0 32 32"
                      >
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
                        <DropdownMenu.Item className="DropdownMenuItem">
                          Edit
                        </DropdownMenu.Item>
                        <DropdownMenu.Item className="DropdownMenuItem">
                          Copy Link
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </div>
              </div>
              <div className="p-4 bg-slate-200">asd</div> */}

{
  /* <div>
      {props.isEditing ? (
        <div className="flex flex-col">
          <div className="mb-8 border-b border-slate-200">
          <Tab.Group >
            <Tab.List className="text-sm font-medium flex flex-nowrap -mx-4 sm:-mx-6 lg:-mx-8 overflow-x-scroll no-scrollbar">
              <Tab
                className="pb-3 mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8"
              >
                Write
              </Tab>

              <Tab
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
              </Tab>
            </Tab.List>
            <Tab.Panels className="mt-2">
              <Tab.Panel
                className={classNames(
                  "rounded-xl bg-white p-3",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
                )}
              >
                <MarkdownEditor
                  placeholder={text}
                  onChange={(text) => setText(text)}
                />
              </Tab.Panel>

              <Tab.Panel
                className={classNames(
                  "rounded-xl bg-white p-3",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
                )}
              >
                <MarkdownViewer text={text} />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
          </div>
          <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white">
            Cancel
          </button>
        </div>
      ) : (
        <header className="flex flex-row justify-between px-3 py-2 border-b border-slate-100">
          <div className="font-semibold text-slate-800">
            Yzma posted{" "}
            <TimeAgo
              date={props.createdAt}
              live={false}
              now={() => props.now}
              formatter={props.formatter}
            />
          </div>
          <div className="font-semibold text-slate-800">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <svg className="w-8 h-8 fill-current " viewBox="0 0 32 32">
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
                  <DropdownMenu.Item className="DropdownMenuItem">
                    Edit
                  </DropdownMenu.Item>
                  <DropdownMenu.Item className="DropdownMenuItem">
                    Copy Link
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </header>
      )}

      <div className="p-3">{props.children}</div>
    </div> */
}

export default Comment
