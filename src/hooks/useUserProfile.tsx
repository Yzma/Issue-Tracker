import { useContext } from 'react'
import { UserProfileContext } from '@/components/user-profile/UserProfileContext'

export function useUserProfile() {
  const context = useContext(UserProfileContext)

  if (!context) {
    throw new Error(
      'useUseProfile is supposed to be used in a component thats wrapped in UserProfileContext'
    )
  }

  return { ...context }
}
