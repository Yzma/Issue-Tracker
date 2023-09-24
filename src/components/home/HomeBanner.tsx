import Link from 'next/link'
import { Button } from '../ui/button'
import { HomeSectionDescription, HomeSectionTitle } from './HomeSection'

export default function HomeBanner() {
  return (
    <div className="rounded bg-green-400 py-12 px-8 shadow-2xl md:py-12 md:px-12">
      <div className="flex flex-col items-center justify-between lg:flex-row">
        <div className="mb-6 text-center lg:mr-16 lg:mb-0 lg:text-left">
          <HomeSectionTitle className="text-left">
            Ready to get started?
          </HomeSectionTitle>
          <HomeSectionDescription className="mb-0 opacity-75">
            Issue Tracker is completely free! Sign up and get started right
            away!
          </HomeSectionDescription>
        </div>

        <div>
          <Button variant="secondary" size="lg">
            <Link href="/login">Sign Up</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
