import React, { useState, useMemo, Dispatch, SetStateAction } from 'react'

import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form'

import { useSession } from 'next-auth/react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { MemoizedUsersOrganizationsSection } from '@/components/user-profile/UsersOrganizationsSection'

import { UserProfileSchema } from '@/lib/zod-schemas'
import { trpc } from '@/lib/trpc/trpc'
import { UserResponseType } from './types'
import { MemoizedUserSocialLinks } from './UserSocialLinks'

const ModifiedSocialLinksSchema = UserProfileSchema.extend({
  socialLinks: z.array(
    z.object({
      link: z.string().url().optional().or(z.string()),
    })
  ),
})

type ModifiedSocialLinksSchemaType = z.infer<typeof ModifiedSocialLinksSchema>

type ProfileContextType = {
  profile: UserResponseType
  setEditing: Dispatch<SetStateAction<boolean>>
}

function ProfileContainerViewer({ profile, setEditing }: ProfileContextType) {
  const { data: session } = useSession()
  return (
    <div className="relative">
      <div className="flex flex-col">
        <div className="flex flex-col gap-y-0 text-left">
          <div>
            <p className="text-xl font-bold">{profile.username}</p>
          </div>

          <div className="flex flex-col gap-y-2">
            <p className="text-gray-500 py-2">
              {profile.bio ||
                'This is a random bio, nothing of value here. Move on.'}
            </p>

            {session?.user.namespace.name === profile.username && (
              <button
                type="button"
                className="btn w-full"
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ProfileContainerEditor({ profile, setEditing }: ProfileContextType) {
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
      utils.namespaceRouter.getNamespace.setData(
        {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          name: data.username!,
        },
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        (oldData) => {
          return {
            ...oldData,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            user: {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              ...oldData.user,
              bio: data.bio,
              socialLinks: data.socialLinks,
            },
          }
        }
      )
      setEditing(false)
    },
    onError: (error) => {
      setError('root', { type: 'custom', message: error.message })
    },
  })

  const onSubmit: SubmitHandler<ModifiedSocialLinksSchemaType> = (formData) => {
    console.log('formData', formData)
    const t = {
      ...formData,
      socialLinks: formData.socialLinks.map((e) => {
        if (e.link) {
          return e.link.length === 0 ? undefined : e.link
        }
        return undefined
      }),
    }
    console.log(t)
    return updateProjectMutation.mutate(t)
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
                <label className="block text-sm font-medium mb-1" htmlFor="bio">
                  Bio
                  <textarea
                    className="form-textarea w-full min-h-16 max-h-44"
                    placeholder="Add a bio"
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...register('bio')}
                  />
                </label>
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="socialLinks"
                >
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
                          <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="text"
                            placeholder="Link to social profile"
                            // eslint-disable-next-line react/jsx-props-no-spreading
                            {...register(`socialLinks.${index}.link`)}
                          />
                        </div>
                      )
                    })}
                  </div>
                </label>
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-x-1">
            <button
              className="btn-xs h-8 w-14 bg-emerald-500 hover:bg-emerald-600 text-white disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
              type="submit"
              disabled={
                isSubmitting ||
                updateProjectMutation.isLoading ||
                updateProjectMutation.isError ||
                !isDirty
              }
            >
              Save
            </button>
            <button
              className="btn-xs h-8 w-14 bg-gray-500 hover:bg-gray-600 text-white"
              type="button"
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function ProfileContainer({ data }: { data: UserResponseType }) {
  const [editing, setEditing] = useState<boolean>(false)
  const profile: UserResponseType = useMemo(() => {
    const remainingSocialLinks = 4 - data.socialLinks.length
    return {
      ...data,
      socialLinks: data.socialLinks.concat(
        Array(remainingSocialLinks).fill('', 0, remainingSocialLinks)
      ),
    }
  }, [data])

  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex items-center justify-center">
        {/* <Avatar.Root className="bg-blackA3 inline-flex  select-none items-center justify-center overflow-hidden rounded-full align-middle">
            <Avatar.Fallback className="text-violet11 leading-1 flex h-72x w-72px items-center justify-center bg-white text-[15px] font-medium">
              PD
            </Avatar.Fallback>
          </Avatar.Root> */}
        <div className="w-72 h-72 mb-4 bg-gray-200 text-gray-600 rounded-full" />
      </div>
      {editing ? (
        <ProfileContainerEditor profile={profile} setEditing={setEditing} />
      ) : (
        <ProfileContainerViewer profile={profile} setEditing={setEditing} />
      )}
      <MemoizedUserSocialLinks links={profile.socialLinks} />
      <hr className="border-gray-300 my-4 mx-auto w-full" />
      <MemoizedUsersOrganizationsSection organizations={data.organizations} />
    </div>
  )
}

export const MemoizedProfileContainer = React.memo(ProfileContainer)
