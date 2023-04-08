import { useState } from "react"
import Head from "next/head"
import Header from "@/components/Header"

import axios from "axios"
import { Formik, Form, Field } from "formik"

import { getSession, useSession } from "next-auth/react"
import prisma from "@/lib/prisma/prisma"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBug } from "@fortawesome/free-solid-svg-icons";

export default function UserSettings(props) {
  console.log(props)

  const { data: session } = useSession()
  const [data, setData] = useState(props.settings)

  return (
    <>
      <Head>
        <title>User Settings</title>
        <meta name="description" content="User Settings Page" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />

      <main className="h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-3xl text-gray-800 font-bold mb-6">
            User Settings
          </h1>
          <div className="bg-white shadow-lg rounded-sm p-6">
            <Formik
              initialValues={{
                bio: data.bio,
                linkedIn: data.linkedIn,
                twitter: data.twitter,
                github: data.github,
                publicEmail: data.publicEmail
              }}
              onSubmit={(values, { setSubmitting, setFieldError }) => {
                console.log(values)
                axios
                  .put(`/api/user`, {
                    bio: values.bio,
                    linkedIn: values.linkedIn,
                    twitter: values.twitter,
                    github: values.github,
                    publicEmail: values.publicEmail
                  })
                  .then((response) => {
                    console.log("RESPONSE:", response)
                    setData((prev) => ({
                      ...prev,
                      ...response.data.result
                    }))
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
                errors,
                isSubmitting,
                values,
                setFieldValue,
                submitForm,
                setValues
              }) => (
                <Form>
                  <div className="mb-4">
                    <div className="block text-sm font-medium text-gray-700 mb-2">
                      Bio:
                    </div>

                    <Field
                      className="form-input w-full"
                      type="textarea"
                      name="bio"
                    />
                  </div>

                  {["linkedIn", "twitter", "github", "publicEmail"].map(
                    (platform) => (
                      <div className="mb-4" key={platform}>
                        <div className="block text-sm font-medium text-gray-700 mb-2">
                          {`${platform.charAt(0).toUpperCase()}${platform.slice(
                            1
                          )}:`}
                        </div>

                        <Field
                          className="form-input w-full"
                          type="textarea"
                          name={platform}
                        />
                      </div>
                    )
                  )}
                  <div className="flex flex-row gap-3">
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Save
                    </button>
                    <Link
                      href={session ? `/${session.namespace}` : "/"}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Back
                    </Link>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </main>
    </>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    }
  }

  const settings = await prisma.user.findUnique({
    where: {
      id: session.user.id
    },

    select: {
      bio: true,
      linkedIn: true,
      twitter: true,
      github: true,
      publicEmail: true
    }
  })

  return {
    props: {
      settings
    }
  }
}
