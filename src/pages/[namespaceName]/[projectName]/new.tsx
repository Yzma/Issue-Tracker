/* eslint-disable react/jsx-props-no-spreading */
import Head from 'next/head'
import { useSession } from 'next-auth/react'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import dynamic from 'next/dynamic'
import ReactMarkdown from 'react-markdown'
import { CreateIssueSchema } from '@/lib/zod-schemas'
import { getProjectLayout } from '@/components/layout/project/ProjectLayout'
import { getProjectServerSideProps } from '@/lib/layout/projects'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { CardContent } from '@/components/ui/card'
import { TabsContent } from '@/components/ui/tabs'
import 'react-markdown-editor-lite/lib/index.css'
import {
  Comment,
  CommentButton,
  CommentFooter,
  CommentHeader,
  CommentMarkdownMessage,
  CommentMarkdownRender,
  CommentTabTrigger,
  CommentTabs,
  CommentTabsList,
} from '@/components/comment-composed/Comment'

const MdEditor = dynamic(() => import('react-markdown-editor-lite'), {
  ssr: false,
})
type IssueCreationType = z.infer<typeof CreateIssueSchema>

// TODO: Remove @typescript-eslint/no-unused-vars

export default function CreateNewIssue({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  namespaceName,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  projectName,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Comment value="# tESTING">
            <CommentHeader>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel />
                    <FormControl>
                      <Input placeholder="Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CommentHeader>

            <CommentTabs defaultValue="write">
              <CommentTabsList>
                <CommentTabTrigger value="write">Write</CommentTabTrigger>
                <CommentTabTrigger value="preview">Preview</CommentTabTrigger>
              </CommentTabsList>

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
                  <CommentMarkdownRender>## Hello</CommentMarkdownRender>
                </TabsContent>
              </CardContent>
            </CommentTabs>

            <CommentFooter>
              <CommentMarkdownMessage />
              <CommentButton>Submit new Issue</CommentButton>
            </CommentFooter>
          </Comment>
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
