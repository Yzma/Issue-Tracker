import Head from "next/head";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBug } from "@fortawesome/free-solid-svg-icons";

import Header from "@/components/Header";

export default function Home() {
  return (
    <>
      <Head>
        <title>Bug-Zapper</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
          integrity="sha384-KyZXEAg3QhqLMpG8r+Knujsl5/WM6avuye5x+z7gDzFgLp5B45SY8U4h0EK10M5d"
          crossOrigin="anonymous"
        />
        <style jsx>{`
          .image-container {
            height: calc(100vh - HEADER_HEIGHT);
          }
          .left-container {
            min-height: calc(100vh - HEADER_HEIGHT);
            padding-top: 2rem;
          }
        `}</style>
      </Head>
      <Header />

      <main className="bg-white min-h-screen">
        <div className="relative md:flex">
          <div className="md:w-1/2">
            <div className="min-h-screen h-full flex flex-col">
              <div className="flex-1 flex flex-col items-center justify-center">
                <FontAwesomeIcon icon={faBug} className="text-9xl mb-4" />
                <h1 className="text-4xl font-bold">Bug-Zapper</h1>
                <p className="text-center mt-4 px-6">
                  Bug-Zapper is a powerful and user-friendly platform for tracking and managing coding bugs in your projects. Our mission is to streamline your bug tracking process, making it easier to identify, prioritize, and resolve coding issues in your projects. With a user-friendly interface and powerful collaboration tools, Bug-Zapper empowers developers and teams to efficiently manage bugs, enhance code quality, and accelerate project delivery. Join us!
                </p>
              </div>
            </div>
          </div>
          <div className="hidden md:block relative md:w-1/2 image-container">
            <Image
              src="/images/homepic.avif"
              alt="Home Page"
              layout="fill"
              style={{
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          </div>
        </div>
      </main>
    </>
  );
}