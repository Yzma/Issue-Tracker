import { SessionProvider } from "next-auth/react";

import { trpc } from "@/lib/trpc";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css"; 

import "@/styles/globals.css";
import "@/styles/popover-styles.css"

config.autoAddCss = false;

import type { AppType } from 'next/app';

const MyApp: AppType = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
  <SessionProvider session={session}>
    <Component {...pageProps} />
  </SessionProvider>
)};

export default trpc.withTRPC(MyApp);
