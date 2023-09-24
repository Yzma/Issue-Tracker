import Head from 'next/head'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faGithub,
  faGoogle,
  faGitlab,
  faMicrosoft,
  faLinkedin,
  IconDefinition,
} from '@fortawesome/free-brands-svg-icons'

import {
  getProviders,
  signIn,
  getSession,
  ClientSafeProvider,
} from 'next-auth/react'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ProviderIcons = {
  [key in ClientSafeProvider['name']]: IconDefinition
}

const providerIcons: ProviderIcons = {
  GitHub: faGithub,
  Google: faGoogle,
  GitLab: faGitlab,
  Microsoft: faMicrosoft,
  LinkedIn: faLinkedin,
} as const

export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>Sign In to Issue Tracker</title>
      </Head>

      <div className="relative md:flex">
        <div className="relative md:w-1/2">
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: 'default' }),
              'absolute left-10 top-4 w-20 md:left-8 md:top-8'
            )}
          >
            Home
          </Link>
          <div className="flex h-full min-h-screen flex-col">
            <div className="flex flex-1 items-center justify-center">
              <div className="mx-auto flex w-full flex-col justify-center space-y-5 text-center sm:w-[350px]">
                <div className="mb-4 flex flex-col space-y-3 text-center">
                  <h1 className="text-3xl font-semibold text-gray-800">
                    Sign in to Issue Tracker
                  </h1>
                  <p className="text-muted-foreground text-sm">
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
                          // eslint-disable-next-line @typescript-eslint/no-misused-promises
                          onClick={() => signIn(provider.id)}
                        >
                          <FontAwesomeIcon icon={lookupIcon} className="mr-2" />
                          {provider.name}
                        </Button>
                      </div>
                    )
                  }
                  return null
                })}
                <div className="mx-auto justify-center space-y-6 sm:w-[350px]">
                  <div className="text-muted-foreground flex w-full flex-col px-8 text-center text-sm">
                    By clicking continue, you agree to our{' '}
                    <div>
                      <Link
                        href="/terms"
                        className="hover:text-primary underline underline-offset-4"
                      >
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link
                        href="/privacy"
                        className="hover:text-primary underline underline-offset-4"
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

        <div className="relative flex flex-col p-9 md:w-1/2">
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
          <div className="relative z-20 mb-auto flex items-center text-lg font-bold text-green-400">
            Issue Tracker
          </div>

          <div className="relative z-20">
            <blockquote className="space-y-2">
              <p className="text-lg text-white">
                &ldquo;Issue-Tracker has completely transformed the way my team
                manages issues with its intuitive interface, effortless project
                organization, and lightning-fast performance. Its a game-changer
                that fosters collaboration, streamlines workflow, and makes
                issue tracking a breeze, all in one centralized and
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

export async function getServerSideProps(context: GetServerSidePropsContext) {
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

  return {
    props: { providers: providers ?? [] },
  }
}
