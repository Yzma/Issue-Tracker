import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="bg-slate-100 font-inter text-slate-600 antialiased dark:bg-slate-900 dark:text-slate-400">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
