import { SessionProvider } from "next-auth/react";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css"; 

import "@/styles/globals.css";
import "@/styles/popover-styles.css"

config.autoAddCss = false;

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
