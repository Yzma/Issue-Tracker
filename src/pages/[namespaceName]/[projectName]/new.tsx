import Head from 'next/head'

import { useSession } from 'next-auth/react'

import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMarkdown } from '@fortawesome/free-brands-svg-icons'
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
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CustomLink } from '@/components/ui/common'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'

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
          {/* <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Des</FormLabel>
                      <FormControl>
                        <div className="flex items-center justify-center [&>div]:w-full">
                          <Input placeholder="Title" {...field} />
                          <FormMessage />

                          <CardContent className="grid gap-4">
                            <div className="grid grid-cols-2 gap-6">
                              <Button variant="outline">Github</Button>
                              <Button variant="outline">Google</Button>
                            </div>
                            <div className="relative">
                              <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                              </div>
                              <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background text-muted-foreground px-2">
                                  Or continue with
                                </span>
                              </div>
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="password">Password</Label>
                              <Input id="password" type="password" />
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button className="w-full">Create account</Button>
                          </CardFooter>
                        </div>
                        {/* <Card className="h-72">
                    <CardHeader>
              
                      <Input placeholder="Title" {...field} />
                    </CardHeader>

                    <CardDescription>
                      <div className="flex items-center space-x-4 rounded-md border p-4">
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            Push Notifications
                          </p>
                          <p className="text-muted-foreground flex text-sm">
                            sassssssssssssssssssssssssssssssssssssssssssssssssssss
                          </p>
                        </div>
                      </div>
                    </CardDescription> */}

          {/* <Tabs defaultValue="account" className="px-6">
                      <CardDescription>
                        <TabsList className="border">
                          <TabsTrigger value="account">Account</TabsTrigger>
                          <TabsTrigger value="password">Password</TabsTrigger>
                        </TabsList>
                        <TabsContent value="account">
                          Make changes to your account here.
                        </TabsContent>
                        <TabsContent value="password">
                          <div>
                            sassssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss
                          </div>
                          Change your password
                          here.sassssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss
                        </TabsContent>
                      </CardDescription>
                    </Tabs> */}
          {/* <CardFooter className="flex justify-between">
                      <CustomLink href="/" className="text-sm">
                        Styling with Markdown is supported
                      </CustomLink>
                      <Button>Submit</Button>
                    </CardFooter>
                  </Card> 
                      
                       
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

          <div className="flex items-center justify-center [&>div]:w-full">
            <Card>
              <CardHeader className="space-y-1">
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

              {/* <div className="w-full border-b"> */}

              <Tabs defaultValue="account">
                {/* className="w-[400px]" */}
                <div className="">
                  <TabsList className="z-40  flex w-full justify-start space-x-2 rounded-none border-b bg-white pl-6">
                    {/* 'focus-visible:ring-slate-950 data-[state=active]:text-slate-950 dark:ring-offset-slate-950 dark:data-[state=active]:bg-slate-950 inline-flex 
                    items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none 
                    focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white 
                    data-[state=active]:shadow-sm dark:focus-visible:ring-slate-300 dark:data-[state=active]:text-slate-50', */}
                    <TabsTrigger
                      value="account"
                      // className="-mt-[3px] rounded-t-lg rounded-b-none border-x border-t px-4 py-3 focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=inactive]:border-none data-[state=active]:shadow-none"
                      // className="data-[state=active]:text-slate-950 dark:ring-offset-slate-950 dark:data-[state=active]:bg-slate-950  inline-flex items-baseline justify-center whitespace-nowrap rounded-sm rounded-t-lg
                      // rounded-b-none border-x border-t px-4 py-3 text-sm
                      // font-medium outline-none ring-offset-white transition-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0
                      // disabled:pointer-events-none disabled:opacity-50  data-[state=inactive]:border-transparent data-[state=inactive]:bg-white data-[state=active]:bg-white
                      //  data-[state=active]:shadow-none dark:focus-visible:ring-slate-300 dark:data-[state=active]:text-slate-50"
                      // className=" rounded-none border-x border-t bg-white px-4 py-3 outline-none transition-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=inactive]:border-x-transparent data-[state=inactive]:border-t-transparent data-[state=active]:shadow-none"
                      className="z-10 -mb-[-5px] rounded-none rounded-t-lg border-[0.0625rem] p-3 outline-none
                      ring-0
                      ring-offset-0
                      transition-none
                      focus-visible:outline-none
                      data-[state=inactive]:border-transparent
                      data-[state=active]:bg-white
                      data-[state=active]:shadow-none"
                    >
                      Account
                    </TabsTrigger>
                    <TabsTrigger
                      value="password"
                      // className="data-[state=active]:text-slate-950 dark:ring-offset-slate-950 dark:data-[state=active]:bg-slate-950 -mt-[5px] inline-flex items-baseline justify-center whitespace-nowrap rounded-sm rounded-t-lg
                      // rounded-b-none border-x border-t px-4 py-3
                      // text-sm font-medium ring-offset-white transition-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:pointer-events-none
                      // disabled:opacity-50 data-[state=inactive]:border-none data-[state=inactive]:border-white data-[state=active]:bg-white data-[state=active]:shadow-none
                      //  dark:focus-visible:ring-slate-300 dark:data-[state=active]:text-slate-50"
                      // className="border-none data-[state=active]:shadow-none"
                      className="z-10 -mb-[-5px] rounded-none rounded-t-lg border-[0.0625rem] p-3 outline-none
                      ring-0
                      ring-offset-0
                      transition-none
                      focus-visible:outline-none
                      data-[state=inactive]:border-transparent
                      data-[state=active]:bg-white
                      data-[state=active]:shadow-none"
                    >
                      Password
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="account">
                  Make changes to your account here.
                </TabsContent>
                <TabsContent value="password">
                  Change your password here.
                </TabsContent>
              </Tabs>

              {/* </div> */}
              {/* <CardContent>asd</CardContent> <div ref={ref} className={cn('p-6 pt-0', className)} {...props} /> */}
              <CardFooter className="flex justify-between">
                <CustomLink
                  href="/"
                  className="flex items-center gap-x-1 text-sm"
                >
                  <FontAwesomeIcon icon={faMarkdown} />
                  Styling with Markdown is supported
                </CustomLink>
                <Button>Submit</Button>
              </CardFooter>
            </Card>
          </div>
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

// export const getServerSideProps: GetServerSideProps<{
//   data: LabelProps[]
// }> = async (context) => {
//   const { namespaceName, projectName } = context.query
//   const labels = (await prisma.label.findMany({
//     where: {
//       project: {
//         // @ts-ignore
//         name: projectName,
//         namespace: {
//           // @ts-ignore
//           name: namespaceName,
//         },
//       },
//     },
//     select: {
//       id: true,
//       name: true,
//       color: true,
//     },
//   })) as LabelProps[]

//   return {
//     props: {
//       data: labels,
//     },
//   }
// }
