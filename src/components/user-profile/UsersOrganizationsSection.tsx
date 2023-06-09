import Link from 'next/link'
import * as Avatar from '@radix-ui/react-avatar'

import { Organizations } from './types'

export default function UsersOrganizationsSection({
  organizations,
}: {
  organizations: Organizations[]
}) {
  return (
    <div>
      {organizations.length > 0 && (
        <div className="flex flex-col gap-y-2 items-start justify-start left-0 text-left">
          <p className="text-xl font-bold">Organizations</p>

          {organizations.map((organization) => {
            return (
              <div key={organization.name}>
                <Link href={`/${organization.name.toLowerCase()}`}>
                  <Avatar.Root className="inline-flex hover:cursor-pointer h-[45px] w-[45px] select-none items-center justify-center overflow-hidden rounded align-middle">
                    <Avatar.Fallback className="text-violet11 leading-1 flex h-full w-full items-center justify-center bg-white text-[15px] font-medium">
                      {organization.name.charAt(0).toUpperCase()}
                    </Avatar.Fallback>
                  </Avatar.Root>
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
