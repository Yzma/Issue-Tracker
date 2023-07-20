import Link from 'next/link'
import * as Avatar from '@radix-ui/react-avatar'
import React from 'react'

export default function UsersOrganizationsSection({
  organizations,
}: {
  organizations: string[]
}) {
  return (
    <div>
      {organizations.length > 0 && (
        <div className="flex flex-col gap-y-4 items-start justify-start left-0 text-left">
          <p className="text-xl font-bold">Organizations</p>

          <div className="flex flex-row flex-wrap gap-x-2 gap-y-2">
            {organizations.map((organization) => {
              return (
                <div key={organization}>
                  <Link href={`/${organization.toLowerCase()}`}>
                    <Avatar.Root className="inline-flex hover:cursor-pointer h-[45px] w-[45px] select-none items-center justify-center overflow-hidden rounded align-middle border-gray-400 border">
                      <Avatar.Fallback className="text-violet11 leading-1 flex h-full w-full items-center justify-center bg-white text-[15px] font-medium">
                        {organization.charAt(0).toUpperCase()}
                      </Avatar.Fallback>
                    </Avatar.Root>
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export const MemoizedUsersOrganizationsSection = React.memo(
  UsersOrganizationsSection
)
