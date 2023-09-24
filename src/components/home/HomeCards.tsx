import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBook,
  faBug,
  faBuilding,
  faMailBulk,
  faUser,
  faUsers,
} from '@fortawesome/free-solid-svg-icons'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { PropsWithChildren } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { HomeSectionDescription, HomeSectionTitle } from './HomeSection'

type MainCardTitleProps = PropsWithChildren & {
  title: string
  description: string
  icon: IconProp
}

function HomeCard({ title, description, icon }: MainCardTitleProps) {
  return (
    <Card className="h-60">
      <CardHeader>
        <CardTitle className="flex flex-col items-center gap-y-4 font-bold">
          <FontAwesomeIcon size="2x" icon={icon} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  )
}

export default function HomeCards() {
  return (
    <div className="space-y-3">
      <div>
        <HomeSectionTitle>
          Keep track of all your issues organized
        </HomeSectionTitle>
        <HomeSectionDescription>
          Our mission is to streamline your bug tracking process, making it
          easier to identify, prioritize, and resolve coding issues in your
          projects.
        </HomeSectionDescription>
      </div>

      <div className="mx-auto grid max-w-sm items-start gap-6 md:max-w-2xl md:grid-cols-2 lg:max-w-none lg:grid-cols-3">
        <HomeCard
          title="Powerful Tracker"
          description="Monitor issues that have been assigned specifically to you in all of your active projects."
          icon={faBug}
        />

        <HomeCard
          title="Collaboration"
          description="Invite users to join your ongoing projects and collaborate."
          icon={faMailBulk}
        />

        <HomeCard
          title="Organizations"
          description="Form a free organization and begin collaborating with your team."
          icon={faBuilding}
        />

        <HomeCard
          title="Privacy"
          description="Maintain project confidentiality by marking them as private, and restricting access to trusted individuals."
          icon={faBook}
        />

        <HomeCard
          title="Community"
          description="Engage in collaboration on public projects with fellow members."
          icon={faUsers}
        />

        <HomeCard
          title="User Profiles"
          description="Customize your profile with your socials and a personalized bio."
          icon={faUser}
        />
      </div>
    </div>
  )
}
