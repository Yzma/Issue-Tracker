import { useSession } from 'next-auth/react'
import ProfileContainer, {
  MemoizedProfileContainer,
} from '@/components/user-profile/ProfileContainer'
import ProjectList from '@/components/projects/ProjectList'

import { UserResponse } from '@/types/types'

export default function UserPage({ data }: { data: UserResponse }) {
  const { data: session } = useSession()
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center items-start">
        <div className="w-1/4">
          <MemoizedProfileContainer data={data.user} />
        </div>
        <div className="w-3/4 pl-8">
          <div className="flex flex-col h-full">
            <div className="w-full max-w-5xl mt-4 flex-1">
              <ProjectList
                projects={data.user.projects}
                showCreateProjectButton={
                  data.namespace.name === session?.user.name
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
