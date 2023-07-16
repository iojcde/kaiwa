import { IntroNav } from "@/components/intro/intro-nav"
import { IntroEditorDemo } from "@/components/intro/introEditorDemo"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"
import Link from "next/link"
import { Footer } from "./footer"
import { Balancer } from "react-wrap-balancer"
import { CmdkDemo } from "@/components/intro/cmdk-demo"
import { CollabDemo } from "@/components/intro/collab-demo"
import { MarkdownSupport } from "@/components/intro/markdown-support"

export default async function Home() {
  return (
    <>
      <div className="relative overflow-x-hidden pb-16">
        <IntroNav />
        <main className="container grid h-screen grid-cols-1 items-center justify-between pb-24 md:h-auto md:grid-cols-[1fr_0.8fr]">
          <div>
            <div className="py-16 md:px-6 md:py-20">
              {/* <div className="border select-none mb-2 border-orange-5 bg-orange-4 max-w-min whitespace-nowrap rounded-full px-2 py-1 text-xs">
                <span className="font-semibold uppercase">New</span> Kaiwa is
                now in alpha!
              </div> */}
              <span className="font-display text-violet-400 sm:text-lg">
                Introducing
              </span>
              <h1 className="font-display -ml-2 mt-2 text-8xl tracking-tight lg:text-9xl">
                Kaiwa
              </h1>
              <p className="mt-4 max-w-[32ch] text-gray-11 md:text-xl">
                <Balancer>
                  Kaiwa is a collaborative document editor built on Milkdown,
                  Y.js, and Partykit.
                </Balancer>
              </p>
              <Link
                href="/login"
                className="mt-8 inline-block select-none rounded-full bg-gradient-to-br from-violet-600 via-violet-500 to-violet-400 p-2 px-8 text-white  transition  hover:opacity-95 hover:shadow"
              >
                Get started
              </Link>
            </div>
          </div>

          <div className="mt-12 hidden w-full rounded-[16px] border border-gray-7 bg-white p-1 shadow-xl dark:bg-background md:block">
            <div className="w-full overflow-clip rounded-xl border">
              <ScrollArea className="h-[32rem] bg-white dark:bg-background ">
                <IntroEditorDemo />
              </ScrollArea>
            </div>
          </div>
        </main>
        <div className="gradient"></div>
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent blur dark:from-black" />
      </div>

      <div className="  w-full  py-20">
        <div className="container relative text-center">
          <div className="font-display inline-block rounded-full bg-violet-500 px-4 py-1 text-white">
            Features
          </div>
          <h2 className="mx-auto mt-8 text-4xl font-medium sm:max-w-none">
            <Balancer>Collaborate with ease</Balancer>
          </h2>
          <p className="mx-auto mt-2 max-w-prose">
            <Balancer>
              Kaiwa helps you get your work done faster by providing a
              distraction-free environment.
            </Balancer>
          </p>

          <Button className="mt-6" variant="secondary">
            Learn more
          </Button>
        </div>

        <div className="container mt-12 grid grid-cols-1 gap-4 md:grid-cols-[1fr_0.3fr_1fr]">
          <div className="overflow-clip rounded-xl border bg-white dark:bg-background md:col-span-2">
            <div className="relative flex h-52 items-center justify-center overflow-clip lg:h-64">
              <div className="absolute -bottom-1 left-0 right-8 top-9 rounded-tr-sm border-r border-t border-gray-5 pr-8 pt-8 shadow-xl dark:bg-black lg:pr-16 lg:pt-12">
                <CollabDemo />
              </div>
              <div className="absolute inset-x-0 bottom-0 z-10 h-12 bg-gradient-to-t from-white to-transparent dark:from-background" />
            </div>
            <div className="p-6 lg:p-8 lg:pt-0  ">
              <h3 className="font-display text-xl font-semibold">
                Collaborative by default
              </h3>
              <p className="mt-2 text-sm text-gray-11 sm:text-base">
                Kaiwa uses <a href="https://yjs.dev">Y.js</a> and{" "}
                <a href="https://partykit.io">PartyKit</a> to provide real-time
                collaboration capabilities. Enjoy real-time collaboration with
                your team, friends, or family.
              </p>
            </div>
          </div>

          <div className="overflow-clip rounded-xl border bg-white dark:bg-background">
            <div className="relative flex h-52 items-center justify-center lg:h-64">
              <Image
                src="/images/minimal.png"
                alt=""
                layout="fill"
                className="select-none object-cover object-top p-6"
              />
            </div>
            <div className="p-6 lg:p-8 lg:pt-0">
              <h3 className="font-display text-xl font-semibold">
                Keep distractions away
              </h3>
              <p className="mt-2 text-sm text-gray-11 sm:text-base">
                We built Kaiwa to be a distraction-free environment. Only
                essential notifications, no distractions.
              </p>
            </div>
          </div>

          <div className="grid justify-between overflow-clip rounded-xl border bg-white dark:bg-background">
            <div className="relative my-auto flex h-52 select-none items-center lg:h-64">
              <MarkdownSupport />
              <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white to-transparent dark:from-background" />
            </div>

            <div className="mt-auto p-6 lg:p-8 lg:pt-0">
              <h3 className="font-display text-xl font-semibold">
                Markdown Support
              </h3>
              <p className="mt-2 text-sm text-gray-11 sm:text-base">
                Kaiwa suppports Github Flavored Markdown, so you can add rich
                content to your documents.
              </p>
            </div>
          </div>

          <div className="overflow-clip rounded-xl border bg-white dark:bg-background md:col-span-2 ">
            <CmdkDemo />
            <div className="relative z-20 px-8 py-6 lg:pb-8 lg:pt-0 ">
              <h3 className="font-display text-xl font-semibold">
                A powerful command palette
              </h3>
              <p className="mt-2 text-sm  text-gray-11 sm:text-base">
                Kaiwa has a powerful command palette that allows you to do
                anything from changing the theme to creating a new document.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
export const metadata = {
  title: "Kaiwa",
}
