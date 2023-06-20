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

type UserProfileUpdateType = z.infer<typeof UserProfileSchema>

// export const UserProfileSchema = z.object({
//   bio: SHORT_DESCRIPTION,
//   socialLinks: z.array(z.string().url()).max(4),
// })

// }

// type Testing2 = UserProfileSchema & {
//   socialLinks: z.arrz
// }

// data: [{ name: 'test' }, { name: 'test1' }, { name: 'test2' }],
// const Testing2 = z.array(
//   z.object({
//     link: z.string().url(),
//   })
// )

// type TT = z.infer<typeof Testing2>

// const test: TT = [
//   {
//     link: '',
//   },
// ]

function TestComp() {
  const { register, control, handleSubmit, reset, trigger, setError } = useForm(
    {
      defaultValues: {
        socialLinks: [{ link: '' }],
      },
    }
  )
  const { fields, append, remove } = useFieldArray({
    name: 'socialLinks',
    control,
  })

  return <div />
}

const hah = UserProfileSchema.extend({
  socialLinks: z.array(
    z.object({
      link: z.string().url().optional().or(z.string()),
    })
  ),
})

type TT = z.infer<typeof hah>

const test: TT = {
  bio: '',
  socialLinks: [
    {
      link: '',
    },
  ],
}

// export const Test = z.object({
//   socialLinks: z.array(z.string().url()).max(4),
// })

// type FormValues = {
//   data: { name: string }[]
// }

// type TestType = z.infer<typeof Test>

function ProfileContainerEditor({ profile, setEditing }: ProfileContextType) {
  // console.log('1st pr:', profile)

  const {
    control,
    register,
    handleSubmit,
    setError,
    getValues,
    getFieldState,
    formState: { errors, isSubmitting, isDirty, dirtyFields, touchedFields },
  } = useForm<TT>({
    resolver: zodResolver(hah),
    defaultValues: {
      bio: profile.bio,
      // socialLinks: [{ link: '' }],
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

  // const { control, handleSubmit, register } = useForm<FormValues>({
  //   defaultValues: {
  //     data: [{ name: 'test' }, { name: 'test1' }, { name: 'test2' }],
  //   },
  //   mode: 'onSubmit',
  //   shouldUnregister: false,
  // })
  // const { fields } = useFieldArray({
  //   control,
  //   name: 'data',
  // })

  // const remainingSocialLinks = 4 - data.socialLinks.length
  //   return {
  //     ...data,
  //     socialLinks: data.socialLinks.concat(
  //       Array(remainingSocialLinks).fill(undefined, 0, remainingSocialLinks)
  //     ),
  //   }
  // const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
  //   {
  //     control, // control props comes from useForm (optional: if you are using FormContext)
  //     name: 'socialLinks', // unique name for your Field Array
  //   }
  // )

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

  // console.log('Form errors: ', errors)
  // console.log('getValues', getValues('socialLinks'))
  // console.log('getFieldState', getFieldState('socialLinks'))
  // console.log('isDirty', isDirty)
  // console.log('dirtyFields', dirtyFields)

  const onSubmit: SubmitHandler<TT> = (formData) => {
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
                        // eslint-disable-next-line react/no-array-index-key
                        <div key={link.id}>
                          {/* <Controller
                              render={({ field }) => (
                                <input
                                  // eslint-disable-next-line react/jsx-props-no-spreading
                                  {...field}
                                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                  type="text"
                                  placeholder="Link to social profile"
                                />
                              )}
                              name={`socialLinks.${index}`}
                              control={control}
                            /> */}
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
