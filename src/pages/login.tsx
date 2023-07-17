import Head from 'next/head'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faGithub,
  faGoogle,
  faGitlab,
  faMicrosoft,
  faLinkedin,
} from '@fortawesome/free-brands-svg-icons'

import {
  getProviders,
  signIn,
  getSession,
  getCsrfToken,
  LiteralUnion,
  ClientSafeProvider,
} from 'next-auth/react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { BuiltInProviderType } from 'next-auth/providers'
import Link from 'next/link'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const providerIcons = {
    GitHub: faGithub,
    Google: faGoogle,
    GitLab: faGitlab,
    Microsoft: faMicrosoft,
    LinkedIn: faLinkedin,
  }

  return (
    <>
      <Head>
        <title>Sign In to Issue Tracker</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="relative md:flex">
        <div className="md:w-1/2 relative">
          <Link
            href="/examples/authentication"
            className={cn(
              buttonVariants({ variant: 'default' }),
              'absolute left-10 top-4 md:left-8 md:top-8 w-20'
            )}
          >
            Home
          </Link>
          <div className="flex flex-col min-h-screen h-full">
            <div className="flex-1 flex justify-center items-center">
              <div className="mx-auto flex w-full flex-col justify-center text-center space-y-5 sm:w-[350px]">
                <div className="flex flex-col space-y-3 text-center mb-4">
                  <h1 className="text-3xl text-gray-800 font-semibold">
                    Sign in to Issue Tracker
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Use an OAuth provider below to login to your account
                  </p>
                </div>
                {Object.values(providers).map((provider) => {
                  const lookupIcon = providerIcons[provider.name]
                  if (lookupIcon) {
                    return (
                      <div key={provider.name}>
                        <Button
                          className="w-full"
                          type="button"
                          onClick={() => signIn(provider.id)}
                        >
                          <FontAwesomeIcon icon={lookupIcon} className="mr-2" />
                          {provider.name}
                        </Button>
                      </div>
                    )
                  }
                })}
                <div className="mx-auto justify-center space-y-6 sm:w-[350px]">
                  <div className="flex w-full flex-col px-8 text-center text-sm text-muted-foreground">
                    By clicking continue, you agree to our{' '}
                    <div>
                      <Link
                        href="/terms"
                        className="underline underline-offset-4 hover:text-primary"
                      >
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link
                        href="/privacy"
                        className="underline underline-offset-4 hover:text-primary"
                      >
                        Privacy Policy
                      </Link>
                      .
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative flex flex-col md:w-1/2 p-9">
          <Image
            className="absolute"
            src="/images/signinpage.jpg"
            alt="Sign In Page"
            fill
            style={{
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
          <div className="relative z-20 flex items-center text-lg text-green-400 font-bold mb-auto">
            Issue Tracker
          </div>

          <div className="relative z-20">
            <blockquote className="space-y-2">
              <p className="text-lg text-white">
                &ldquo;Issue-Tracker has completely transformed the way my team
                manages issues with its intuitive interface, effortless project
                organization, and lightning-fast performance. It's a
                game-changer that fosters collaboration, streamlines workflow,
                and makes issue tracking a breeze, all in one centralized and
                user-friendly platform.&rdquo;
              </p>
              <footer className="text-sm text-white">John Doe</footer>
            </blockquote>
          </div>
        </div>
      </div>
    </>
  )
}

{
  /* 
<div className="container relative hidden h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
          <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
            <div className="absolute inset-0 bg-zinc-900" />
            <div className="relative z-20 flex items-center text-lg font-medium">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-6 w-6"
              >
                <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
              </svg>
              Acme Inc
            </div>
            <div className="relative z-20 mt-auto">
              <blockquote className="space-y-2">
                <p className="text-lg">
                  &ldquo;This library has saved me countless hours of work and
                  helped me deliver stunning designs to my clients faster than
                  ever before.&rdquo;
                </p>
                <footer className="text-sm">Sofia Davis</footer>
              </blockquote>
            </div>
          </div>
        </div>
      </div> 
    */
}

export const getServerSideProps: GetServerSideProps<{
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  >
  csrfToken: string
}> = async (context) => {
  const session = await getSession(context)
  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const providers = await getProviders()
  const csrfToken = await getCsrfToken(context)

  return {
    props: {
      providers,
      csrfToken,
    },
  }
}
