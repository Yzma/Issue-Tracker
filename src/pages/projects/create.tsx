import { useMemo } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import Header from "@/components/Header"
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from "next-auth/react"
import { createServerSideHelpers } from '@trpc/react-query/server';
import { SubmitHandler, useForm } from "react-hook-form";
import { ProjectCreationSchema } from "@/lib/zod-schemas";
import { z } from "zod";

import superjson from 'superjson';
import { appRouter } from "@/server/root";
import { trpc } from "@/lib/trpc";

type ProjectCreationType = z.infer<typeof ProjectCreationSchema>;

export default function ProjectCreate() {
  const router = useRouter()

  const createProjectMutation = trpc.projects.create.useMutation()
  const userOrganizations = trpc.users.getOrganizations.useQuery();
  console.log("userOrganizations:", userOrganizations.data)
  const { data: session } = useSession()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProjectCreationType>({
    resolver: zodResolver(ProjectCreationSchema)
  });

  const onSubmit: SubmitHandler<ProjectCreationType> = data => {
    createProjectMutation.mutateAsync(data).then((response) => {
      console.log("RESPONSE:", response)
      console.log("data.name:", data.name)
      console.log("session?.user.name:",session?.user.namespace.name)
      router.push(`/${session?.user.namespace.name}/${data.name}`)
    })
    .catch((error) => {
      console.log("ERROR:", error)
    })
    console.log("onSubmit data", data)
  };

  const options = useMemo(() => {
    if (!userOrganizations.data) return []
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

  // TODO: Look into this, there should be a better way
  if (!session) return

  return (
    <>
      <Head>
        <title>Create new Project</title>
      </Head>

      <div className="flex h-screen overflow-hidden">
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <Header />

          <main>
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
              <div className="mb-8">
                <div className="flex flex-col md:flex-row md:-mr-px">
                  <div className="grow">
                    <div className="p-6 space-y-6">
                      <section>
                        <h2 className="text-3xl leading-snug text-slate-800 font-bold mb-1">
                          Create a new project
                        </h2>
                        <div className="font-light">
                          A project contains all stored issues.
                        </div>
                        <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">

                          <form onSubmit={handleSubmit(onSubmit)}>
                            {errors.name?.message && <div className="py-3">
                              <div className="flex w-full px-4 py-2 rounded-sm text-sm border bg-rose-100 border-rose-200 text-rose-600">
                                <div>You must enter a valid username!</div>
                              </div>
                            </div>
                            }

                            <section className="flex flex-row mb-4">
                              <div className="sm:w-1/3">
                                <label
                                  className="block text-sm font-medium mb-1"
                                  htmlFor="owner"
                                >
                                  Owner{" "}
                                  <span className="text-rose-500">*</span>
                                </label>
                                <select
                                  className="form-input w-full"
                                  {...register("owner")}
                                >
                                  {options}
                                </select>
                              </div>

                              <div className="auto-cols-auto pt-6 font-semibold text-2xl px-3">
                                /
                              </div>

                              <div className="sm:w-1/3 grow">
                                <label
                                  className="block text-sm font-medium mb-1"
                                  htmlFor="name"
                                >
                                  Project Name{" "}
                                  <span className="text-rose-500">*</span>
                                </label>
                                <input
                                  className="form-input w-full"
                                  type="text"
                                  {...register("name")}
                                />
                              </div>
                            </section>

                            <hr />

                            <section className="mt-4 mb-4 grow">
                              <h2 className="text-xl leading-snug text-slate-800 font-bold mb-1">
                                Description (optional)
                              </h2>
                              <div className="flex flex-wrap mt-5 grow">
                                <div className="mr-2 grow">
                                  <label
                                    className="sr-only"
                                    htmlFor="description"
                                  ></label>
                                  <input
                                    className="form-input w-full"
                                    type="text"
                                    {...register("description")}
                                  />
                                </div>
                              </div>
                            </section>

                            <hr />

                            <section className="mt-4 mb-4">
                              <h2 className="text-xl leading-snug text-slate-800 font-bold mb-4">
                                Visibility
                              </h2>

                              <div className="flex flew-row gap-x-4 items-center pb-3">
                                <input {...register("visibility")} className="form-radio" type="radio" value="public" defaultChecked />
                                <div>
                                  <p className="font-bold">Public</p>
                                  <p className="text-sm font-light">
                                    Anyone on the internet can see this
                                    project.
                                  </p>
                                </div>
                              </div>
                              <div className="flex flew-row gap-x-4 items-center">
                                <input {...register("visibility")} className="form-radio" type="radio" value="private" />
                                <div>
                                  <p className="font-bold">Private</p>
                                  <p className="text-sm font-light">
                                    Only invited users and users that are part of the same organization the project is created{" "}
                                    will be able to view the project
                                  </p>
                                </div>
                              </div>
                            </section>

                            <hr />

                            <div className="flex flex-col py-5 border-t border-slate-200">
                              <div className="flex self-start">
                                <button
                                  className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                                  type="submit"
                                  disabled={isSubmitting}
                                >
                                  Create Project
                                </button>
                              </div>
                            </div>
                          </form>
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps() {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: {},
    transformer: superjson,
  });

  await helpers.users.getOrganizations.prefetch();

  return {
    props: {
      trpcState: helpers.dehydrate(),
    },
  };
}
