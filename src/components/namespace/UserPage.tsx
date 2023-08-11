import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { MemoizedProfileContainer } from '@/components/user-profile/ProfileContainer'
import ProjectList from '@/components/projects/ProjectList'

import { Button } from '../ui/button'
import { trpc } from '@/lib/trpc/trpc'
import UserProfileContextProvider from '../user-profile/UserProfileContext'

export default function UserPage({ username }: { username: string }) {
  const { data: session } = useSession()
  const getUsersProjectsQuery = trpc.users.getProjects.useQuery({
    name: username,
    limit: 10,
  })

  return (
    <div className="md:flex gap-x-7 px-2">
      <UserProfileContextProvider username={username}>
        <MemoizedProfileContainer />
      </UserProfileContextProvider>
      <div className="w-full">
        {getUsersProjectsQuery.isLoading || !getUsersProjectsQuery.data ? (
          // TODO: Loading
          <>Loading user projects...</>
        ) : (
          <ProjectList
            projects={getUsersProjectsQuery.data}
            projectCreationButton={
              username === session?.user.name ? (
                <Button size="sm" asChild className="flex w-[7.5rem]">
                  <Link href="/projects/create">Create Project</Link>
                </Button>
              ) : undefined
            }
          />
        )}
      </div>
    </div>
  )
}
