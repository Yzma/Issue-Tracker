import React, { useState } from "react"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"

import TimeAgo from "react-timeago"
import englishStrings from "react-timeago/lib/language-strings/en"
import buildFormatter from "react-timeago/lib/formatters/buildFormatter"

import { Formik, Form, Field } from "formik"
import { IssueCreationSchema } from "@/lib/yup-schemas"

import * as Dialog from "@radix-ui/react-dialog"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"

import Header from "@/components/Header"
import ProjectBelowNavbar from "@/components/navbar/ProjectBelowNavbar"
import Comment from "@/components/comment/Comment"
import CommentApi from "@/components/comment-api/CommentApi"

import MarkdownViewer from "@/components/markdown/MarkdownViewer"
import MarkdownEditor from "@/components/markdown/MarkdownEditor"

import { Tab } from "@headlessui/react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faLock,
  faThumbTack,
  faTrash,
  faGear,
  faCircle,
  faXmark
} from "@fortawesome/free-solid-svg-icons"

import axios from "axios"

import { useSession } from "next-auth/react"
import prisma from "@/lib/prisma/prisma"
import IssueComment from "@/components/comment-api/IssueComment"

const FormButton = (props) => {
  return (
    <>
      <button
        {...props}
        onClick={(e) => {
          if (!props.shouldSubmit) {
            e.preventDefault(e)
          }
          props.onClick?.(e)
        }}
      >
        {props.children}
      </button>
    </>
  )
}

