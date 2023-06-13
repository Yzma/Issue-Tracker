import {
  Dispatch,
  SetStateAction,
  useState,
  createContext,
  useContext,
} from 'react'

import { SubmitHandler, useForm } from 'react-hook-form'

import { Session } from 'next-auth'
import { useSession } from 'next-auth/react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import UserSocialLinks from '@/components/user-profile/UserSocialLinks'
import UsersOrganizationsSection from '@/components/user-profile/UsersOrganizationsSection'

import { ProfileInformation } from './types'
import { UserProfileSchema } from '@/lib/zod-schemas'
import { trpc } from '@/lib/trpc'

interface ProfileContextInterface {
  profile: ProfileInformation
  setProfile: Dispatch<SetStateAction<ProfileInformation>>
  setEditing: Dispatch<SetStateAction<boolean>>
  session: Session
}

type UserProfileUpdateType = z.infer<typeof UserProfileSchema>

const ProfileContext = createContext<ProfileContextInterface>({
  profile: null,
  setProfile: () => {},
  setEditing: () => {},
  session: null,
})

function ProfileContainerViewer() {
  const { profile, setEditing, session } = useContext(ProfileContext)
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

            {session?.user.namespace.name === profile.name && (
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

function ProfileContainerEditor() {
  const { profile, setProfile, setEditing } = useContext(ProfileContext)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UserProfileUpdateType>({
    resolver: zodResolver(UserProfileSchema),
    defaultValues: {
      socialLinks: profile.socialLinks,
      bio: profile.bio,
    },
  })

  const updateProjectMutation = trpc.users.updateProfile.useMutation({
    onSuccess: (data) => {
      setProfile((prevState) => ({
        ...prevState,
        bio: data.bio || undefined,
        socialLinks: Array.of(
          data.socialLink1,
          data.socialLink2,
          data.socialLink3,
          data.socialLink4
        ) as string[],
      }))
      setEditing(false)
    },
    onError: (error) => {
      setError('root', { type: 'custom', message: error.message })
    },
  })

  console.log('Form erros: ', errors)

  const onSubmit: SubmitHandler<UserProfileUpdateType> = (formData) => {
    console.log('formData', formData)
    // return updateProjectMutation.mutate(formData)
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
                    className="form-textarea w-full min-h-16"
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
                    {/* <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      type="text"
                      placeholder="Link to social profile"
                      // eslint-disable-next-line react/jsx-props-no-spreading
                      {...register(`socialLinks.0`, {
                        setValueAs(value: string) {
                          if (!value) return undefined
                          return value
                        },
                      })}
                    /> */}
                    {profile.socialLinks &&
                      profile.socialLinks.map((link, index) => {
                        return (
                          // eslint-disable-next-line react/no-array-index-key
                          <div key={index}>
                            <input
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              type="text"
                              placeholder="Link to social profile"
                              // eslint-disable-next-line react/jsx-props-no-spreading
                              {...register(`socialLinks.${index}`, {
                                setValueAs(value: string) {
                                  if (!value) return undefined
                                  return value
                                },
                              })}
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
              className="btn-xs h-8 w-14 bg-emerald-500 hover:bg-emerald-600 text-white"
              type="submit"
              disabled={
                isSubmitting ||
                updateProjectMutation.isLoading ||
                updateProjectMutation.isError
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

export default function ProfileContainer({
  data,
}: {
  data: ProfileInformation
}) {
  const [editing, setEditing] = useState<boolean>(false)
  const [profile, setProfile] = useState<ProfileInformation>({
    ...data,
  })
  const { data: session } = useSession()

  return (
    <ProfileContext.Provider
      value={{ profile, setProfile, setEditing, session }}
    >
      <div className="flex flex-col gap-y-3">
        <div className="flex items-center justify-center">
          <div className="w-72 h-72 mb-4 bg-gray-200 text-gray-600 rounded-full" />
        </div>
        {editing ? <ProfileContainerEditor /> : <ProfileContainerViewer />}
        <UserSocialLinks links={profile.socialLinks} />
        <hr className="border-gray-300 my-4 mx-auto w-full" />
        <UsersOrganizationsSection organizations={data.organizations} />
      </div>
    </ProfileContext.Provider>
  )
}
