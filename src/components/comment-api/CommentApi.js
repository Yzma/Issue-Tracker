import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import Link from "next/link"

import { Tab } from "@headlessui/react"

import MarkdownEditor from "@/components/markdown/MarkdownEditor"
import MarkdownViewer from "@/components/markdown/MarkdownViewer"

import TimeAgo from "react-timeago"

import * as DropdownMenu from "@radix-ui/react-dropdown-menu"

// placeholder,
// editing,
// canEdit,
// createdAt,
// now,
// formatter

const CommentContext = createContext({
  editing: false,
  setEditing: () => ({})
})

export default function CommentApi({ children }) {
  return (
    <CommentContext.Provider value={{ editing: false, setEditing: () => ({}) }}>
      {children}
    </CommentContext.Provider>
  )
}

function Header({ children }) {
  return (
    <>
      <header className="flex flex-row justify-between px-3 py-2 h-12 rounded-t bg-gray-300 border-l border-t border-r border-slate-100">
        {children}
      </header>
    </>
  )
}

function Body({ children }) {
  return (
    <>
      <div className="flex flex-col">
        <div className="p-3 bg-gray-50 border-slate-100">
          {children}
        </div>
      </div>
    </>
  )
}

CommentApi.Header = Header
CommentApi.Body = Body
