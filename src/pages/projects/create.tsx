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
        console.log('ERROR:', error) // TODO: remove this
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
            <option
              key={organization.organization?.name}
              value={organization.organization?.name}
            >
              {organization.organization?.name}
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
        <div className="flex flex-col justify-center items-center">
          <div>
            <div className="border-b border-gray-300 pb-2">
              <h2 className="text-3xl leading-snug text-slate-800 font-bold mb-1">
                Create a new project
              </h2>
              <div className="font-semibold">
                A project contains all stored issues.
              </div>
            </div>

            <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
              <form onSubmit={handleSubmit(onSubmit)}>
                {errors.name?.message && (
                  <div className="py-3">
                    <div className="flex w-full px-4 py-2 rounded-sm text-sm border bg-rose-100 border-rose-200 text-rose-600">
                      <div>You must enter a valid username!</div>
                    </div>
                  </div>
                )}

                <section className="flex flex-row py-4 border-b border-gray-300">
                  <div className="sm:w-1/3">
                    <label
                      className="block text-sm font-medium mb-1"
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

                  <div className="auto-cols-auto pt-6 font-semibold text-2xl px-3">
                    /
                  </div>

                  <div className="sm:w-1/3 grow">
                    <label
                      className="block text-sm font-medium mb-1"
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

                <section className="py-4 border-b border-gray-300">
                  <div className="flex align-middle mb-1 leading-snug gap-x-1">
                    <h2 className="text-xl text-slate-800 font-bold">
                      Description
                    </h2>
                    <p className="pt-1 font-thin">(optional)</p>
                  </div>

                  <div className="flex flex-wrap mt-5 grow">
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

                <section className="py-4 border-b border-gray-300">
                  <h2 className="text-xl leading-snug text-slate-800 font-bold mb-4">
                    Visibility
                  </h2>

                  <div className="flex flew-row gap-x-4 items-center pb-3">
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
                  <div className="flex flew-row gap-x-4 items-center">
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

                <div className="flex flex-col py-5 border-t border-slate-200">
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
