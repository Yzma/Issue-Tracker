import Link from 'next/link'
import React from 'react'
import { RouterOutputs } from '@/lib/trpc/trpc'
import { Avatar, AvatarFallback } from '../ui/avatar'

export default function UsersOrganizationsSection({
  organizations,
}: {
  organizations: RouterOutputs['users']['getOrganizations']
}) {
  return (
    <div>
      {organizations.length > 0 && (
        <div className="left-0 flex flex-col items-start justify-start gap-y-4 text-left">
          <p className="text-xl font-bold">Organizations</p>

          <div className="flex flex-row flex-wrap gap-x-2 gap-y-2">
            {organizations.map((organization) => {
              return (
                <div key={organization.name}>
                  <Link href={`/${organization.name}`}>
                    <Avatar className="inline-flex h-[45px] w-[45px] select-none items-center justify-center overflow-hidden rounded border border-gray-400 align-middle hover:cursor-pointer">
                      <AvatarFallback className="leading-1 flex h-full w-full items-center justify-center rounded-none bg-white text-[15px] font-medium text-violet11">
                        {organization.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
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
