import React from 'react'
import { MemoizedUsersOrganizationsSection } from '@/components/user-profile/UsersOrganizationsSection'

import { MemoizedUserSocialLinks } from './UserSocialLinks'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { useUserProfile } from '@/hooks/useUserProfile'
import { trpc } from '@/lib/trpc/trpc'
import { MemoizedProfileContainerEditor } from './view/ProfileContainerEditor'
import ProfileContainerViewer from './view/ProfileContainerViewer'

export default function ProfileContainer() {
  const getUserOrganizationsQuery = trpc.users.getOrganizations.useQuery()
  const { editing, profile } = useUserProfile()

  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex items-center justify-center">
        <Avatar className="h-72 w-72">
          <AvatarImage src={profile.image} className="mb-4 rounded-full" />
          <AvatarFallback className="mb-4 h-72 w-72 rounded-full border bg-slate-300 text-8xl">
            {profile.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      {editing ? (
        <MemoizedProfileContainerEditor />
      ) : (
        <ProfileContainerViewer />
      )}

      <MemoizedUserSocialLinks links={profile.socialLinks} />
      <div className="mx-auto hidden w-full border-t border-gray-300 pt-3 md:block">
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
