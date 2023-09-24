import Head from 'next/head'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Link from 'next/link'
import { useState } from 'react'
import ConfettiExplosion from 'react-confetti-explosion'
import { trpc } from '@/lib/trpc/trpc'
import { NamespaceSchema } from '@/lib/zod-schemas'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type SignUpSchemaType = z.infer<typeof NamespaceSchema>

export default function FinishUserCreation() {
  const [finishedSetupUsername, setFinishedSetupUsername] = useState<
    string | undefined
  >(undefined)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpSchemaType>({
    resolver: zodResolver(NamespaceSchema),
  })

  const submitUserMutation = trpc.onboarding.submitUsername.useMutation({
    onSuccess: (data) => {
      setFinishedSetupUsername(data.username)
    },
    onError: (error) => {
      setError('root', { type: 'custom', message: error.message })
    },
  })

  const onSubmit: SubmitHandler<SignUpSchemaType> = (formData) => {
    return submitUserMutation.mutate(formData)
  }

  return (
    <>
      <Head>
        <title>Finish User Creation</title>
      </Head>
      <main className="bg-slate-100">
        <div className="relative flex">
          {/* Content */}
          <div className="w-full">
            <div className="flex h-full min-h-screen flex-col after:flex-1">
              <div className="flex-3">
                {/* Header */}
                {!finishedSetupUsername && (
                  <div className="flex h-16 items-center justify-end px-4 sm:px-6 lg:px-8">
                    <div className="text-sm">
                      Have an account?{' '}
                      <Link
                        className="font-medium text-green-500 "
                        href="/login"
                      >
                        Sign In
                      </Link>
                    </div>
                  </div>
                )}

                {/* Progress bar */}
                <div className="px-4 pt-12 pb-8">
                  <div className="mx-auto w-full max-w-md">
                    <div className="relative">
                      <div
                        className="absolute left-0 top-1/2 -mt-px h-0.5 w-full bg-slate-200"
                        aria-hidden="true"
                      />
                      <ul className="relative flex w-full justify-between">
                        <li>
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-800 text-xs font-semibold text-white">
                            1
                          </div>
                        </li>
                        <li>
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-800 text-xs font-semibold text-white">
                            2
                          </div>
                        </li>
                        <li>
                          <div
                            className={cn(
                              'flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold text-slate-500',
                              {
                                [`bg-gray-800 text-white`]:
                                  finishedSetupUsername,
                                [`bg-slate-300`]: !finishedSetupUsername,
                              }
                            )}
                          >
                            3
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-4 py-8">
                <div className="mx-auto max-w-md">
                  {finishedSetupUsername ? (
                    <>
                      <h1 className="mb-5 text-center text-3xl font-bold text-slate-800">
                        Welcome to Issue Tracker, {finishedSetupUsername}!
                      </h1>
                      <div className="text-center">
                        Click the button below to go to your profile!
                        <div>
                          <Link
                            href="/"
                            onClick={() => window.location.reload()}
                          >
                            <Button className="mt-6" asChild>
                              <div>
                                Finished!
                                <ConfettiExplosion />
                              </div>
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <h1 className="mb-9 text-center text-3xl font-bold text-slate-800">
                        Finalize Profile
                      </h1>

                      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
                      <form onSubmit={handleSubmit(onSubmit)}>
                        {errors.name?.message && (
                          <div className="py-3">
                            <div className="flex w-full rounded-sm border border-rose-200 bg-rose-100 px-4 py-2 text-sm text-rose-600">
                              <div>You must enter a valid username!</div>
                            </div>
                          </div>
                        )}
                        {errors.root && (
                          <div className="py-3">
                            <div className="flex w-full rounded-sm border border-rose-200 bg-rose-100 px-4 py-2 text-sm text-rose-600">
                              <div>{errors.root.message}</div>
                            </div>
                          </div>
                        )}
                        <div>
                          <label
                            className="mb-1 block text-sm font-medium"
                            htmlFor="name"
                          >
                            Username
                            <span className="text-rose-500">*</span>
                            <input
                              className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
                              type="text"
                              // eslint-disable-next-line react/jsx-props-no-spreading
                              {...register('name')}
                            />
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <Link
                            className="text-sm underline hover:no-underline"
                            href="/"
                          >
                            &lt;- Exit
                          </Link>

                          <div className="mt-3">
                            <Button type="submit" disabled={isSubmitting}>
                              Finish Registration
                            </Button>
                          </div>
                        </div>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
