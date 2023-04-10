import Link from "next/link"

import UsersOrganizationsSection from "@/components/user-profile/UsersOrganizationsSection"
import UserSocialLinks from "@/components/user-profile/UserSocialLinks"

export default function ProfileContainer({ data }) {
  return (
    <div className="relative">
      <div className="flex flex-col">
        <div className="flex items-center justify-center">
          <div className="w-72 h-72 mb-4 bg-gray-200 text-gray-600 rounded-full" />
        </div>

        <div className="flex flex-col gap-y-0 items-start justify-start left-0 text-left">
          <div>
            <p className="text-xl font-bold">Full Name</p>
            <p className="text-xl font-light">Username</p>
          </div>

          <div className="flex flex-col gap-y-2">
            <p className="text-gray-500 py-2">
              {data.bio ||
                "This is a random bio, nothing of value here. Move on."}
            </p>
            <Link className="btn" href="/usersettings">
              Edit Profile
            </Link>
          </div>
        </div>
        <UserSocialLinks links={[]} />
      </div>
      <hr className="border-gray-300 my-4 mx-auto w-full" />
      <UsersOrganizationsSection organizations={[]}/>
    </div>
  )
}
