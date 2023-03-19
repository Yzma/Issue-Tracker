import Head from "next/head"
import { useRouter } from "next/router";

import { Formik, Form, Field } from 'formik';
import { OrganizationNameCreationSchema } from "@/lib/yup-schemas"

import axios from "axios"

import "bootstrap/dist/css/bootstrap.min.css"


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
      <div className="mt-5" />

      <div className="container">
        <h2>Create a new Organization</h2>

        <hr />

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
                router.push("/")
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
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting
            /* and other goodies */
          }) => (
            <Form>
              <div className="mb-3">
                
                <label htmlFor="name" className="form-label">
                  Organization Name
                </label>
                <Field name="name" />
        
                <div className="form-text">
                  <p>This will be the name of your account on GitHub.</p>
                  <p>Your URL will be: https://github.com/{values.name}</p>
                </div>
              </div>
              {errors.name && <div>{errors.name}</div>}
              <hr />

              <button
                type="submit"
                className="btn btn-success"
                disabled={isSubmitting}
              >
                Create Organization
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </>
  )
}
