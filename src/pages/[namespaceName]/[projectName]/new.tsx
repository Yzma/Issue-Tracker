import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'

import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear, faCircle } from '@fortawesome/free-solid-svg-icons'

import { useSession } from 'next-auth/react'

import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import axios from 'axios'
import Labels from '@/components/labels/Labels'
import { CreateIssueSchema } from '@/lib/zod-schemas'
import prisma from '@/lib/prisma/prisma'
import IssueComment from '@/components/comment-api/IssueComment'
import ProjectBelowNavbar from '@/components/navbar/ProjectBelowNavbar'
import Header from '@/components/Header'

type LabelProps = {
  id: string
  name: string
  color: string
}

type IssueCreationType = z.infer<typeof CreateIssueSchema>

export default function IssuesCreate({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter()
  const { namespaceName, projectName } = router.query

  const [labels, setLabels] = useState<LabelProps[]>([])
  const { data: session } = useSession()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<IssueCreationType>({
    resolver: zodResolver(CreateIssueSchema),
  })

  // TODO: Move to tRPC
  const onSubmit: SubmitHandler<IssueCreationType> = (data) => {
    const labelIds = labels.map((e) => e.id)
    axios
      .post(`/api/${namespaceName}/${projectName}/issues`, {
        name: data.title,
        description: data.description,
        labels: labelIds,
      })
      .then((response) =>
        router.push(
          `/${namespaceName}/${projectName}/issues/${response.data.result.id}`
        )
      )
      .catch((error) => {
        // setError('name', { type: 'custom', message: 'custom message' }) // TODO: Set proper error message
        console.log('ERROR:', error) // TODO: remove this
      })
  }

  const onLabelClick = (label: LabelProps) => {
    if (labels.find((e) => e.id === label.id)) {
      setLabels(labels.filter((item) => item.id !== label.id))
    } else {
      setLabels([...labels, label])
    }
  }

  useEffect(() => {
    setValue(
      'labels',
      labels.map((e) => e.id)
    )
  }, [labels, setValue])

  return (
    <>
      <Head>
        <title>Create new issue</title>
      </Head>

      <div className="flex h-screen bg-slate-100 overflow-hidden">
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <Header />
          <ProjectBelowNavbar
            namespaceName={namespaceName}
            projectName={projectName}
            selected="issues"
          />
          <main>
            {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-8 px-4 sm:px-6 lg:px-8 py-8 gap-6">
                <div className="col-start-2 col-span-6">
                  {errors.title && (
                    <div className="py-3">
                      <div className="flex w-full px-4 py-2 rounded-sm text-sm border bg-rose-100 border-rose-200 text-rose-600">
                        <div>You must enter a valid issue title!</div>
                      </div>
                    </div>
                  )}

                  {errors.description && (
                    <div className="py-3">
                      <div className="flex w-full px-4 py-2 rounded-sm text-sm border bg-rose-100 border-rose-200 text-rose-600">
                        <div>You must enter a valid description!</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="col-start-2 col-span-4">
                  {/* Start Main Content */}

                  <main>
                    <div className="row g-5">
                      <section>
                        <section className="flex flex-row mb-4">
                          <div className="sm:w-1/3 grow">
                            <label
                              className="block text-sm font-medium mb-1"
                              htmlFor="name"
                            >
                              Title <span className="text-rose-500">*</span>
                              <input
                                className="form-input w-full"
                                type="text"
                                // eslint-disable-next-line react/jsx-props-no-spreading
                                {...register('title')}
                              />
                            </label>
                          </div>
                        </section>

                        <hr />

                        <div className="flex flex-row">
                          <section className="mt-4 grow">
                            <label
                              className="block text-sm font-medium mb-1"
                              htmlFor="name"
                            >
                              Description{' '}
                              <span className="text-rose-500">*</span>
                            </label>
                            <IssueComment
                              text=""
                              onChange={(text: string) =>
                                // setFieldValue("description", text)
                                setValue('description', text)
                              }
                              onSubmit={() => {}}
                              editing
                              showButtons={false}
                            />
                          </section>
                        </div>

                        <hr />

                        <div className="flex flex-col py-5 border-t border-slate-200">
                          <div className="flex self-start">
                            <button
                              className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                              type="submit"
                              disabled={isSubmitting}
                            >
                              Submit Issue
                            </button>
                          </div>
                        </div>
                      </section>
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
                    </div>
                    <Link
                      className="text-blue-600 hover:text-gray-900 hover:underline hover:cursor-pointer"
                      href={session ? `/${session.user.username}/` : ''}
                    >
                      {session && session.user.username}
                    </Link>
                  </div>
                  {/* End Asignees Action */}

                  <hr />

                  {/* Labels Actions */}
                  <div className="">
                    <div className="flex justify-between align-self-center">
                      <span className="font-bold">Labels</span>
                      {data.length !== 0 && (
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
                              {data.map((label) => (
                                <DropdownMenu.Item
                                  key={label.id}
                                  className="DropdownMenuItem"
                                  onClick={() => onLabelClick(label)}
                                >
                                  <span>
                                    <FontAwesomeIcon
                                      className="mr-4 align-self-center align-middle"
                                      style={{
                                        color: `#${label.color}`,
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
                    <div className="flex gap-x-1 pt-2">
                      <Labels labels={labels} />
                    </div>
                  </div>
                  {/* End Labels Actions */}
                </div>
              </div>
            </form>
          </main>
        </div>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<{
  data: LabelProps[]
}> = async (context) => {
  const { namespaceName, projectName } = context.query
  const labels = (await prisma.label.findMany({
    where: {
      project: {
        // @ts-ignore
        name: projectName,
        namespace: {
          // @ts-ignore
          name: namespaceName,
        },
      },
    },
    select: {
      id: true,
      name: true,
      color: true,
    },
  })) as LabelProps[]

  return {
    props: {
      data: labels,
    },
  }
}
