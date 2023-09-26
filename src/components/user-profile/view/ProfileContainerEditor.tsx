/* eslint-disable react/jsx-props-no-spreading */
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form'
import React, { useMemo } from 'react'
import { useUserProfile } from '@/hooks/useUserProfile'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { trpc } from '@/lib/trpc/trpc'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const profileFormSchema = z.object({
  bio: z.string().max(150, {
    message: 'Your bio must be 150 characters or less.',
  }),
  socialLinks: z.array(
    z
      .object({
        value: z
          .string()
          .url({ message: 'You must enter a valid URL.' })
          .or(z.string().length(0)),
      })
      .optional()
  ),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export default function ProfileContainerEditor() {
  const { setEditing, setProfileData, profile } = useUserProfile()
  const mappedSocialLinks = useMemo(() => {
    const remainingSocialLinksLength = 4 - (profile.socialLinks.length || 0)
    return profile.socialLinks
      .map((link) => {
        return {
          value: link,
        }
      })
      .concat(
        Array(remainingSocialLinksLength).fill(
          {
            value: '',
          },
          0,
          remainingSocialLinksLength
        )
      )
  }, [profile])
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: 'onSubmit',
    defaultValues: {
      bio: profile.bio,
      socialLinks: mappedSocialLinks,
    },
  })

  const { fields } = useFieldArray({
    name: 'socialLinks',
    control: form.control,
  })

  const updateProfileMutation = trpc.users.updateProfile.useMutation({
    onSuccess: (data) => {
      setProfileData((prev) => {
        return {
          ...prev,
          bio: data.bio ?? undefined,
          socialLinks: data.socialLinks,
        }
      })
      setEditing(false)
    },

    onError: () => {
      form.setError('root', {
        type: 'custom',
        message: 'Error saving user settings. Please try again.',
      })
    },
  })

  const onSubmit: SubmitHandler<ProfileFormValues> = (formData) => {
    const mappedSubmitData = {
      ...formData,
      socialLinks: formData.socialLinks.map((e) => {
        return e?.value ? e.value : ''
      }),
    }
    return updateProfileMutation.mutate(mappedSubmitData)
  }

  return (
    <div className="relative">
      <div className="flex flex-col">
        <Form {...form}>
          <div className="flex flex-col gap-y-0 text-left">
            <form
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-y-4"
            >
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-y-3">
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        className="max-h-44 w-full"
                        placeholder="Add a bio"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                {fields.map((fieldsItem, index) => (
                  <FormField
                    control={form.control}
                    key={fieldsItem.id}
                    name={`socialLinks.${index}.value`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={cn(index !== 0 && 'sr-only')}>
                          Social Accounts
                        </FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <div className="flex flex-row gap-x-1">
                <Button
                  size="sm"
                  className="disabled:cursor-not-allowed"
                  type="submit"
                  disabled={
                    form.formState.isSubmitting ||
                    updateProfileMutation.isLoading ||
                    updateProfileMutation.isError ||
                    !form.formState.isDirty
                  }
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  type="button"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </Form>
      </div>
    </div>
  )
}

export const MemoizedProfileContainerEditor = React.memo(ProfileContainerEditor)
