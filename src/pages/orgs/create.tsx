import Head from 'next/head'
import { useRouter } from 'next/router'

import { SubmitHandler, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { trpc } from '@/lib/trpc/trpc'
import { NamespaceSchema } from '@/lib/zod-schemas'
import DefaultLayout from '@/components/ui/DefaultLayout'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormRequiredField,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

type OrganizationCreationType = z.infer<typeof NamespaceSchema>

export default function OrganizationCreate() {
  const router = useRouter()
  const createOrganizationMutation =
    trpc.organizations.createOrganization.useMutation()

  const form = useForm<OrganizationCreationType>({
    resolver: zodResolver(NamespaceSchema),
    defaultValues: {
      name: '',
    },
  })

  const organizationName = useWatch({
    control: form.control,
    name: 'name',
  })

  const onSubmit: SubmitHandler<OrganizationCreationType> = (data) => {
    createOrganizationMutation
      .mutateAsync(data)
      .then((response) => router.push(`/${response.name}`))
      .catch(() => {
        form.setError('name', {
          type: 'custom',
          message:
            'Failed to create project. Please contact support if the error persists.',
        })
      })
  }
  return (
    <>
      <Head>
        <title>Create a new Organization</title>
      </Head>
      <DefaultLayout>
        <main className="mt-6 flex flex-col items-center justify-center pt-6">
          <div className="mb-6 text-center">
            <p>Tell us about your organization</p>
            <h1 className="mb-2 text-3xl font-semibold leading-snug text-slate-800">
              Set up your organization
            </h1>
          </div>

          <div className="mt-4 w-2/5 space-y-4">
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Form {...form}>
              {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>
                          Organization Name <FormRequiredField />
                        </FormLabel>
                        <FormControl>
                          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                          <Input {...field} className="py-0" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="pt-2 text-sm">
                  <p>This will be the name of your account on Issue Tracker.</p>
                  <p>
                    Your URL will be: https://issue-tracker.com/
                    {organizationName}
                  </p>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    disabled={
                      form.formState.isSubmitting ||
                      createOrganizationMutation.isLoading ||
                      createOrganizationMutation.isSuccess
                    }
                  >
                    Create Organization
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </main>
      </DefaultLayout>
    </>
  )
}
