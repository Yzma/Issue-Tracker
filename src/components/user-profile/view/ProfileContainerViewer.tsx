import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { useUserProfile } from '@/hooks/useUserProfile'

export default function ProfileContainerViewer() {
  const { setEditing, profile } = useUserProfile()
  const { data: session, status } = useSession()
  return (
    <div className="relative">
      <div className="flex flex-col">
        <div className="flex flex-col gap-y-0 text-left">
          <div>
            <p className="text-2xl font-bold">{profile.username}</p>
          </div>

          <div className="flex flex-col gap-y-2">
            <p className="py-2 text-gray-500">
              {profile.bio ||
                'This is a random bio, nothing of value here. Move on.'}
            </p>

            {status === 'authenticated' &&
              session.user.namespace.name === profile.username && (
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
