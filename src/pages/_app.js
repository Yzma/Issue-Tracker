import { SessionProvider } from "next-auth/react";
import "@/styles/globals.css";
import '@fortawesome/fontawesome-svg-core/styles.css'
import "@/styles/popover-styles.css" // TODO: Move this into the actual component

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
