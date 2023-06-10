import Head from 'next/head'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Link from 'next/link'
import { useState } from 'react'
import ConfettiExplosion from 'react-confetti-explosion'
import { trpc } from '@/lib/trpc'
import { NamespaceSchema } from '@/lib/zod-schemas'

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
            <div className="min-h-screen h-full flex flex-col after:flex-1">
              <div className="flex-3">
                {/* Header */}
                {!finishedSetupUsername && (
                  <div className="flex items-center justify-end h-16 px-4 sm:px-6 lg:px-8">
                    <div className="text-sm">
                      Have an account?{' '}
                      <Link
                        className="font-medium text-indigo-500 hover:text-indigo-600"
                        href="/"
                      >
                        Sign In
                      </Link>
                    </div>
                  </div>
                )}

                {/* Progress bar */}
                <div className="px-4 pt-12 pb-8">
                  <div className="max-w-md mx-auto w-full">
                    <div className="relative">
                      <div
                        className="absolute left-0 top-1/2 -mt-px w-full h-0.5 bg-slate-200"
                        aria-hidden="true"
                      />
                      <ul className="relative flex justify-between w-full">
                        <li>
                          <div className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold bg-indigo-500 text-white">
                            1
                          </div>
                        </li>
                        <li>
                          <div className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold bg-indigo-500 text-white">
                            2
                          </div>
                        </li>
                        <li>
                          <div
                            className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold ${
                              !finishedSetupUsername
                                ? 'bg-slate-300'
                                : 'bg-indigo-500 text-white'
                            }  text-slate-500`}
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
                <div className="max-w-md mx-auto">
                  {finishedSetupUsername ? (
                    <>
                      <h1 className="text-3xl text-slate-800 font-bold mb-5 text-center">
                        Welcome to Issue Tracker, {finishedSetupUsername}!
                      </h1>
                      <div className="text-center">
                        Click the button below to go to your profile!
                        <div>
                          <Link
                            href="/"
                            onClick={() => window.location.reload()}
                          >
                            <span className="btn bg-indigo-500 hover:bg-indigo-600 text-white ml-auto mt-5 text">
                              <ConfettiExplosion />
                              Finished!
                            </span>
                          </Link>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <h1 className="text-3xl text-slate-800 font-bold mb-9 text-center">
                        Finalize Profile
                      </h1>

                      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
                      <form onSubmit={handleSubmit(onSubmit)}>
                        {errors.name?.message && (
                          <div className="py-3">
                            <div className="flex w-full px-4 py-2 rounded-sm text-sm border bg-rose-100 border-rose-200 text-rose-600">
                              <div>You must enter a valid username!</div>
                            </div>
                          </div>
                        )}
                        {errors.root && (
                          <div className="py-3">
                            <div className="flex w-full px-4 py-2 rounded-sm text-sm border bg-rose-100 border-rose-200 text-rose-600">
                              <div>{errors.root.message}</div>
                            </div>
                          </div>
                        )}
                        <div>
                          <label
                            className="block text-sm font-medium mb-1"
                            htmlFor="name"
                          >
                            Username
                            <span className="text-rose-500">*</span>
                            <input
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                            <button
                              className="btn bg-indigo-500 hover:bg-indigo-600 text-white ml-auto"
                              type="submit"
                              disabled={isSubmitting}
                            >
                              Finish Registration
                            </button>
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
