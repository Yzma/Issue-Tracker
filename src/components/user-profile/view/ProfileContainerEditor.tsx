import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form'
import { useUserProfile } from '@/hooks/useUserProfile'
import { UserProfileSchema } from '@/lib/zod-schemas'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { trpc } from '@/lib/trpc/trpc'
import { Input } from '@/components/ui/input'

const ModifiedSocialLinksSchema = UserProfileSchema.extend({
  socialLinks: z.array(
    z.object({
      link: z.string().url().optional().or(z.string()),
    })
  ),
})

type ModifiedSocialLinksSchemaType = z.infer<typeof ModifiedSocialLinksSchema>

export default function ProfileContainerEditor1() {
  const { setEditing, setProfileData, profile } = useUserProfile()
  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ModifiedSocialLinksSchemaType>({
    resolver: zodResolver(ModifiedSocialLinksSchema),
    defaultValues: {
      bio: profile.bio,
      socialLinks: profile.socialLinks.map((e) => {
        return {
          link: e,
        }
      }),
    },
  })
  const { fields } = useFieldArray({
    control,
    name: 'socialLinks',
  })

  const utils = trpc.useContext()
  const updateProjectMutation = trpc.users.updateProfile.useMutation({
    onSuccess: (data) => {
      // utils.namespace.getNamespace.setData(
      //   {
      //     // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      //     name: data.username!,
      //   },
      //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //   // @ts-ignore
      //   (oldData) => {
      //     return {
      //       ...oldData,
      //       // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      //       user: {
      //         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //         // @ts-ignore
      //         ...oldData.user,
      //         bio: data.bio,
      //         socialLinks: data.socialLinks,
      //       },
      //     }
      //   }
      // )
      setProfileData((prev) => {
        return {
          ...prev,
          bio: data.bio,
          socialLinks: data.socialLinks,
        }
      })
      setEditing(false)
    },
    onError: (error) => {
      setError('root', { type: 'custom', message: error.message })
    },
  })

  const onSubmit: SubmitHandler<ModifiedSocialLinksSchemaType> = (formData) => {
    const mappedSubmitData = {
      ...formData,
      socialLinks: formData.socialLinks.map((e) => {
        if (e.link) {
          return e.link.length === 0 ? undefined : e.link
        }
        return undefined
      }),
    }
    return updateProjectMutation.mutate(mappedSubmitData)
  }

  return (
    <div className="relative">
      <div className="flex flex-col">
        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-y-0 text-left">
            {errors.bio?.message && (
              <div className="py-3">
                <div className="flex w-full px-4 py-2 rounded-sm text-sm border bg-rose-100 border-rose-200 text-rose-600">
                  <div>You must enter a valid bio!</div>
                </div>
              </div>
            )}
            <div className="flex flex-col gap-y-3 pb-3">
              <div>
                <Label htmlFor="bio">
                  Bio
                  <Textarea
                    className="w-full max-h-44"
                    placeholder="Add a bio"
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...register('bio')}
                  />
                </Label>
              </div>

              <div>
                <Label htmlFor="socialLinks">
                  Social Accounts
                  <div className="flex flex-col gap-y-2">
                    {errors.socialLinks && (
                      <div className="py-3">
                        <div className="flex w-full px-4 py-2 rounded-sm text-sm border bg-rose-100 border-rose-200 text-rose-600">
                          <div>All social links must be valid URLs!</div>
                        </div>
                      </div>
                    )}
                    {fields.map((link, index) => {
                      return (
                        <div key={link.id}>
                          <Input
                            type="text"
                            placeholder="Link to social profile"
                            // eslint-disable-next-line react/jsx-props-no-spreading
                            {...register(`socialLinks.${index}.link`)}
                          />
                        </div>
                      )
                    })}
                  </div>
                </Label>
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-x-1">
            <Button
              size="sm"
              className="disabled:cursor-not-allowed"
              type="submit"
              disabled={
                isSubmitting ||
                updateProjectMutation.isLoading ||
                updateProjectMutation.isError ||
                !isDirty
              }
            >
              Save
            </Button>
            <Button size="sm" type="button" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
