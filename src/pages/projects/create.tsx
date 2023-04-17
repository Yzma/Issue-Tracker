import Head from "next/head"
import { useRouter } from "next/router"

import Header from "@/components/Header"

import { Formik, Form, Field } from "formik"
import { ProjectCreationSchema } from "@/lib/yup-schemas"
import axios from "axios"

import { useSession } from "next-auth/react"

import prisma from "@/lib/prisma/prisma"
import { getServerSideSession } from "@/lib/sessions"
import { GetServerSideProps, InferGetServerSidePropsType } from "next"

type MemberOrganization = {
  id: string;
  name: string;
}

type ProjectCreationProps = {
  organizations: MemberOrganization[]
}

export default function ProjectCreate({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter()
  const { owner } = router.query
  console.log("Owner: ", owner)

  console.log("Props: ", data)
  const { data: session } = useSession()
  console.log("Session: ", session)

  // TODO: Look into this, there should be a better way
  if (!session) return

  return (
    <>
      <Head>
        <title>Create new Project</title>
        <meta name="description" content="Create a new project" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
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
                          <Formik
                            initialValues={{
                              name: "",
                              description: "",
                              private: "public",
                              owner: session?.user.namespace.name
                            }}
                            // validationSchema={ProjectCreationSchema}
                            validateOnChange={false}
                            validateOnBlur={false}
                            onSubmit={(
                              values,
                              { setSubmitting, setFieldError }
                            ) => {
                              axios
                                .post("/api/projects", {
                                  name: values.name,
                                  description: values.description,
                                  private: values.private === "private" ? true : false,
                                  owner: values.owner
                                })
                                .then((response) => {
                                  console.log("RESPONSE:", response)
                                  router.push(`/${values.owner}/${values.name}`)
                                })
                                .catch((error) => {
                                  console.log("ERROR:", error)
                                })
                                .finally(() => {
                                  setSubmitting(false)
                                })
                            }}
                          >
                            {({
                              values,
                              errors,
                              isSubmitting,
                              setFieldError
                            }) => (
                              <Form
                                onChange={() => {
                                  setFieldError("name", undefined)
                                }}
                              >
                                {errors.name && (
                                  <div className="py-3">
                                    <div className="flex w-full px-4 py-2 rounded-sm text-sm border bg-rose-100 border-rose-200 text-rose-600">
                                      <div>
                                        You must enter a valid project name
                                      </div>
                                    </div>
                                  </div>
                                )}

                                <section className="flex flex-row mb-4">
                                  <div className="sm:w-1/3">
                                    <label
                                      className="block text-sm font-medium mb-1"
                                      htmlFor="owner"
                                    >
                                      Owner{" "}
                                      <span className="text-rose-500">*</span>
                                    </label>
                                    <Field
                                      className="form-input w-full "
                                      as="select"
                                      name="owner"
                                    >
                                      <option
                                        key={session.user.namespace.name}
                                        value={session.user.namespace.name}
                                      >
                                        {session.user.namespace.name}
                                      </option>
                                      {data.organizations.map((e, index) => (
                                        <option key={index} value={e.id}>
                                          {e.name}
                                        </option>
                                      ))}
                                    </Field>
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
                                    <Field
                                      className="form-input w-full"
                                      type="text"
                                      name="name"
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
                                      <Field
                                        className="form-input w-full"
                                        type="text"
                                        name="description"
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
                                    <Field
                                      className="form-radio"
                                      type="radio"
                                      name="private"
                                      value="public"
                                      checked
                                    />

                                    <div>
                                      <p className="font-bold">Public</p>
                                      <p className="text-sm font-light">
                                        Anyone on the internet can see this
                                        project.
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex flew-row gap-x-4 items-center">
                                    <Field
                                      className="form-radio"
                                      type="radio"
                                      name="private"
                                      value="private"
                                    />

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
                              </Form>
                            )}
                          </Formik>
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

export const getServerSideProps: GetServerSideProps<{ data: ProjectCreationProps }> = async (context) => {
  const session = await getServerSideSession(context)
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    }
  }

  const organizations = await prisma.member.findMany({
    where: {
      userId: session.user.id,
      AND: [
        {
          project: null
        }
      ]
    },

    select: {
      organization: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })

  return {
    props: {
      data: {
        organizations: organizations.map((e) => e.organization)
      }
    }
  }
}
