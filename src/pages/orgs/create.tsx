import Head from 'next/head'
import { useRouter } from 'next/router'

import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { trpc } from '@/lib/trpc/trpc'
import Header from '@/components/Header'
import { NamespaceSchema } from '@/lib/zod-schemas'

type OrganizationCreationType = z.infer<typeof NamespaceSchema>

export default function OrganizationCreate() {
  const router = useRouter()
  const createOrganizationMutation =
    trpc.organizations.createOrganization.useMutation()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OrganizationCreationType>({
    resolver: zodResolver(NamespaceSchema),
  })

  const onSubmit: SubmitHandler<OrganizationCreationType> = (data) => {
    createOrganizationMutation
      .mutateAsync(data)
      .then((response) => router.push(`/${response.name}`))
      .catch((error) => {
        // setError('name', { type: 'custom', message: 'custom message' }) // TODO: Set proper error message
        console.log('ERROR:', error)
      })
  }
  return (
    <>
      <Head>
        <title>Create new Organization</title>
      </Head>

      <Header />

      <main className="flex absolute inset-0  bg-slate-100 justify-center items-center">
        <div className="relative px-4 sm:px-6 lg:px-8 pb-8  max-w-lg mx-auto">
          <div className="bg-white px-8 pb-6 pt-9 rounded-b shadow-lg">
            <div className="text-center mb-6">
              <h1 className="text-xl leading-snug text-slate-800 font-semibold mb-2">
                Create a new Organization
              </h1>
              <div className="text-sm">Tell us about your organization</div>
            </div>

            <div>
              <div className="space-y-4">
                {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
                <form onSubmit={handleSubmit(onSubmit)}>
                  {errors.name?.message && (
                    <div className="py-3">
                      <div className="flex w-full px-4 py-2 rounded-sm text-sm border bg-rose-100 border-rose-200 text-rose-600">
                        <div>You must enter a valid organization name!</div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      htmlFor="name"
                    >
                      Organization Name <span className="text-rose-500">*</span>
                      <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text"
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...register('name')}
                      />
                    </label>
                  </div>

                  <div className="text-sm pt-4">
                    <p>
                      This will be the name of your account on Issue Tracker.
                    </p>
                  </div>

                  <div className="mt-6">
                    <div className="mb-4">
                      <button
                        className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        Create Organization
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
