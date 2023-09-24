import Head from 'next/head'

import Header from '@/components/Header'

import HomeBanner from '@/components/home/HomeBanner'
import HomeFooter from '@/components/home/HomeFooter'
import HomeCards from '@/components/home/HomeCards'
import HomeFaq from '@/components/home/HomeFaq'
import HomeMission from '@/components/home/HomeMission'
import HomeHero from '@/components/home/HomeHero'

export default function Home() {
  return (
    <>
      <Head>
        <title>Issue-Tracker</title>
      </Head>
      <Header />
      <div className="container mx-auto max-w-5xl">
        <div className="max-w-9xl mx-auto w-full space-y-16 px-4 sm:px-3">
          <HomeHero />
          <HomeMission />
          <HomeFaq />
          <HomeCards />
          <HomeBanner />
          <HomeFooter />
        </div>
      </div>
    </>
  )
}
