import React, { useState } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import Dropdown from "react-bootstrap/Dropdown"
import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import SSRProvider from "react-bootstrap/SSRProvider"

import TimeAgo from "react-timeago"
import englishStrings from "react-timeago/lib/language-strings/en"
import buildFormatter from "react-timeago/lib/formatters/buildFormatter"

import { Formik, Form, Field } from "formik"
import { IssueCreationSchema } from "@/lib/yup-schemas"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faLock,
  faEllipsis,
  faThumbTack,
  faTrash,
  faGear
} from "@fortawesome/free-solid-svg-icons"

import prisma from "@/lib/prisma/prisma"
import axios from "axios"

import "bootstrap/dist/css/bootstrap.min.css"
import Header from "@/components/Header"

import MarkdownViewer from "@/components/markdown/MarkdownViewer"
import MarkdownEditor from "@/components/markdown/MarkdownEditor"
import Link from "next/link"

import { useSession } from "next-auth/react"

export default function IssuesView(props) {
  const { data: session } = useSession()
  const router = useRouter()
  const { namespaceName, projectName, issueId } = router.query

  const issue = props.issuesData

  // TODO: Sort this client side?
  issue.comments.sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt)
  })
  console.log(issue)

  const formatter = buildFormatter(englishStrings)

  const [showEditTitle, setShowEditTitle] = useState(false)
  const [showEditDescription, setShowDescription] = useState(false)
  const [showEditComment, setEditComment] = useState(null)

  const [showEditLabels, setEditLabels] = useState(false)
  const [showCloseIssue, setCloseIssue] = useState(false)
  const [showPinIssue, setPinIssue] = useState(false)
  const [showDeleteIssue, setDeleteIssue] = useState(false)

  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <FontAwesomeIcon
      className="mr-4"
      icon={faEllipsis}
      ref={ref}
      onClick={(e) => {
        e.preventDefault()
        onClick(e)
      }}
    >
      {children}
      &#x25bc;
    </FontAwesomeIcon>
  ))

  const CustomToggle2 = React.forwardRef(({ children, onClick }, ref) => (
    <FontAwesomeIcon
      className="mr-4"
      icon={faGear}
      ref={ref}
      onClick={(e) => {
        e.preventDefault()
        onClick(e)
      }}
    >
      {children}
      &#x25bc;
    </FontAwesomeIcon>
  ))

  const arraysEqual = (a, b) => {
    if (a === b) return true
    if (a == null || b == null) return false
    if (a.length !== b.length) return false

    for (let i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false
    }
    return true
  }

  const [defaultLabels, setDefaultLabels] = useState(issue.labels)

  const [labels, setLabels] = useState(issue.labels)

  console.log(namespaceName, projectName)

  // TODO: Schema doesn't validate label ids - figure out a way to check them
  const onLabelClick = (label) => {
    if (labels.find((e) => e.id === label.id)) {
      const filter = labels.filter((item) => item.id !== label.id)
      setLabels(filter)
    } else {
      setLabels([...labels, label])
    }
  }

  const editIssueTitle = () => {
    setShowEditTitle(true)
  }

  const editIssue = () => {}

  const editComment = (comment) => {}

  const deleteComment = (comment) => {
    handleClose()
  }

  const closeIssue = async () => {
    axios
      .put(`/api/${namespaceName}/${projectName}/issues`, {
        issueId: issueId,
        open: false
      })
      .then((response) => {
        console.log("RESPONSE:", response)
      })
      .catch((error) => {
        console.log("ERROR:", error)
      })
  }

  const pinIssue = () => {
    const inverse = !issue.pinned
    axios
      .put(`/api/${namespaceName}/${projectName}/issues`, {
        issueId: issueId,
        pinned: inverse
      })
      .then((response) => {
        console.log("RESPONSE:", response)
      })
      .catch((error) => {
        console.log("ERROR:", error)
      })
  }

  const deleteIssue = async () => {
    const data = {
      issueId: issue.id
    }
    console.log("deleting data ", data)

    axios
      .delete(`/api/${namespaceName}/${projectName}/issues`, {
        data: data
      })
      .then((response) => {
        console.log("RESPONSE:", response)
      })
      .catch((error) => {
        console.log("ERROR:", error)
      })
  }

  return (
    <>
      <SSRProvider>
        <Head>
          <title>Create Issues</title>
          <meta name="description" content="Generated by create next app" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this comment?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="danger" onClick={deleteComment}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showCloseIssue} onHide={() => setCloseIssue(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to close this issue?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setCloseIssue(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={closeIssue}>
              Close Issue
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showDeleteIssue} onHide={() => setDeleteIssue(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this issue?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setDeleteIssue(false)}>
              Close
            </Button>
            <Button variant="danger" onClick={deleteIssue}>
              Delete Issue
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showPinIssue} onHide={() => setPinIssue(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to {issue.pinned ? "unpin" : "pin"} this
            issue?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setPinIssue(false)}>
              Close
            </Button>
            <Button variant="success" onClick={pinIssue}>
              {issue.pinned ? "Unpin" : "Pin"} Issue
            </Button>
          </Modal.Footer>
        </Modal>

        <div className="mt-5 pt-5" />

        <Header />
        <div className="container">
          <div className="d-flex justify-content-between">
            {showEditTitle && (
              <Formik
                initialValues={{
                  name: ""
                }}
                // validationSchema={IssueCreationSchema}
                onSubmit={(values, { setSubmitting, setFieldError }) => {
                  axios
                    .put(`/api/${namespaceName}/${projectName}/issues`, {
                      issueId: issueId,
                      name: values.name
                    })
                    .then((response) => {
                      console.log("RESPONSE:", response)
                      props.issuesData.name = values.name // TODO: Probably a better way to do this
                      setShowEditTitle(false)
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
                  setValues
                }) => (
                  <Form>
                    <Field
                      className="form-control"
                      type="text"
                      name="name"
                      placeholder={issue.name}
                    />

                    {showEditTitle && (
                      <>
                        <button
                          type="submit"
                          className="btn btn-success"
                          onClick={editIssueTitle}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => setShowEditTitle(false)}
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </Form>
                )}
              </Formik>
            )}

            {!showEditTitle && <h2>{issue.name}</h2>}

            {!showEditTitle && session && session.user.id === issue.user.id && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowEditTitle(true)}
              >
                Edit
              </button>
            )}
          </div>

          <p>
            {issue.pinned && (
              <>
                <span className="badge bg-success">Pinned</span>{" "}
              </>
            )}
            {issue.open && (
              <>
                <span className="badge bg-success">Open</span>Opened{" "}
              </>
            )}
            {!issue.open && (
              <>
                <span className="badge bg-danger">Closed</span>Closed{" "}
              </>
            )}
            {new Date(issue.createdAt).toLocaleString("default", {
              year: "numeric",
              month: "long",
              day: "numeric"
            })}{" "}
            by{" "}
            <Link href={`/${issue.user.username}`}>{issue.user.username}</Link>
          </p>
          <hr />
        </div>

        <main className="container">
          <div className="row g-5">
            <div className="col-md-8">
              <article>
                <div className="d-flex justify-content-end align-self-center">
                  {!showEditDescription &&
                    session &&
                    session.user.id === issue.user.id && (
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowDescription(true)}
                      >
                        Edit
                      </button>
                    )}
                </div>

                {showEditDescription ? (
                  <Formik
                    initialValues={{
                      description: issue.description
                    }}
                    // validationSchema={IssueCreationSchema}
                    onSubmit={(values, { setSubmitting, setFieldError }) => {
                      axios
                        .put(`/api/${namespaceName}/${projectName}/issues`, {
                          issueId: issueId,
                          description: values.description
                        })
                        .then((response) => {
                          console.log("RESPONSE:", response)
                          // props.issuesData.name = values.name // TODO: Probably a better way to do this
                          // setShowEditTitle(false)
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
                      setValues
                    }) => (
                      <Form>
                        <MarkdownEditor
                          placeholder={issue.description}
                          onChange={(text) =>
                            setFieldValue("description", text)
                          }
                        >
                          <div className="d-flex flex-row-reverse">
                            <button
                              type="submit"
                              className="btn btn-danger"
                              onClick={() => setShowDescription(false)}
                            >
                              Cancel
                            </button>
                            <button type="submit" className="btn btn-success">
                              Submit
                            </button>
                          </div>
                        </MarkdownEditor>
                      </Form>
                    )}
                  </Formik>
                ) : (
                  <MarkdownViewer text={issue.description} />
                )}
              </article>

              <hr />

              {issue.comments.map((comment, index) => (
                <div key={index} className="card mb-5">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <div>
                      <Link href={`/${comment.user.username}`}>
                        {comment.user.username}
                      </Link>{" "}
                      commented{" "}
                      {
                        <TimeAgo
                          date={comment.createdAt}
                          live={false}
                          now={() => props.now}
                          formatter={formatter}
                        />
                      }
                    </div>

                    {session &&
                    session.user &&
                    session.user.id === comment.user.id ? (
                      <Dropdown>
                        <Dropdown.Toggle
                          as={CustomToggle}
                          id="dropdown-custom-components"
                        >
                          Custom toggle
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item
                            onClick={() => setEditComment({ id: comment.id })}
                          >
                            Edit
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => handleShow(comment)}>
                            Delete
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    ) : (
                      <div></div>
                    )}
                  </div>
                  <div className="card-body">
                    {showEditComment && showEditComment.id === comment.id ? (
                      <Formik
                        initialValues={{
                          description: comment.description
                        }}
                        // validationSchema={IssueCreationSchema}
                        onSubmit={(
                          values,
                          { setSubmitting, setFieldError }
                        ) => {
                          axios
                            .put(
                              `/api/${namespaceName}/${projectName}/comments`,
                              {
                                commentId: comment.id,
                                description: values.description
                              }
                            )
                            .then((response) => {
                              console.log("RESPONSE:", response)
                              // props.issuesData.name = values.name // TODO: Probably a better way to do this
                              // setShowEditTitle(false)
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
                          setValues
                        }) => (
                          <Form>
                            <MarkdownEditor
                              placeholder={comment.description}
                              onChange={(text) =>
                                setFieldValue("description", text)
                              }
                            >
                              <div className="d-flex flex-row-reverse">
                                <button
                                  type="submit"
                                  className="btn btn-danger"
                                  onClick={() => setEditComment(null)}
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  className="btn btn-success"
                                >
                                  Submit
                                </button>
                              </div>
                            </MarkdownEditor>
                          </Form>
                        )}
                      </Formik>
                    ) : (
                      <MarkdownViewer text={comment.description} />
                    )}
                  </div>
                </div>
              ))}

              <hr />

              <h3 className="mb-4">Create a comment</h3>

              <Formik
                initialValues={{
                  description: ""
                }}
                // validationSchema={IssueCreationSchema}
                onSubmit={(values, { setSubmitting, setFieldError }) => {
                  axios
                    .post(`/api/${namespaceName}/${projectName}/comments`, {
                      issueId: issueId,
                      description: values.description
                    })
                    .then((response) => {
                      console.log("RESPONSE:", response)
                      // TODO: Render to the screen - don't refresh the page
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
                  errors,
                  isSubmitting,
                  values,
                  setFieldValue,
                  setValues
                }) => (
                  <Form>
                    {(errors.name || errors.description || errors.private) && (
                      <div className="alert alert-danger" role="alert">
                        <ul>
                          {errors.description && (
                            <li>Description: {errors.description}</li>
                          )}
                        </ul>
                      </div>
                    )}

                    <MarkdownEditor
                      onChange={(text) => setFieldValue("description", text)}
                    >
                      <div className="d-flex flex-row-reverse">
                        <button
                          type="submit"
                          className="btn btn-success"
                          disabled={
                            isSubmitting || values.description.length === 0
                          }
                        >
                          Submit
                        </button>
                      </div>
                    </MarkdownEditor>
                  </Form>
                )}
              </Formik>
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
                <Link href={`/${issue.user.username}`}>
                  {issue.user.username}
                </Link>
              </div>

              <hr />

              <div>
                <div className="d-flex justify-content-between align-self-center">
                  <span className="text-secondary h5">Labels </span>
                  {issue.labels.length === 0 ? (
                    <div></div>
                  ) : (
                    <Dropdown>
                      <Dropdown.Toggle
                        as={CustomToggle2}
                        id="dropdown-custom-components"
                      >
                        Custom toggle
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        {issue.labels.map((label, index) => (
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
                  )}
                </div>
                {issue.labels.length === 0 ? (
                  <div>This project has no labels yet</div>
                ) : (
                  <div>
                    <Formik
                      initialValues={{
                        labels: labels
                      }}
                      // validationSchema={IssueCreationSchema}
                      onSubmit={(values, { setSubmitting, setFieldError }) => {
                        console.log(labels)
                        const map = labels.map((e) => {
                          return { id: e.id }
                        })

                        console.log("map: ", map)
                        axios
                          .put(`/api/${namespaceName}/${projectName}/issues`, {
                            issueId: issueId,
                            labels: map
                          })
                          .then((response) => {
                            console.log("RESPONSE:", response)
                            // TODO: Render to the screen - don't refresh the page
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
                        errors,
                        isSubmitting,
                        values,
                        setFieldValue,
                        setValues
                      }) => (
                        <Form>
                          {labels.map((label, index) => (
                            <span
                              className="badge"
                              style={{
                                color: "white",
                                background: `#${label.color}`
                              }}
                              key={index}
                            >
                              {label.name}
                            </span>
                          ))}

                          {!arraysEqual(labels, defaultLabels) && (
                            <>
                              <div className="d-flex flex-row-reverse">
                                <button
                                  type="submit"
                                  className="btn btn-success"
                                  disabled={isSubmitting}
                                >
                                  Save Changes
                                </button>
                              </div>
                            </>
                          )}
                        </Form>
                      )}
                    </Formik>
                  </div>
                )}
              </div>

              <hr />

              <div>
                <FontAwesomeIcon className="mr-4" icon={faLock} />
                <a href="#" onClick={() => setCloseIssue(true)}>
                  Close Issue
                </a>
              </div>

              <div>
                <FontAwesomeIcon className="mr-4" icon={faThumbTack} />
                <a href="#" onClick={() => setPinIssue(true)}>
                  {issue.pinned ? "Unpin" : "Pin"} Issue
                </a>
              </div>

              <div>
                <FontAwesomeIcon className="mr-4" icon={faTrash} />
                <a href="#" onClick={() => setDeleteIssue(true)}>
                  Delete Issue
                </a>
              </div>
            </div>
          </div>
        </main>
      </SSRProvider>
    </>
  )
}

export async function getServerSideProps(context) {
  const { namespaceName, projectName, issueId } = context.query

  console.log("issueId", issueId)
  const issuesData = await prisma.issue.findFirst({
    where: {
      id: issueId
    },

    select: {
      id: true,
      name: true,
      description: true,
      open: true,

      createdAt: true,
      updatedAt: true,
      issueNumber: true,

      pinned: true,
      user: {
        select: {
          id: true,
          username: true
        }
      },

      labels: true,
      comments: {
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          description: true,
          user: {
            select: {
              id: true,
              username: true
            }
          }
        }
      }
    }
  })

  console.log(issuesData)

  if (!issuesData) {
    return {
      redirect: {
        destination: "/404",
        permanent: false
      }
    }
  }

  const mappedComments = issuesData.comments.map((e) => {
    return {
      ...e,
      createdAt: e.createdAt.toISOString(),
      updatedAt: e.updatedAt.toISOString()
    }
  })

  return {
    props: {
      now: Date.now(),
      issuesData: {
        ...issuesData,
        comments: mappedComments,
        createdAt: issuesData.createdAt.toISOString(),
        updatedAt: issuesData.updatedAt.toISOString()
      }
    }
  }
}
