import Head from 'next/head'
import Link from 'next/link'
import Header from '@/components/Header'
import DefaultLayout from '@/components/ui/DefaultLayout'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <>
      <Head>
        <title>404 - Not Found</title>
        <meta name="description" content="404 - Page not found" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <DefaultLayout>
        <div className="text-center px-4">
          <div className="inline-flex mb-8">
            <p className="text-9xl font-light text-gray-500">404</p>
          </div>
          <div className="mb-6">The requested page does not exist...</div>
          <Button asChild>
            <Link href="/">Back To Home</Link>
          </Button>
        </div>
      </DefaultLayout>
    </>
  )
}
