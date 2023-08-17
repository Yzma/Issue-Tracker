import Head from 'next/head'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'

import { useRouter } from 'next/navigation'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { NAMESPACE } from '@/lib/zod-schemas'
import { getProjectLayout } from '@/components/layout/project/ProjectLayout'
import { getProjectServerSideProps } from '@/lib/layout/projects'
import { trpc } from '@/lib/trpc/trpc'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/components/ui/use-toast'

const projectFormSchema = z.object({
  name: NAMESPACE,
  description: z.string().max(160),
})

type ProfileFormValues = z.infer<typeof projectFormSchema>

export default function ProjectSettings({
  namespaceName,
  projectName,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter()
  const { toast } = useToast()
  const getProjectQuery = trpc.projects.getProject.useQuery({
    owner: namespaceName,
    name: projectName,
  })

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: getProjectQuery.data?.project.name,
      description: getProjectQuery.data?.project.description,
    },
    mode: 'onChange',
  })

  const updateProjectMutation = trpc.projects.updateProject.useMutation({
    onSuccess(data) {
      // If the name has been updated, redirect the user back to the main page with the updated name
      if (data.name !== getProjectQuery.data?.project.name) {
        router.push(`/${namespaceName}/${data.name}`)
        return
      }

      toast({
        title: 'Project settings updated',
        description: 'Your changes have been saved successfully.',
      })
      form.reset({
        description: data.description,
      })
    },
    onError(error) {
      toast({
        title: 'Failed to update project settings',
        description: 'Failed to save your project changes. Please try again.',
        variant: 'destructive',
      })
    },
  })

  function onSubmit(data: ProfileFormValues) {
    return updateProjectMutation.mutate({
      name: projectName,
      owner: namespaceName,
      newName: data.name,
      description: data.description,
    })
  }

  function toggleVisibility() {}

  function deleteProject() {}

  return (
    <>
      <Head>
        <title>Settings</title>
      </Head>

      <div className="flex flex-col items-center  pb-16">
        <div className="md:w-4/5 space-y-6">
          <div className="space-y-0.5 w-full">
            <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
            <p className="text-muted-foreground">
              Manage your project settings
            </p>
          </div>

          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Form {...form}>
            {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Description</FormLabel>
                    <FormControl>
                      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={
                  form.formState.isSubmitting ||
                  updateProjectMutation.isLoading ||
                  updateProjectMutation.isError ||
                  !form.formState.isDirty
                }
              >
                Save Changes
              </Button>
            </form>
          </Form>

          <div className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight">Danger Zone</h2>
            <div className="flex flex-col space-y-6">
              <div className="flex flex-row justify-between">
                <div>
                  <p className="font-bold text-2xl">Change Visibility</p>
                  <p>
                    The project is currently{' '}
                    <span className="font-bold">
                      {getProjectQuery.data?.project.private ? (
                        <>private</>
                      ) : (
                        <>public</>
                      )}
                    </span>
                    .
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="w-36"
                      size="default"
                      variant="destructive"
                    >
                      Change Visibility
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuItem>
                      <span>Change Visibility</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex flex-row justify-between">
                <div>
                  <p className="font-bold text-2xl">Delete Project</p>
                  <p>Delete the project and all issues associated with it.</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="w-36"
                      size="default"
                      variant="destructive"
                    >
                      Delete Project
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuItem>
                      <span>Delete Project</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

ProjectSettings.getLayout = function getLayout(
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
