import Head from 'next/head'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getLayout } from '@/components/layout/DefaultLayout'

export default function NotFound() {
  return (
    <>
      <Head>
        <title>404 - Not Found</title>
        <meta name="description" content="404 - Page not found" />
      </Head>

      <div className="px-4 text-center">
        <div className="mb-8 inline-flex">
          <p className="text-9xl font-light text-gray-500">404</p>
        </div>
        <div className="mb-6">The requested page does not exist...</div>
        <Button asChild>
          <Link href="/">Back To Home</Link>
        </Button>
      </div>
    </>
  )
}

NotFound.getLayout = getLayout
