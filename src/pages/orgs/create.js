import Head from "next/head"
import { useRouter } from "next/router"
import { Formik, Form, Field } from "formik"
import { OrganizationNameCreationSchema } from "@/lib/yup-schemas"

import axios from "axios"
import Header from "@/components/Header"

export default function OrganizationCreate() {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Create new Organization</title>
        <meta name="description" content="Create a new organization" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
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
                <Formik
                  initialValues={{ name: "" }}
                  validationSchema={OrganizationNameCreationSchema}
                  onSubmit={(values, { setSubmitting, setFieldError }) => {
                    axios
                      .post("/api/organization", {
                        name: values.name
                      })
                      .then((response) => {
                        console.log("RESPONSE:", response)
                        router.push(`/${response.data.name}`)
                      })
                      .catch((error) => {
                        console.log("ERROR:", error)
                        setFieldError("name", "name already in use")
                      })
                      .finally(() => {
                        setSubmitting(false)
                      })
                  }}
                >
                  {({ values, errors, isSubmitting }) => (
                    <Form className="pt-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Organization Name{" "}
                          <span className="text-rose-500">*</span>
                        </label>
                        <Field
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          type="text"
                          name="name"
                        />
                      </div>

                      <div className="text-sm pt-4">
                        <p>This will be the name of your account on GitHub.</p>
                        <p>
                          Your URL will be: https://github.com/{values.name}
                        </p>
                      </div>

                      {errors.name && <div>{errors.name}</div>}
             
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
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