export default function IssuesView(props) {
  const { data: session } = useSession()
  const router = useRouter()
  const { namespaceName, projectName, issueId } = router.query

  const issue = props.issuesData
  const [issueState, setIssueState] = useState(props.issuesData)

  // TODO: Sort this client side?
  issueState.comments.sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt)
  })
  console.log("ISSUE STATE: ", issueState)

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

  const arraysEqual = (a, b) => {
    if (a === b) return true
    if (a == null || b == null) return false
    if (a.length !== b.length) return false

    for (let i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false
    }
    return true
  }

  const [defaultLabels, setDefaultLabels] = useState(issueState.labels)

  const [labels, setLabels] = useState(issueState.labels)

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

  const deleteComment = (comment) => {
    handleClose()
  }

  const closeIssue = async () => {
    axios
      .put(`/api/${namespaceName}/${projectName}/issues`, {
        issueId: issueId,
        open: !issueState.open
      })
      .then((response) => {
        console.log("RESPONSE:", response)
        setIssueState((prevState) => ({
          ...prevState,
          open: response.data.result.open
        }))
      })
      .catch((error) => {
        console.log("ERROR:", error)
      })
  }

  const pinIssue = () => {
    const inverse = !issueState.pinned
    axios
      .put(`/api/${namespaceName}/${projectName}/issues`, {
        issueId: issueId,
        pinned: inverse
      })
      .then((response) => {
        console.log("RESPONSE:", response)
        setIssueState((prevState) => ({
          ...prevState,
          pinned: response.data.result.pinned
        }))
      })
      .catch((error) => {
        console.log("ERROR:", error)
      })
  }

  const deleteIssue = async () => {
    const data = {
      issueId: issueState.id
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

  const copyIssueLink = async () => {
    const link = `/${namespaceName}/${projectName}/issues/${issueId}`
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(link)
    } else {
      return document.execCommand("copy", true, link)
    }
  }

  return (
    <>
      <Head>
        <title>Create Issues</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* <Modal show={show} onHide={handleClose}>
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
      </Modal> */}

      <Dialog.Root open={show} onOpenChange={handleClose}>
        <Dialog.Portal>
          <Dialog.Overlay className="DialogOverlay" />
          <Dialog.Content className="DialogContent">
            <Dialog.Title className="DialogTitle">Confirmation</Dialog.Title>
            <Dialog.Description className="DialogDescription">
              Are you sure you want to delete this comment?
            </Dialog.Description>
            <div
              className="gap-2"
              style={{
                display: "flex",
                marginTop: 25,
                justifyContent: "flex-end"
              }}
            >
              <Dialog.Close asChild>
                <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white">
                  Cancel
                </button>
              </Dialog.Close>
              <Dialog.Close asChild>
                <button
                  className="btn bg-red-500 hover:bg-red-600 text-white"
                  onClick={deleteComment}
                >
                  Confirm
                </button>
              </Dialog.Close>
            </div>
            <Dialog.Close asChild>
              <button className="IconButton" aria-label="Close">
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* <Modal show={showCloseIssue} onHide={() => setCloseIssue(false)}>
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
      </Modal> */}

      <Dialog.Root
        open={showCloseIssue}
        onOpenChange={() => setCloseIssue(false)}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="DialogOverlay" />
          <Dialog.Content className="DialogContent">
            <Dialog.Title className="DialogTitle">Confirmation</Dialog.Title>
            <Dialog.Description className="DialogDescription">
              Are you sure you want to{" "}
              {issueState.open ? <>close</> : <>reopen</>} this issue?
            </Dialog.Description>
            <div
              className="gap-2"
              style={{
                display: "flex",
                marginTop: 25,
                justifyContent: "flex-end"
              }}
            >
              <Dialog.Close asChild>
                <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white">
                  Cancel
                </button>
              </Dialog.Close>
              <Dialog.Close asChild>
                <button
                  className="btn bg-red-500 hover:bg-red-600 text-white"
                  onClick={closeIssue}
                >
                  Confirm
                </button>
              </Dialog.Close>
            </div>
            <Dialog.Close asChild>
              <button className="IconButton" aria-label="Close">
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* <Modal show={showDeleteIssue} onHide={() => setDeleteIssue(false)}>
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
      </Modal> */}

      <Dialog.Root
        open={showDeleteIssue}
        onOpenChange={() => setDeleteIssue(false)}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="DialogOverlay" />
          <Dialog.Content className="DialogContent">
            <Dialog.Title className="DialogTitle">Confirmation</Dialog.Title>
            <Dialog.Description className="DialogDescription">
              Are you sure you want to delete this issue?
            </Dialog.Description>
            <div
              className="gap-2"
              style={{
                display: "flex",
                marginTop: 25,
                justifyContent: "flex-end"
              }}
            >
              <Dialog.Close asChild>
                <button
                  className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                  onClick={() => setDeleteIssue(false)}
                >
                  Cancel
                </button>
              </Dialog.Close>
              <Dialog.Close asChild>
                <button
                  className="btn bg-red-500 hover:bg-red-600 text-white"
                  onClick={deleteComment}
                >
                  Confirm
                </button>
              </Dialog.Close>
            </div>
            <Dialog.Close asChild>
              <button className="IconButton" aria-label="Close">
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* <Modal show={showPinIssue} onHide={() => setPinIssue(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to {issue.pinned ? "unpin" : "pin"} this issue?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setPinIssue(false)}>
            Close
          </Button>
          <Button variant="success" onClick={pinIssue}>
            {issue.pinned ? "Unpin" : "Pin"} Issue
          </Button>
        </Modal.Footer>
      </Modal> */}

      <Dialog.Root open={showPinIssue} onOpenChange={() => setPinIssue(false)}>
        <Dialog.Portal>
          <Dialog.Overlay className="DialogOverlay" />
          <Dialog.Content className="DialogContent">
            <Dialog.Title className="DialogTitle">Confirmation</Dialog.Title>
            <Dialog.Description className="DialogDescription">
              Are you sure you want to {issueState.pinned ? "unpin" : "pin"}{" "}
              this issue?
            </Dialog.Description>
            <div
              className="gap-2"
              style={{
                display: "flex",
                marginTop: 25,
                justifyContent: "flex-end"
              }}
            >
              <Dialog.Close asChild>
                <button
                  className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                  onClick={() => setPinIssue(false)}
                >
                  Cancel
                </button>
              </Dialog.Close>
              <Dialog.Close asChild>
                <button
                  className="btn bg-red-500 hover:bg-red-600 text-white"
                  onClick={pinIssue}
                >
                  {issueState.pinned ? "Unpin" : "Pin"} Issue
                </button>
              </Dialog.Close>
            </div>
            <Dialog.Close asChild>
              <button className="IconButton" aria-label="Close">
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <div className="flex h-screen overflow-hidden">
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <Header />

          <ProjectBelowNavbar
            namespaceName={namespaceName}
            projectName={projectName}
          />

          <main>
            <div className="grid grid-cols-8 px-4 sm:px-6 lg:px-8 py-8 gap-6">
              <div class="col-start-2 col-span-6">
                {/* Title Section */}
                <section>
                  {/* Title and Edit buttons */}
                  <Formik
                    initialValues={{
                      name: ""
                    }}
                    // validationSchema={IssueCreationSchema}
                    onSubmit={(values, { setSubmitting }) => {
                      axios
                        .put(`/api/${namespaceName}/${projectName}/issues`, {
                          issueId: issueId,
                          name: values.name
                        })
                        .then((response) => {
                          console.log("RESPONSE:", response)
                          setIssueState((prevState) => ({
                            ...prevState,
                            name: response.data.result.name
                          }))
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
                    <Form>
                      <div className="flex justify-between">
                        {showEditTitle ? (
                          <Field
                            className="form-input w-1/2"
                            type="text"
                            name="name"
                            placeholder={issueState.name}
                          />
                        ) : (
                          <h2 className="text-2xl text-slate-800 font-bold">
                            {issueState.name}
                          </h2>
                        )}

                        <div className="flex flex-row gap-x-4">
                          {showEditTitle ? (
                            <>
                              <FormButton
                                shouldSubmit={true}
                                className="btn-xs h-8 shrink bg-emerald-500 hover:bg-emerald-600 text-white"
                              >
                                Save
                              </FormButton>

                              <FormButton
                                shouldSubmit={false}
                                onClick={() => setShowEditTitle(false)}
                                className="btn-xs h-8 shrink bg-rose-500 hover:bg-rose-600 text-white"
                              >
                                Cancel
                              </FormButton>
                            </>
                          ) : (
                            <>
                              {session &&
                                session.user.id === issueState.user.id && (
                                  <FormButton
                                    shouldSubmit={false}
                                    onClick={() => setShowEditTitle(true)}
                                    className="btn-xs h-8 bg-indigo-500 hover:bg-indigo-600 text-white"
                                  >
                                    Edit
                                  </FormButton>
                                )}
                              <Link
                                className="btn-xs h-8 bg-emerald-500 hover:bg-emerald-600 text-white"
                                href={`/${namespaceName}/${projectName}/new`}
                              >
                                New Issue
                              </Link>
                            </>
                          )}
                        </div>
                      </div>
                    </Form>
                  </Formik>

                  {/* Issue Information */}
                  <div className="pt-2">
                    <div className="flex flex-row">
                      <div className="flex flex-row">
                        {issueState.pinned && (
                          <>
                            <div className="text-sm text-center font-semibold text-white px-1.5 bg-emerald-500 rounded-full">
                              Pinned
                            </div>{" "}
                          </>
                        )}
                        {issueState.open && (
                          <>
                            <div className="text-sm text-center font-semibold text-white px-1.5 bg-emerald-500 rounded-full">
                              Open
                            </div>
                            Opened{" "}
                          </>
                        )}
                        {!issueState.open && (
                          <>
                            <div className="text-sm text-center font-semibold px-1.5 bg-rose-100 text-rose-600 rounded-full">
                              Closed
                            </div>
                            Closed{" "}
                          </>
                        )}
                      </div>
                      <div className="pl-1">
                        <p>
                          {new Date(issueState.createdAt).toLocaleString(
                            "default",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric"
                            }
                          )}{" "}
                          by{" "}
                          <Link
                            className="text-blue-600 hover:text-gray-900 hover:underline hover:cursor-pointer"
                            href={`/${issueState.user.username}`}
                          >
                            {issueState.user.username}
                          </Link>
                        </p>
                      </div>
                    </div>
                  </div>
                </section>{" "}
                <hr className="mt-3 mb-2" />
              </div>

              <div className="col-start-2 col-span-4">
                {/* Start Main Content */}
                <main>
                  <div className="row g-5">
                    {/* Issue body and Comment section */}
                    <section className="col-md-8">
                      {/* Issue body */}
                      <section>
                        <article>
                          {/* <div className="d-flex justify-content-end align-self-center">
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
                          </div> */}

                          <Formik
                            initialValues={{
                              description: issueState.description
                            }}
                            // validationSchema={IssueCreationSchema}
                            onSubmit={(
                              values,
                              { setSubmitting, setFieldError }
                            ) => {
                              axios
                                .put(
                                  `/api/${namespaceName}/${projectName}/issues`,
                                  {
                                    issueId: issueId,
                                    description: values.description
                                  }
                                )
                                .then((response) => {
                                  console.log("RESPONSE:", response)
                                  setIssueState((prevState) => ({
                                    ...prevState,
                                    description:
                                      response.data.result.description
                                  }))
                                  setShowDescription(false)
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
                              submitForm,
                              isSubmitting,
                              values,
                              setFieldValue,
                              setValues
                            }) => (
                              <Form>
                                <IssueComment
                                  text={issueState.description}
                                  username={issueState.user.username}
                                  createdAt={issueState.createdAt}
                                  formatter={formatter}
                                  canEdit={
                                    session &&
                                    session.namespace === issue.user.username
                                  }
                                  now={props.now}
                                  onChange={(text) =>
                                    setFieldValue("description", text)
                                  }
                                  onEdit={() => setShowDescription(true)}
                                  onCancel={() => setShowDescription(false)}
                                  onSubmit={() => submitForm()}
                                  editing={showEditDescription}
                                />

                                {/* <MarkdownEditor
                                    placeholder={issueState.description}
                                    onChange={(text) =>
                                      setFieldValue("description", text)
                                    }
                                  >
                                    <div className="d-flex flex-row-reverse">
                                      <button
                                        type="submit"
                                        className="btn btn-danger"
                                        onClick={() =>
                                          setShowDescription(false)
                                        }
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
                                  </MarkdownEditor> */}
                              </Form>
                            )}
                          </Formik>
                        </article>
                      </section>
                      {/* End Issue body */}

                      <hr className="mt-3 mb-6 divide-y divide-gray-400 hover:divide-y-8" />

                      {/* Comment Section */}
                      {issueState.comments.length > 0 && (
                        <section className="flex flex-col gap-y-12">
                          <div className="font-bold text-slate-800 text-3xl">
                            Comments ({issueState.comments.length})
                          </div>

                          {issueState.comments.map((comment, index) => (
                            <div key={index}>
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

                                      setIssueState((prevState) => ({
                                        ...prevState,
                                        comments: prevState.comments.map((comment, index) => {
                                          if(comment.id === response.data.result.id) {
                                            return {
                                              ...comment,
                                              description: response.data.result.description
                                            }
                                          }
                                          return {
                                            ...comment,
                                          }
                                        }) 
                                      }))
                                      setEditComment(null)
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
                                     <IssueComment
                                text={comment.description}
                                username={comment.user.username}
                                createdAt={comment.createdAt}
                                formatter={formatter}
                                canEdit={
                                  session &&
                                  session.namespace === comment.user.username
                                }
                                now={props.now}
                                onChange={(text) =>
                                  setFieldValue("description", text)
                                }
                                onEdit={() =>
                                  setEditComment({ id: comment.id })
                                } //setShowDescription(true)
                                onCancel={() => setEditComment(null)}
                                onSubmit={() => submitForm()}
                                editing={
                                  showEditComment !== null &&
                                  showEditComment.id === comment.id
                                }
                              />
                                  </Form>
                                )}
                              </Formik>

                             
                            </div>

                            // <div key={index} className="card mb-5">
                            //   <div className="card-header d-flex justify-content-between align-items-center">
                            //     <div>
                            //       <Link href={`/${comment.user.username}`}>
                            //         {comment.user.username}
                            //       </Link>{" "}
                            //       commented{" "}
                            //       {
                            //         <TimeAgo
                            //           date={comment.createdAt}
                            //           live={false}
                            //           now={() => props.now}
                            //           formatter={formatter}
                            //         />
                            //       }
                            //     </div>

                            //     {session &&
                            //     session.user &&
                            //     session.user.id === comment.user.id ? (
                            //       <Dropdown>
                            //         <Dropdown.Toggle
                            //           as={CustomToggle}
                            //           id="dropdown-custom-components"
                            //         >
                            //           Custom toggle
                            //         </Dropdown.Toggle>

                            //         <Dropdown.Menu>
                            //           <Dropdown.Item
                            //             onClick={() =>
                            //               setEditComment({ id: comment.id })
                            //             }
                            //           >
                            //             Edit
                            //           </Dropdown.Item>
                            //           <Dropdown.Item
                            //             onClick={() => handleShow(comment)}
                            //           >
                            //             Delete
                            //           </Dropdown.Item>
                            //         </Dropdown.Menu>
                            //       </Dropdown>
                            //     ) : (
                            //       <div></div>
                            //     )}
                            //   </div>
                            //   <div className="card-body">
                            //     {showEditComment &&
                            //     showEditComment.id === comment.id ? (
                            // <Formik
                            //   initialValues={{
                            //     description: comment.description
                            //   }}
                            //   // validationSchema={IssueCreationSchema}
                            //   onSubmit={(
                            //     values,
                            //     { setSubmitting, setFieldError }
                            //   ) => {
                            //     axios
                            //       .put(
                            //         `/api/${namespaceName}/${projectName}/comments`,
                            //         {
                            //           commentId: comment.id,
                            //           description: values.description
                            //         }
                            //       )
                            //       .then((response) => {
                            //         console.log("RESPONSE:", response)
                            //         // props.issuesData.name = values.name // TODO: Probably a better way to do this
                            //         // setShowEditTitle(false)
                            //       })
                            //       .catch((error) => {
                            //         console.log("ERROR:", error)
                            //       })
                            //       .finally(() => {
                            //         setSubmitting(false)
                            //       })
                            //   }}
                            // >
                            //   {({
                            //     errors,
                            //     isSubmitting,
                            //     values,
                            //     setFieldValue,
                            //     setValues
                            //   }) => (
                            //     <Form>
                            //       <MarkdownEditor
                            //         placeholder={comment.description}
                            //         onChange={(text) =>
                            //           setFieldValue("description", text)
                            //         }
                            //       >
                            //         <div className="d-flex flex-row-reverse">
                            //           <button
                            //             type="submit"
                            //             className="btn btn-danger"
                            //             onClick={() => setEditComment(null)}
                            //           >
                            //             Cancel
                            //           </button>
                            //           <button
                            //             type="submit"
                            //             className="btn btn-success"
                            //           >
                            //             Submit
                            //           </button>
                            //         </div>
                            //       </MarkdownEditor>
                            //     </Form>
                            //   )}
                            // </Formik>
                            //     ) : (
                            //       <MarkdownViewer text={comment.description} />
                            //     )}
                            //   </div>
                            // </div>
                          ))}
                        </section>
                      )}

                      {/* End Comment Section  */}

                      <hr className="mb-3 mt-3" />
                      {/* Create Comment Section  */}
                      <section>
                        <div className="font-bold text-slate-800 text-3xl">
                          Create a comment
                        </div>

                        <Formik
                          initialValues={{
                            description: ""
                          }}
                          // validationSchema={IssueCreationSchema}
                          onSubmit={(
                            values,
                            { setSubmitting, setFieldError }
                          ) => {
                            axios
                              .post(
                                `/api/${namespaceName}/${projectName}/comments`,
                                {
                                  issueId: issueId,
                                  description: values.description
                                }
                              )
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
                            submitForm,
                            setValues
                          }) => (
                            <Form>
                              {(errors.name ||
                                errors.description ||
                                errors.private) && (
                                <div
                                  className="alert alert-danger"
                                  role="alert"
                                >
                                  <ul>
                                    {errors.description && (
                                      <li>Description: {errors.description}</li>
                                    )}
                                  </ul>
                                </div>
                              )}

                              <IssueComment
                                text={""}
                                canEdit={false}
                                onChange={(text) =>
                                  setFieldValue("description", text)
                                }
                                onSubmit={() => submitForm()}
                                editing={true}
                              />

                              {/* <MarkdownEditor
                                onChange={(text) =>
                                  setFieldValue("description", text)
                                }
                              >
                                <div className="d-flex flex-row-reverse">
                                  <button
                                    type="submit"
                                    className="btn-xs h-8 bg-emerald-500 hover:bg-emerald-600 text-white"
                                    disabled={
                                      isSubmitting ||
                                      values.description.length === 0
                                    }
                                  >
                                    Submit
                                  </button>
                                </div>
                              </MarkdownEditor> */}
                            </Form>
                          )}
                        </Formik>
                      </section>
                      {/* End Create Comment Section  */}
                    </section>
                    {/* End Issue Description and Comment section */}
                  </div>
                </main>
                {/* End Main Content */}
              </div>

              {/* Issue Actions */}
              <div className="flex flex-col gap-y-2 col-md-4 col-span-2">
                {/* Asignees Action */}
                <div>
                  <div className="flex justify-between">
                    <span className="font-bold">Asignees </span>
                    <FontAwesomeIcon
                      className="mr-4 align-self-center align-middle"
                      icon={faGear}
                    />
                  </div>
                  <Link
                    className="text-blue-600 hover:text-gray-900 hover:underline hover:cursor-pointer"
                    href={`/${issueState.user.username}`}
                  >
                    {issueState.user.username}
                  </Link>
                </div>
                {/* End Asignees Action */}

                <hr />

                {/* Labels Actions */}
                <div className="">
                  <div className="flex justify-between align-self-center">
                    <span className="font-bold">Labels</span>
                    {issueState.project.labels.length !== 0 && (
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                          <FontAwesomeIcon
                            className="mr-4 align-self-center align-middle"
                            icon={faGear}
                          />
                        </DropdownMenu.Trigger>

                        <DropdownMenu.Portal>
                          <DropdownMenu.Content
                            className="DropdownMenuContent"
                            sideOffset={5}
                          >
                            {issueState.project.labels.map((label, index) => (
                              <DropdownMenu.Item
                                key={index}
                                className="DropdownMenuItem"
                                onClick={() => onLabelClick(label)}
                              >
                                <span>
                                  <FontAwesomeIcon
                                    className="mr-4 align-self-center align-middle"
                                    style={{
                                      color: `#${label.color}`
                                    }}
                                    icon={faCircle}
                                  />
                                </span>
                                {label.name}
                              </DropdownMenu.Item>
                            ))}
                          </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                      </DropdownMenu.Root>
                    )}
                  </div>
                  {issueState.project.labels.length === 0 ? (
                    <div>This project has no labels yet</div>
                  ) : (
                    <div>
                      <Formik
                        initialValues={{
                          labels: labels
                        }}
                        // validationSchema={IssueCreationSchema}
                        onSubmit={(
                          values,
                          { setSubmitting, setFieldError }
                        ) => {
                          console.log(labels)
                          const map = labels.map((e) => {
                            return { id: e.id }
                          })

                          console.log("map: ", map)
                          axios
                            .put(
                              `/api/${namespaceName}/${projectName}/issues`,
                              {
                                issueId: issueId,
                                labels: map
                              }
                            )
                            .then((response) => {
                              console.log("RESPONSE:", response)
                              setIssueState((prevState) => ({
                                ...prevState,
                                labels: response.data.result.labels
                              }))
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
                            <div className="flex gap-x-1 pt-2">
                              {labels.map((label, index) => (
                                <span
                                  className="text-sm text-center font-semibold text-white px-1.5 bg-emerald-500 rounded-full"
                                  style={{
                                    color: "white",
                                    background: `#${label.color}`
                                  }}
                                  key={index}
                                >
                                  {label.name}
                                </span>
                              ))}
                            </div>

                            {!arraysEqual(labels, defaultLabels) && (
                              <>
                                <div className="d-flex flex-row-reverse pt-5">
                                  <button
                                    type="submit"
                                    className="btn-xs h-8 bg-emerald-500 hover:bg-emerald-600 text-white"
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
                {/* End Labels Actions */}

                <hr />

                {/* Issue Action Links */}
                <section className="flex flex-col gap-y-2">
                  <div>
                    <FontAwesomeIcon className="mr-2" icon={faLock} />
                    <a
                      className="text-gray-600 font-semibold hover:text-gray-900 hover:underline hover:cursor-pointer"
                      onClick={() => setCloseIssue(true)}
                    >
                      {issueState.open ? <>Close Issue</> : <>Reopen Issue</>}
                    </a>
                  </div>

                  <div>
                    <FontAwesomeIcon className="mr-2" icon={faThumbTack} />
                    <a
                      className="text-gray-600 font-semibold hover:text-gray-900 hover:underline hover:cursor-pointer"
                      onClick={() => setPinIssue(true)}
                    >
                      {issueState.pinned ? "Unpin" : "Pin"} Issue
                    </a>
                  </div>

                  <div>
                    <FontAwesomeIcon className="mr-2" icon={faTrash} />
                    <a
                      className="text-gray-600 font-semibold hover:text-gray-900 hover:underline hover:cursor-pointer"
                      onClick={() => setDeleteIssue(true)}
                    >
                      Delete Issue
                    </a>
                  </div>
                </section>
                {/* End Issue Action Links */}
              </div>
            </div>
          </main>
        </div>
      </div>
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

      project: {
        select: {
          labels: true
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
