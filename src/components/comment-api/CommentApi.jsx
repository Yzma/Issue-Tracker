import React, { createContext } from 'react'

const CommentContext = createContext({
  editing: false,
  setEditing: () => ({}),
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
    <header className="flex flex-row justify-between px-3 py-2 h-12 rounded-t bg-gray-300">
      {children}
    </header>
  )
}

function Body({ children }) {
  return (
    <div className="flex flex-col">
      <div className="p-3 bg-gray-50 border-slate-100">{children}</div>
    </div>
  )
}

CommentApi.Header = Header
CommentApi.Body = Body
