import { useState } from 'react'
import Head from 'next/head'

import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'

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
import { NAMESPACE } from '@/lib/zod-schemas'
import { getOrganizationServerSideProps } from '@/lib/layout/organizations'
import { getOrganizationLayout } from '@/components/layout/organization/OrganizationLayout'

type ResponseError = {
  error?: string | null
  success?: string | null
}

const profileFormSchema = z.object({
  name: NAMESPACE,
  email: z
    .string({
      required_error: 'Please select an email to display.',
    })
    .email(),
  bio: z.string().max(160).min(4),
  urls: z
    .array(
      z.object({
        value: z.string().url({ message: 'Please enter a valid URL.' }),
      })
    )
    .optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

// This can come from your database or API.
const defaultValues: Partial<ProfileFormValues> = {
  bio: 'I own a computer.',
  urls: [
    { value: 'https://shadcn.com' },
    { value: 'http://twitter.com/shadcn' },
  ],
}

export default function OrganizationSettings() {
  const [response, setResponse] = useState<ResponseError>({})

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: 'onChange',
  })

  const { fields, append } = useFieldArray({
    name: 'urls',
    control: form.control,
  })

  function onSubmit(data: ProfileFormValues) {}

  return (
    <>
      <Head>
        <title>Settings</title>
      </Head>

      <div className="space-y-6 p-5 pb-16">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your organization settings
          </p>
        </div>

        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Form {...form}>
          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Name</FormLabel>
                  <FormControl>
                    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Update Name</Button>
          </form>
        </Form>

        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Danger Zone</h2>
          <p className="text-muted-foreground">Manage your account settings</p>
        </div>

        <div className="flex flex-col space-y-6">
          <Button variant="destructive">Change Visibility</Button>
          <Button variant="destructive">Delete Organization</Button>
        </div>
      </div>
    </>
  )
}

OrganizationSettings.getLayout = function getLayout(
  page: React.ReactElement<
    InferGetServerSidePropsType<typeof getServerSideProps>
  >
) {
  return getOrganizationLayout({
    page,
    organizationName: page.props.organizationName,
    variant: 'small',
  })
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return getOrganizationServerSideProps(context, true)
}
