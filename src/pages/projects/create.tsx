import { useMemo } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

import { GetServerSidePropsContext } from 'next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookBookmark, faLock } from '@fortawesome/free-solid-svg-icons'
import { ProjectCreationSchema } from '@/lib/zod-schemas'
import { trpc } from '@/lib/trpc/trpc'
import ssrHelper from '@/lib/trpc/ssrHelper'
import DefaultLayout from '@/components/ui/DefaultLayout'
import { Button } from '@/components/ui/button'

type ProjectCreationType = z.infer<typeof ProjectCreationSchema>

export default function ProjectCreate() {
  const router = useRouter()

  const createProjectMutation = trpc.projects.create.useMutation()
  const userOrganizations = trpc.users.getOrganizations.useQuery()
  const { data: session } = useSession()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ProjectCreationType>({
    resolver: zodResolver(ProjectCreationSchema),
  })

  const onSubmit: SubmitHandler<ProjectCreationType> = (data) => {
    createProjectMutation
      .mutateAsync(data)
      .then((response) =>
        router.push(`/${response.namespace}/${response.name}`)
      )
      .catch((error) => {
        setError('name', { type: 'custom', message: 'custom message' }) // TODO: Set proper error message
        // console.log('ERROR:', error) // TODO: remove this
      })
  }

  const options = useMemo(() => {
    if (!userOrganizations.data || !session) return []
    return (
      <>
        <option
          key={session.user.namespace.name}
          value={session.user.namespace.name}
        >
          {session.user.namespace.name}
        </option>
        {userOrganizations.data.map((organization) => {
          return (
            <option key={organization.name} value={organization.name}>
              {organization.name}
            </option>
          )
        })}
      </>
    )
  }, [session, userOrganizations.data])

  return (
    <>
      <Head>
        <title>Create new Project</title>
      </Head>

      <DefaultLayout>
        <div className="flex flex-col items-center justify-center">
          <div>
            <div className="border-b border-gray-300 pb-2">
              <h2 className="mb-1 text-3xl font-bold leading-snug text-slate-800">
                Create a new project
              </h2>
              <div className="font-semibold">
                A project contains all stored issues.
              </div>
            </div>

            <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-4">
              {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
              <form onSubmit={handleSubmit(onSubmit)}>
                {errors.name?.message && (
                  <div className="py-3">
                    <div className="flex w-full rounded-sm border border-rose-200 bg-rose-100 px-4 py-2 text-sm text-rose-600">
                      <div>You must enter a valid username!</div>
                    </div>
                  </div>
                )}

                <section className="flex flex-row border-b border-gray-300 py-4">
                  <div className="sm:w-1/3">
                    <label
                      className="mb-1 block text-sm font-medium"
                      htmlFor="owner"
                    >
                      Owner <span className="text-rose-500">*</span>
                      <select
                        className="form-input w-full"
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...register('owner')}
                      >
                        {options}
                      </select>
                    </label>
                  </div>

                  <div className="auto-cols-auto px-3 pt-6 text-2xl font-semibold">
                    /
                  </div>

                  <div className="grow sm:w-1/3">
                    <label
                      className="mb-1 block text-sm font-medium"
                      htmlFor="name"
                    >
                      Project Name <span className="text-rose-500">*</span>
                      <input
                        className="form-input w-full"
                        type="text"
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...register('name')}
                      />
                    </label>
                  </div>
                </section>

                <section className="border-b border-gray-300 py-4">
                  <div className="mb-1 flex gap-x-1 align-middle leading-snug">
                    <h2 className="text-xl font-bold text-slate-800">
                      Description
                    </h2>
                    <p className="pt-1 font-thin">(optional)</p>
                  </div>

                  <div className="mt-5 flex grow flex-wrap">
                    <div className="mr-2 grow">
                      <input
                        className="form-input w-full"
                        type="text"
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...register('description')}
                      />
                    </div>
                  </div>
                </section>

                <section className="border-b border-gray-300 py-4">
                  <h2 className="mb-4 text-xl font-bold leading-snug text-slate-800">
                    Visibility
                  </h2>

                  <div className="flew-row flex items-center gap-x-4 pb-3">
                    <input
                      // eslint-disable-next-line react/jsx-props-no-spreading
                      {...register('visibility')}
                      className="form-radio"
                      type="radio"
                      value="public"
                      defaultChecked
                    />
                    <FontAwesomeIcon icon={faBookBookmark} size="lg" />
                    <div>
                      <p className="font-bold">Public</p>
                      <p className="text-sm font-light">
                        Anyone on the internet can see this project.
                      </p>
                    </div>
                  </div>
                  <div className="flew-row flex items-center gap-x-4">
                    <input
                      // eslint-disable-next-line react/jsx-props-no-spreading
                      {...register('visibility')}
                      className="form-radio"
                      type="radio"
                      value="private"
                    />
                    <FontAwesomeIcon icon={faLock} size="lg" />
                    <div>
                      <p className="font-bold">Private</p>
                      <p className="text-sm font-light">
                        Only invited users and users that are part of the same
                        organization the project is created will be able to view
                        the project
                      </p>
                    </div>
                  </div>
                </section>

                <div className="flex flex-col border-t border-slate-200 py-5">
                  <div className="flex self-end">
                    <Button type="submit" disabled={isSubmitting}>
                      Create Project
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </DefaultLayout>
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const helpers = await ssrHelper(context)
  return helpers.users.getOrganizations
    .prefetch()
    .then(() => {
      return {
        props: {
          trpcState: helpers.dehydrate(),
        },
      }
    })
    .catch(() => {
      return {
        redirect: {
          destination: '/404',
          permanent: false,
        },
      }
    })
}
