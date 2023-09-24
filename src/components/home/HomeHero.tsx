import Image from 'next/image'
import Link from 'next/link'
import { Button } from '../ui/button'
import { HomeSectionDescription, HomeSectionTitle } from './HomeSection'

export default function HomeHero() {
  return (
    <div className="pt-28 md:pt-20">
      <div className="pb-12 text-center md:pb-16">
        <HomeSectionTitle className="text-5xl font-extrabold tracking-tighter md:text-6xl">
          The ultimate{' '}
          <span className="bg-gradient-to-r from-green-500 to-teal-800 bg-clip-text text-transparent">
            Issue Tracker
          </span>
        </HomeSectionTitle>
        <div className="mx-auto max-w-3xl">
          <HomeSectionDescription className="text-xl">
            Issue-Tracker is a powerful and user-friendly platform for tracking
            and managing coding bugs in your projects. Join us!
          </HomeSectionDescription>
          <div className="flex justify-center">
            <Button size="lg">
              <Link href="/login">Sign up for free</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Image
          style={{ maxHeight: '432px' }}
          className="flex justify-center text-center shadow-lg"
          src="/images/homepage_coding.jpeg"
          alt="Home Page"
          width={768}
          height={432}
        />
      </div>
    </div>
  )
}
