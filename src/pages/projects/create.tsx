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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormRequiredField,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Skeleton } from '@/components/ui/skeleton'

type ProjectCreationType = z.infer<typeof ProjectCreationSchema>

export default function ProjectCreate() {
  const router = useRouter()

  const createProjectMutation = trpc.projects.create.useMutation()
  const userOrganizations = trpc.users.getOwnOrganizations.useQuery()
  const { data: session } = useSession()

  const form = useForm<ProjectCreationType>({
    resolver: zodResolver(ProjectCreationSchema),
    defaultValues: {
      name: '',
      description: '',
      visibility: 'public',
    },
  })

  const onSubmit: SubmitHandler<ProjectCreationType> = (data) => {
    createProjectMutation
      .mutateAsync(data)
      .then((response) =>
        router.push(`/${response.namespace}/${response.name}`)
      )
      .catch(() => {
        form.setError('owner', {
          type: 'custom',
          message:
            'Failed to create project. Please contact support if the error persists.',
        })
      })
  }

  const options = useMemo(() => {
    if (!userOrganizations.data || !session) return []
    return (
      <>
        <SelectItem
          key={session.user.namespace.name}
          value={session.user.namespace.name}
        >
          {session.user.namespace.name}
        </SelectItem>
        {userOrganizations.data.map((organization) => {
          return (
            <SelectItem key={organization.name} value={organization.name}>
              {organization.name}
            </SelectItem>
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
            <div className="pb-2">
              <h2 className="mb-1 text-3xl font-bold leading-snug text-slate-800">
                Create a new project
              </h2>
              <div className="font-semibold">
                A project contains all stored issues.
              </div>
            </div>

            <Separator />

            <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-4">
              {/* eslint-disable-next-line react/jsx-props-no-spreading */}
              <Form {...form}>
                {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
                <form
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <section className="flex flex-row py-4">
                    <FormField
                      control={form.control}
                      name="owner"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Owner <FormRequiredField />
                          </FormLabel>
                          <Select onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger className="w-64">
                                <SelectValue placeholder="Chose an owner" />
                              </SelectTrigger>
                            </FormControl>
                            {!options && (
                              <SelectContent>
                                <SelectItem disabled value="1">
                                  <Skeleton className="h-3.5 w-52" />
                                </SelectItem>
                                <SelectItem disabled value="2">
                                  <Skeleton className="h-3.5 w-52" />
                                </SelectItem>
                                <SelectItem disabled value="3">
                                  <Skeleton className="h-3.5 w-52" />
                                </SelectItem>
                              </SelectContent>
                            )}
                            {options && (
                              <SelectContent>{options}</SelectContent>
                            )}
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="auto-cols-auto px-3 pt-8 text-2xl font-semibold">
                      /
                    </div>

                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>
                            Project Name <FormRequiredField />
                          </FormLabel>
                          <FormControl>
                            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                            <Input {...field} className="py-0" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </section>

                  <Separator />

                  <section className="py-4">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="mb-1 flex gap-x-1 align-middle leading-snug">
                            <h2 className="text-xl font-bold text-slate-800">
                              Description
                            </h2>
                            <p className="pt-1 font-light">(optional)</p>
                          </FormLabel>
                          <FormControl>
                            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </section>

                  <Separator />

                  <section className="py-4">
                    <h2 className="mb-4 text-xl font-bold leading-snug text-slate-800">
                      Visibility
                    </h2>

                    <FormField
                      control={form.control}
                      name="visibility"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue="public"
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem id="public" value="public" />
                              </FormControl>
                              <FontAwesomeIcon
                                icon={faBookBookmark}
                                size="lg"
                              />
                              <div>
                                <p className="font-bold">Public</p>
                                <p className="text-sm font-light">
                                  Anyone on the internet can see this project.
                                </p>
                              </div>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem id="private" value="private" />
                              </FormControl>
                              <FontAwesomeIcon icon={faLock} size="lg" />
                              <div>
                                <p className="font-bold">Private</p>
                                <p className="text-sm font-light">
                                  Only invited users and users that are part of
                                  the same organization the project is created
                                  will be able to view the project
                                </p>
                              </div>
                            </FormItem>
                          </RadioGroup>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </section>

                  <Separator />

                  <div className="flex flex-col py-5">
                    <div className="flex self-end">
                      <Button
                        type="submit"
                        disabled={
                          form.formState.isSubmitting ||
                          createProjectMutation.isLoading ||
                          !options
                        }
                      >
                        Create Project
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </DefaultLayout>
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const helpers = await ssrHelper(context)
  return helpers.users.getOwnOrganizations
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
