import { HtmlType } from 'react-markdown-editor-lite/cjs/editor/preview'
import { EditorConfig } from 'react-markdown-editor-lite/cjs/share/var'

// Since the library doesn't export the type, we'll place it here
// https://github.com/HarryChen0506/react-markdown-editor-lite/blob/master/src/editor/index.tsx

export interface EditorProps extends EditorConfig {
  id?: string
  defaultValue?: string
  value?: string
  renderHTML: (text: string) => HtmlType | Promise<HtmlType> | (() => HtmlType)
  style?: React.CSSProperties
  autoFocus?: boolean
  placeholder?: string
  readOnly?: boolean
  className?: string
  config?: unknown
  plugins?: string[]
  // Configs
  onChange?: (
    data: {
      text: string
      html: string
    },
    event?: React.ChangeEvent<HTMLTextAreaElement>
  ) => void
  onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void
  onScroll?: (
    e: React.UIEvent<HTMLTextAreaElement | HTMLDivElement>,
    type: 'md' | 'html'
  ) => void
}
