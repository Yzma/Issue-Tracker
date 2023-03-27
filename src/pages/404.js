import Header from "@/components/Header"
import Head from "next/head"
import Link from "next/link"

export default function Home() {
  return (
    <>
      <Head>
        <title>404 - Not Found</title>
        <meta name="description" content="404 - Page not found" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main>
        <div className="flex h-screen overflow-hidden">
          <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
              <div className="max-w-2xl m-auto mt-16">
                <div className="text-center px-4">
                  <div className="inline-flex mb-8">
                    <p className="text-9xl font-light text-gray-500">404</p>
                  </div>
                  <div className="mb-6">
                    The requested page does not exist...
                  </div>
                  <Link
                    href={"/"}
                    className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                  >
                    Back To Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
