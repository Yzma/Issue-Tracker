import { useRouter } from "next/router"
import Head from "next/head"

import Header from "@/components/Header"

import { Formik, Form, Field } from "formik"
import { ProjectCreationSchema } from "@/lib/yup-schemas"

import axios from "axios"

import { useSession } from "next-auth/react"

import prisma from "@/lib/prisma/prisma"
import { getServerSession } from "@/lib/sessions"

export default function ProjectCreate(props) {
  const router = useRouter()
  console.log("Props: ", props)
  const { data: session } = useSession()
  const map = props.organizations.map((e, index) => (
    <option key={index} value={e.organization.name}>
      {e.organization.name}
    </option>
  ))

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
                          A repository contains all project files, including the
                          revision history. Already have a project repository
                          elsewhere?
                        </div>
                        <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                          <Formik
                            initialValues={{
                              name: "",
                              description: "",
                              private: false,
                              owner: session?.namespace
                            }}
                            validationSchema={ProjectCreationSchema}
                            validateOnChange={false}
                            validateOnBlur={false}
                            onSubmit={(
                              values,
                              { setSubmitting, setFieldError }
                            ) => {
                              values.private =
                                values.private == "true" ? true : false

                              axios
                                .post("/api/projects", {
                                  name: values.name,
                                  description: values.description,
                                  private: values.private,
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
                                  setFieldError("name", false)
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
                                        key={session?.namespace}
                                        value={session?.namespace}
                                      >
                                        {session?.namespace}
                                      </option>
                                      {map}
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

                                  <div class="flex flew-row gap-x-4 items-center pb-3">
                                    <Field
                                      className="form-radio"
                                      type="radio"
                                      name="private"
                                      value="false"
                                      checked={true}
                                    />

                                    <div>
                                      <p className="font-bold">Public</p>
                                      <p className="text-sm font-light">
                                        Anyone on the internet can see this
                                        repository. You choose who can commit.
                                      </p>
                                    </div>
                                  </div>
                                  <div class="flex flew-row gap-x-4 items-center">
                                    <Field
                                      className="form-radio"
                                      type="radio"
                                      name="private"
                                      value="true"
                                    />

                                    <div>
                                      <p className="font-bold">Private</p>
                                      <p className="text-sm font-light">
                                        You choose who can see and commit to
                                        this repository.
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

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res)
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
      organization: {
        is: {} // TODO: Double check this is actually checking the the field is null or not by looking at what prisma is producing
      }
    },

    select: {
      id: true,
      organization: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })

  console.log(organizations)

  return {
    props: {
      organizations: organizations
    }
  }
}
