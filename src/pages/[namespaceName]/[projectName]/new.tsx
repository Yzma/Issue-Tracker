/* eslint-disable react/jsx-props-no-spreading */
import Head from 'next/head'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useRouter } from 'next/router'
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
import 'react-markdown-editor-lite/lib/index.css'
import {
  Comment,
  CommentContent,
  CommentFooter,
  CommentHeader,
  CommentMarkdownEditor,
  CommentMarkdownMessage,
  CommentMarkdownRender,
  CommentTabTrigger,
  CommentTabs,
  CommentTabsContent,
  CommentTabsList,
} from '@/components/comment-composed/Comment'
import { Button } from '@/components/ui/button'
import { trpc } from '@/lib/trpc/trpc'

type IssueCreationType = z.infer<typeof CreateIssueSchema>
export default function CreateNewIssue({
  namespaceName,
  projectName,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter()
  const createIssueMutation = trpc.issues.createIssue.useMutation()
  const form = useForm<IssueCreationType>({
    resolver: zodResolver(CreateIssueSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  })

  const onSubmit: SubmitHandler<IssueCreationType> = (data) => {
    createIssueMutation
      .mutateAsync({ owner: namespaceName, name: projectName, ...data })
      .then(async (response) => {
        await router.push(
          `/${response.project.namespace.name}/${response.project.name}/issues/${response.id}`
        )
      })
      .catch(() => {
        form.setError('root', {
          type: 'custom',
          message:
            'Failed to create issue. Please contact support if the error persists.',
        })
      })
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
          <Comment
            onValueChange={(data) => {
              form.setValue('description', data)
            }}
          >
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

              <CommentContent>
                <CommentTabsContent value="write">
                  <CommentMarkdownEditor />
                </CommentTabsContent>
                <CommentTabsContent value="preview">
                  <CommentMarkdownRender />
                </CommentTabsContent>
              </CommentContent>
            </CommentTabs>

            <CommentFooter>
              <CommentMarkdownMessage />
              <Button type="submit">Submit new Issue</Button>
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
