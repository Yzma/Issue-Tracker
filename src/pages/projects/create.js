import Head from "next/head"

import { Formik, Form, Field } from "formik"
import { ProjectCreationSchema } from "@/lib/yup-schemas"

import "bootstrap/dist/css/bootstrap.min.css"

export default function ProjectCreate() {
  return (
    <>
      <Head>
        <title>Create new Project</title>
        <meta name="description" content="Create a new project" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="mt-5" />

      <div className="container">
        <h2>Create a new Project</h2>
        <p>
          A project contains all project files, including the revision history.
        </p>

        <hr />

        <Formik
          initialValues={{ name: "", description: "", private: false }}
          validationSchema={ProjectCreationSchema}
          onSubmit={(values, { setSubmitting, setFieldError }) => {
            setSubmitting(false)
            console.log(values)
            // axios
            //   .post("/api/organization", {
            //     name: values.name
            //   })
            //   .then((response) => {
            //     console.log("RESPONSE:", response)
            //     router.push("/")
            //   })
            //   .catch((error) => {
            //     console.log("ERROR:", error)
            //     setFieldError("name", "name already in use")
            //   })
            //   .finally(() => {
            //     setSubmitting(false)
            //   })
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
              {(errors.name || errors.description || errors.private) && (
                <div class="alert alert-danger" role="alert">
                  <ul>
                    {errors.name && <li>Name: {errors.name}</li>}
                    {errors.description && <li>Description: {errors.description}</li>}
                    {errors.private && <li>private: {errors.private}</li>}
                  </ul>
                </div>
              )}

              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Project Name
                </label>
                <Field className="form-control" type="text" name="name" />
                <div id="name" className="form-text">
                  Great repository names are short and memorable.
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Description (optional)
                </label>
                <Field
                  className="form-control"
                  type="text"
                  name="description"
                />
              </div>

              <hr />

              <div className="form-check">
                <Field
                  className="form-check-input"
                  type="radio"
                  name="private"
                  value="false"
                  checked={true}
                />
                <label className="form-check-label" htmlFor="exampleRadios1">
                  Public
                </label>
              </div>
              <div className="form-check">
                <Field
                  className="form-check-input"
                  type="radio"
                  name="private"
                  value="true"
                />
                <label className="form-check-label" htmlFor="exampleRadios2">
                  Private
                </label>
              </div>

              {errors.name && <div>Name errors:{errors.name}</div>}
              {errors.description && (
                <div>Description errors: {errors.description}</div>
              )}
              {errors.private && <div>Private error: {errors.private}</div>}

              <hr />

              <button
                type="submit"
                className="btn btn-success"
                disabled={isSubmitting}
              >
                Create Project
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </>
  )
}

// export async function getServerSideProps() {
//   // Pass data to the page via props
//   return { props: { test: true } }
// }
