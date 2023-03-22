import { useState } from "react"
import Head from "next/head"
import { useRouter } from "next/router"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import MarkdownIt from 'markdown-it';

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import { Formik, Form, Field } from "formik"
import { IssueCreationSchema } from "@/lib/yup-schemas"

import Dropdown from 'react-bootstrap/Dropdown';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faGear
} from "@fortawesome/free-solid-svg-icons"

import axios from "axios"

import dynamic from 'next/dynamic';
import "bootstrap/dist/css/bootstrap.min.css"
import 'react-markdown-editor-lite/lib/index.css';

const MdEditor = dynamic(() => import('react-markdown-editor-lite'), {
  ssr: true,
});

const mdParser = new MarkdownIt({ 

});

const canView = {
  menu: true, 
  md: true, 
  html: false, 
  fullScreen: true, 
  hideMenu: true 
}
// view: {
//   menu: true,
//   md: false,
//   html: false
// }

export default function IssuesCreate(props) {
  const router = useRouter()
  const { namespaceName, projectName } = router.query

  const [labels, setLabels] = useState([])
  const [text, setText] = useState("")
  console.log(namespaceName, projectName)

  const onMarkdownChange = (html, text, event, desc) => {
    setText(text)
    desc = text
  }

  // TODO: Schema doesn't validate label ids - figure out a way to check them
  const onLabelClick = (label) => {
    console.log(label)
    if(labels.find(e => e.id === label.id)) {
      const filter = labels.filter(item => item.id !== label.id)
      setLabels(filter)
    } else {
      setLabels([...labels, label])
    }
  }

  console.log(props.labels)
  return (
    <>
      <Head>
        <title>Create Issues</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="mt-5" />

      <div className="container">
        <div className="d-flex justify-content-between">
          <h2>Create new Issue</h2>
        </div>

        <hr />
      </div>

      <main className="container">
        <div className="row g-5">
          <div className="col-md-8">
            <article>
              <Formik
                initialValues={{
                  name: "",
                  description: "",
                  labels: []
                }}
                validationSchema={IssueCreationSchema}
                onSubmit={(values, { setSubmitting, setFieldError }) => {
                  const labelIds = labels.map((e) => e.id)
                  axios
                    .post(`/api/${namespaceName}/${projectName}/issues`, {
                      name: values.name,
                      description: values.description,
                      labels: labelIds
                    })
                    .then((response) => {
                      console.log("RESPONSE:", response)
                      // TODO: Ensure proper data is returned on route, this could probably break easily...
                      console.log("id: ", response.data.result.id)
                      router.push(
                        `/${namespaceName}/${projectName}/issues/${response.data.result.id}`
                      )
                    })
                    .catch((error) => {
                      console.log("ERROR:", error.response.data)
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
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  isSubmitting,
                  setFieldValue
                  /* and other goodies */
                }) => (
                  <Form>
                    {(errors.name || errors.description || errors.private) && (
                      <div className="alert alert-danger" role="alert">
                        <ul>
                          {errors.name && <li>Name: {errors.name}</li>}
                          {errors.description && (
                            <li>Description: {errors.description}</li>
                          )}
                          {errors.private && <li>private: {errors.private}</li>}
                        </ul>
                      </div>
                    )}

                    <label htmlFor="owner" className="form-label">
                      Title
                    </label>
                    <Field className="form-control" type="text" name="name" />

                    <div className="mb-3">
                      <div className="form-group">
                        <label htmlFor="description" className="form-label">
                          Description (optional)
                        </label>

                        <div class="card">
                          <div class="card-header">
                            <Tabs
                              defaultActiveKey="write"
                              id="uncontrolled-tab-example"
                              className="mb-3"
                            >
                              <Tab eventKey="write" title="Write">
                                <div class="card-body">
                                  <MdEditor 
                                    style={{ height: '500px' }} 
                                    renderHTML={text => mdParser.render(text)} 
                                    onChange={({html, text}, event) =>  {
                                      onMarkdownChange(html, text, event, values.description)
                                      setFieldValue("description", text)
                                    }}
                                    view={{ menu: true, md: true, html: false }}/>
                                </div>
                              </Tab>

                              <Tab eventKey="preview" title="Preview">
                                <div class="card-body">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                  {text}
                                </ReactMarkdown>
                                </div>
                              </Tab>

                            </Tabs>
                          </div>
                        </div>

                        {/* <Field
                          className="form-control"
                          type="textarea"
                          as={"textarea"}
                          name="description"
                          rows="3"
                          value={text}
                        /> */}
                      </div>
                    </div>

                    {errors.name && <div>Name errors:{errors.name}</div>}
                    {errors.description && (
                      <div>Description errors: {errors.description}</div>
                    )}
                    {errors.private && (
                      <div>Private error: {errors.private}</div>
                    )}

                    <hr />

                    <button
                      type="submit"
                      className="btn btn-success"
                      disabled={isSubmitting}
                    >
                      Create Issue
                    </button>
                  </Form>
                )}
              </Formik>
            </article>
          </div>

          <div className="col-md-4">
            <div>
              <div className="d-flex justify-content-between">
                <span className="text-secondary h5">Asignees </span>
                <FontAwesomeIcon
                  className="mr-4 align-self-center align-middle"
                  icon={faGear}
                />
              </div>
              <a>Yzma</a>
            </div>

            <hr />

            <div>
              <div className="d-flex justify-content-between align-self-center">
                <span className="text-secondary h5">Labels </span>
                <Dropdown align="end">
                  <Dropdown.Toggle variant="success" id="dropdown-basic">
                    Change me
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    {props.labels.map((label, index) => (
                      <Dropdown.Item
                        key={index}
                        lable-id={label.id}
                        onClick={() => onLabelClick(label)}
                      >
                        {label.name}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
                {/* <FontAwesomeIcon
                  className="mr-4 align-self-center align-middle"
                  icon={faGear}
                /> */}
              </div>
              {labels.map((label, index) => (
                <span key={index} className="badge bg-primary">
                  {label.name}
                </span>
              ))}
            </div>

            <hr />
          </div>
        </div>
      </main>
    </>
  )
}

export async function getServerSideProps(context) {
  const { namespaceName, projectName } = context.query
  const labels = await prisma.label.findMany({
    where: {
      project: {
        name: projectName,
        namespace: {
          name: namespaceName
        }
      }
    }
  });

  return {
    props: {
      labels: labels
    },
  };
}
