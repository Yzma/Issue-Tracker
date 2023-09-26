import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useMemo,
  useState,
} from 'react'
import { trpc } from '@/lib/trpc/trpc'

type UserProfileContextProviderProps = PropsWithChildren & {
  username: string
}

type UserProfileContextType = {
  profile: UserProfile
  setProfileData: Dispatch<SetStateAction<UserProfile>>
  editing: boolean
  setEditing: (value: boolean) => void
}

type UserProfile = {
  username: string
  bio: string | undefined
  image: string | undefined
  socialLinks: string[]
}

export const UserProfileContext = createContext<UserProfileContextType | null>(
  null
)

export default function UserProfileContextProvider({
  children,
  username,
}: PropsWithChildren<UserProfileContextProviderProps>) {
  const getUserQuery = trpc.users.getUser.useQuery({
    name: username,
  })
  const [profile, setProfile] = useState<UserProfile>(() => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const userData = getUserQuery.data!
    return userData as UserProfile
  })
  const [editing, setEditing] = useState(false)
  const userProfileContextValue = useMemo(
    () => ({
      profile,
      setProfileData: setProfile,
      editing,
      setEditing,
    }),
    [profile, setProfile, editing, setEditing]
  )

  return (
    <UserProfileContext.Provider value={userProfileContextValue}>
      {children}
    </UserProfileContext.Provider>
  )
}
