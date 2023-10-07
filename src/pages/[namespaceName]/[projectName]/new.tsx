import Head from 'next/head'

import { useSession } from 'next-auth/react'

import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import dynamic from 'next/dynamic'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { CreateIssueSchema } from '@/lib/zod-schemas'
import { getProjectLayout } from '@/components/layout/project/ProjectLayout'
import { getProjectServerSideProps } from '@/lib/layout/projects'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import 'react-markdown-editor-lite/lib/index.css'
import {
  CommentButton,
  CommentFooter,
  CommentMarkdownMessage,
} from '@/components/comment-composed/Comment'

const MdEditor = dynamic(() => import('react-markdown-editor-lite'), {
  ssr: false,
})
type IssueCreationType = z.infer<typeof CreateIssueSchema>

export default function CreateNewIssue({
  namespaceName,
  projectName,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data: session } = useSession()

  const form = useForm<IssueCreationType>({
    resolver: zodResolver(CreateIssueSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  })

  const onSubmit: SubmitHandler<IssueCreationType> = (data) => {
    console.log(data)
  }

  return (
    <>
      <Head>
        <title>Create new issue</title>
      </Head>

      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Form {...form}>
        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader className="space-y-1 p-2 px-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel />
                    <FormControl>
                      <CardTitle className="text-2xl">
                        <Input placeholder="Title" {...field} />
                      </CardTitle>
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardHeader>

            <Tabs defaultValue="write">
              <TabsList className="z-40 flex w-full justify-start space-x-2 rounded-none border-b bg-white p-2 px-4">
                <TabsTrigger
                  value="write"
                  className="z-10 -mb-[-5px] w-20 rounded-none rounded-t-lg border-[0.0625rem] p-3 outline-none ring-0 ring-offset-0 transition-none focus-visible:outline-none
                      data-[state=inactive]:border-transparent
                      data-[state=active]:border-b-white
                      data-[state=active]:bg-white
                      data-[state=active]:shadow-none"
                >
                  Write
                </TabsTrigger>
                <TabsTrigger
                  value="preview"
                  className="z-10 -mb-[-5px] w-20 rounded-none rounded-t-lg border-[0.0625rem] p-3 outline-none ring-0 ring-offset-0 transition-none focus-visible:outline-none
                    data-[state=inactive]:border-transparent
                    data-[state=active]:border-b-white
                    data-[state=active]:bg-white
                    data-[state=active]:shadow-none"
                >
                  Preview
                </TabsTrigger>
              </TabsList>

              <CardContent className="px-4 py-3">
                <TabsContent value="write">
                  <MdEditor
                    style={{ height: '400px' }}
                    renderHTML={(text) => <ReactMarkdown source={text} />}
                    view={{ menu: true, md: true, html: false }}
                    canView={{
                      fullScreen: false,
                      hideMenu: true,
                      html: false,
                      both: false,
                    }}
                  />
                </TabsContent>
                <TabsContent value="preview">
                  <ReactMarkdown className="prose" remarkPlugins={[remarkGfm]}>
                    # Hello
                  </ReactMarkdown>
                </TabsContent>
              </CardContent>
            </Tabs>

            <CommentFooter>
              <CommentMarkdownMessage />
              <CommentButton>Submit new Issue</CommentButton>
            </CommentFooter>
          </Card>
        </form>
      </Form>
    </>
  )
}

CreateNewIssue.getLayout = function getLayout(
  page: React.ReactElement<
    InferGetServerSidePropsType<typeof getServerSideProps>
  >
) {
  return getProjectLayout({
    page,
    namespaceName: page.props.namespaceName,
    projectName: page.props.projectName,
  })
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return getProjectServerSideProps(context)
}
