
type Props = {
  organizations: string[]
}

import * as Avatar from "@radix-ui/react-avatar"

export default function UsersOrganizationsSection(organizations: Props) {
  return (

    <div className="flex flex-col gap-y-2 items-start justify-start left-0 text-left">
      <p className="text-xl font-bold">Organizations</p>
      <Avatar.Root className="inline-flex hover:cursor-pointer h-[45px] w-[45px] select-none items-center justify-center overflow-hidden rounded align-middle">
        <Avatar.Fallback
          className="text-violet11 leading-1 flex h-full w-full items-center justify-center bg-white text-[15px] font-medium"
          delayMs={600}
        >
          A
        </Avatar.Fallback>
      </Avatar.Root>
    </div>

  )
}
