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
  profile: ActualType
  setProfileData: Dispatch<SetStateAction<ActualType>>
  editing: boolean
  setEditing: (value: boolean) => void
}

type ActualType = {
  username: string
  bio: string | null
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
  const [profile, setProfile] = useState<ActualType>(() => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const userData = getUserQuery.data!
    const remainingSocialLinks = 4 - userData.socialLinks.length
    return {
      ...userData,
      socialLinks: getUserQuery.data?.socialLinks.concat(
        Array(remainingSocialLinks).fill('', 0, remainingSocialLinks)
      ),
    } as ActualType
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
