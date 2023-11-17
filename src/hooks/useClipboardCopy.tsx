export function useClipboardCopy() {
  function copy(content: string) {
    if ('clipboard' in navigator) {
      return navigator.clipboard.writeText(content)
    }
    return document.execCommand('copy', true, content)
  }

  return { copy }
}
