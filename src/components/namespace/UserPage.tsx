import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { MemoizedProfileContainer } from '@/components/user-profile/ProfileContainer'
import ProjectList from '@/components/projects/ProjectList'

import { UserResponse } from '@/types/types'
import { Button } from '../ui/button'
import DefaultLayout from '../ui/DefaultLayout'

export default function UserPage({ data }: { data: UserResponse }) {
  const { data: session } = useSession()
  return (
    <DefaultLayout>
      <div className="md:flex gap-x-7 px-2">
        <MemoizedProfileContainer data={data.user} />
        <div className="w-full">
          <ProjectList
            projects={data.user.projects}
            projectCreationButton={
              data.namespace.name === session?.user.name ? (
                <Button size="sm" asChild className="flex w-[7.5rem]">
                  <Link href="/login">Create Project</Link>
                </Button>
              ) : undefined
            }
          />
        </div>
      </div>
    </DefaultLayout>
  )
}
