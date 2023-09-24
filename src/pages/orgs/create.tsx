import Head from 'next/head'
import { useRouter } from 'next/router'

import { SubmitHandler, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { trpc } from '@/lib/trpc/trpc'
import { NamespaceSchema } from '@/lib/zod-schemas'
import DefaultLayout from '@/components/ui/DefaultLayout'
import { Button } from '@/components/ui/button'

type OrganizationCreationType = z.infer<typeof NamespaceSchema>

export default function OrganizationCreate() {
  const router = useRouter()
  const createOrganizationMutation =
    trpc.organizations.createOrganization.useMutation()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<OrganizationCreationType>({
    resolver: zodResolver(NamespaceSchema),
  })

  const organizationName = useWatch({
    control,
    name: 'name',
  })

  const onSubmit: SubmitHandler<OrganizationCreationType> = (data) => {
    createOrganizationMutation
      .mutateAsync(data)
      .then((response) => router.push(`/${response.name}`))
      .catch((error) => {
        // setError('name', { type: 'custom', message: 'custom message' }) // TODO: Set proper error message
        // console.log('ERROR:', error)
      })
  }
  return (
    <>
      <Head>
        <title>Create a new Organization</title>
      </Head>
      <DefaultLayout>
        <main className="mt-6 flex flex-col items-center justify-center pt-6">
          <div className="mb-6 text-center">
            <div className="text-sm">Tell us about your organization</div>
            <h1 className="mb-2 text-3xl font-semibold leading-snug text-slate-800">
              Set up your organization
            </h1>
          </div>

          <div className="mt-4 w-2/5 space-y-4">
            {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
            <form onSubmit={handleSubmit(onSubmit)}>
              {errors.name?.message && (
                <div className="py-3">
                  <div className="flex w-full rounded-sm border border-rose-200 bg-rose-100 px-4 py-2 text-sm text-rose-600">
                    <div>You must enter a valid organization name!</div>
                  </div>
                </div>
              )}

              <div>
                <label
                  className="mb-1 block text-sm font-medium"
                  htmlFor="name"
                >
                  Organization Name <span className="text-rose-500">*</span>
                  <input
                    className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
                    type="text"
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...register('name')}
                  />
                </label>
              </div>

              <div className="pt-2 text-sm">
                <p>This will be the name of your account on Issue Tracker.</p>
                <p>
                  Your URL will be: https://issue-tracker.com/{organizationName}
                </p>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isSubmitting}>
                  Create Organization
                </Button>
              </div>
            </form>
          </div>
        </main>
      </DefaultLayout>
    </>
  )
}
