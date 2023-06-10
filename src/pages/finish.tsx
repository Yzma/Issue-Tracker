import Head from 'next/head'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useRouter } from 'next/router'
import { trpc } from '@/lib/trpc'
import { NamespaceSchema } from '@/lib/zod-schemas'

type SignUpSchemaType = z.infer<typeof NamespaceSchema>

export default function FinishUserCreation() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpSchemaType>({
    resolver: zodResolver(NamespaceSchema),
  })

  const submitUserMutation = trpc.onboarding.submitUsername.useMutation({
    onSuccess: async (data) => {
      await router.push(`/${data.username}`)
    },
    onError: (error) => {
      setError('root', { type: 'custom', message: error.message })
    },
  })

  const onSubmit: SubmitHandler<SignUpSchemaType> = async (formData) => {
    return submitUserMutation.mutateAsync(formData)
  }

  return (
    <>
      <Head>
        <title>Finish User Creation</title>
      </Head>
      <main className="flex absolute inset-0 bg-slate-100 justify-center items-center">
        <div className="relative px-4 sm:px-6 lg:px-8 pb-8  max-w-lg mx-auto">
          <div className="bg-white px-8 pb-6 pt-9 rounded-b shadow-lg">
            <div className="text-center mb-6">
              <h1 className="text-xl leading-snug text-slate-800 font-semibold mb-2">
                Complete Registration
              </h1>
              <div className="text-sm">
                What do you want your username to be?
              </div>
            </div>

            <div>
              <div className="space-y-4 px-4">
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

                  <div className="mt-6">
                    <div className="mb-4">
                      <button
                        className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                        type="submit"
                        disabled={
                          isSubmitting ||
                          submitUserMutation.isSuccess ||
                          submitUserMutation.isLoading
                        }
                      >
                        Finish Registration
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
