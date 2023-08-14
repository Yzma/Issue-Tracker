import { Button } from '@/components/ui/button'
import { useUserProfile } from '@/hooks/useUserProfile'

export default function ProfileContainerViewer() {
  const { setEditing, profile } = useUserProfile()
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

            <Button
              type="button"
              variant="default"
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </Button>
            {/* {session?.user.namespace.name === profile.username && (
              <Button
                type="button"
                variant="default"
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </Button>
            )} */}
          </div>
        </div>
      </div>
    </div>
  )
}
