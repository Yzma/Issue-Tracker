import { useSession } from 'next-auth/react'

import { MemoizedProfileContainer } from '@/components/user-profile/ProfileContainer'
import { trpc } from '@/lib/trpc/trpc'
import UserProfileContextProvider from '../user-profile/UserProfileContext'
import SharedProjectList from '../projects/SharedProjectList'

import { UserPageProps } from './types'

export default function UserPage({ username }: UserPageProps) {
  const { data: session } = useSession()
  // This was fetched in getServerSideProps and will be available from the start
  const getUsersProjectsQuery = trpc.users.getProjects.useQuery({
    name: username,
    limit: 10,
  })

  return (
    <div className="gap-x-7 px-2 md:flex">
      <UserProfileContextProvider username={username}>
        <MemoizedProfileContainer />
      </UserProfileContextProvider>
      <div className="w-full">
        <SharedProjectList
          status={getUsersProjectsQuery.status}
          createProjectLink={
            username === session?.user.name ? '/projects/create' : undefined
          }
          projects={getUsersProjectsQuery.data}
        />
      </div>
    </div>
  )
}
