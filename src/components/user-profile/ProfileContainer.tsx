import React, { Dispatch, SetStateAction } from 'react'

import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form'

import { useSession } from 'next-auth/react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { MemoizedUsersOrganizationsSection } from '@/components/user-profile/UsersOrganizationsSection'

import { UserProfileSchema } from '@/lib/zod-schemas'
import { RouterOutputs, trpc } from '@/lib/trpc/trpc'
import { MemoizedUserSocialLinks } from './UserSocialLinks'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { useUserProfile } from '@/hooks/useUserProfile'
import ProfileContainerEditor1 from './view/ProfileContainerEditor'
import ProfileContainerViewer1 from './view/ProfileContainerViewer'

const ModifiedSocialLinksSchema = UserProfileSchema.extend({
  socialLinks: z.array(
    z.object({
      link: z.string().url().optional().or(z.string()),
    })
  ),
})

type ModifiedSocialLinksSchemaType = z.infer<typeof ModifiedSocialLinksSchema>

type ProfileContextType = {
  profile: ActualType
  setEditing: Dispatch<SetStateAction<boolean>>
}

function ProfileContainerViewer({ profile, setEditing }: ProfileContextType) {
  const { data: session } = useSession()
  return (
    <div className="relative">
      <div className="flex flex-col">
        <div className="flex flex-col gap-y-0 text-left">
          <div>
            <p className="text-2xl font-bold">{profile.username}</p>
          </div>

          <div className="flex flex-col gap-y-2">
            <p className="text-gray-500 py-2">
              {profile.bio ||
                'This is a random bio, nothing of value here. Move on.'}
            </p>

            {session?.user.namespace.name === profile.username && (
              <Button
                type="button"
                variant="default"
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ProfileContainerEditor({
  profile,
  setProfile,
  setEditing,
}: ProfileContextType) {
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
  console.log('FORM ERRORS: ', errors)
  const { fields } = useFieldArray({
    control,
    name: 'socialLinks',
  })

  const updateProjectMutation = trpc.users.updateProfile.useMutation({
    onSuccess: (data) => {
      setProfile((prev) => {
        return {
          ...prev,
          bio: data.bio,
          socialLinks: data.socialLinks,
        }
      })
      console.log('success')
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
    console.log('mappedSubmitData', mappedSubmitData)
    console.log('formData', formData)
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
                            // className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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

type UserProfileType = RouterOutputs['users']['getUser']
type ActualType = {
  username: string
  bio: string | undefined
  image: string | undefined
  socialLinks: string[]
}

// { username }: { username: string }
export default function ProfileContainer() {
  const getUserOrganizationsQuery = trpc.users.getOrganizations.useQuery()
  const { editing, profile } = useUserProfile()
  // const getUserQuery = trpc.users.getUser.useQuery({
  //   name: username,
  // })
  // const [editing, setEditing] = useState<boolean>(false)
  // const [profile, setProfile] = useState<ActualType>(() => {
  //   // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  //   const userData = getUserQuery.data!
  //   const remainingSocialLinks = 4 - userData.socialLinks.length
  //   return {
  //     ...userData,
  //     socialLinks: getUserQuery.data?.socialLinks.concat(
  //       Array(remainingSocialLinks).fill('', 0, remainingSocialLinks)
  //     ),
  //   } as ActualType
  // })

  // // This code is unreachable. This is fetched in getServerSideProps and is only here for type safety.
  // if (getUserQuery.isLoading || !getUserQuery.data) {
  //   return null
  // }

  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex items-center justify-center">
        <Avatar className="w-72 h-72">
          <AvatarImage src={profile.image} className="mb-4 rounded-full" />
          <AvatarFallback className="mb-4 rounded-full w-72 h-72 text-8xl border bg-slate-300">
            {profile.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
      {editing ? <ProfileContainerEditor1 /> : <ProfileContainerViewer1 />}
      <MemoizedUserSocialLinks links={profile.socialLinks} />
      <div className="border-gray-300 border-t mx-auto w-full pt-3 hidden md:block">
        {getUserOrganizationsQuery.data && (
          <MemoizedUsersOrganizationsSection
            organizations={getUserOrganizationsQuery.data}
          />
        )}
      </div>
    </div>
  )
}

export const MemoizedProfileContainer = React.memo(ProfileContainer)
