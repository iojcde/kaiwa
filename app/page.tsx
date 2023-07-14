import { MainNav } from "@/components/main-nav"
import { MainEditorDemo } from "@/components/mainEditorDemo"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"
import Link from "next/link"
import { Footer } from "./footer"

import { Avatar } from "@/components/ui/avatar"
import { CircleSlash2, Github, Hash } from "lucide-react"
import { Balancer } from "react-wrap-balancer"

const users = [
  {
    name: "Gotoh Hitori",
    photo: "/images/bocchi.jpg",
    color: "#F3A0BE",
  },
  {
    name: "Kita Ikuyo",
    photo: "/images/kita.jpg",
    color: "#C64D52",
  },
]

export default async function Home() {
  return (
    <>
      <div className="relative flex h-screen items-center">
        <MainNav />
        <main className="container grid grid-cols-1 items-center justify-between pb-24 md:h-auto md:grid-cols-[1fr_0.8fr]">
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
                className="mt-8 inline-block select-none rounded-full bg-gradient-to-br from-violet-600 via-violet-500 to-violet-400 p-2 px-8 text-gray-1 transition hover:bg-gray-12/90 hover:opacity-95 hover:shadow"
              >
                Get started
              </Link>
            </div>
          </div>

          <div className="mt-16 hidden w-full rounded-[16px] border bg-white p-1 shadow-xl sm:block">
            <div className="w-full overflow-clip rounded-xl border">
              <ScrollArea className="h-[32rem] bg-white">
                <MainEditorDemo />
              </ScrollArea>
            </div>
          </div>
        </main>
        <div className="gradient"></div>
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white to-transparent"></div>
      </div>

      <div className=" relative w-full  py-20">
        <div className="container relative text-center">
          <div className="font-display inline-block rounded-full bg-violet-500 px-4 py-1 text-white">
            Features
          </div>
          <h2 className="mx-auto mt-8 text-4xl font-medium sm:max-w-none">
            <Balancer>Collaborate with ease</Balancer>
          </h2>
          <p className="mx-auto mt-2 max-w-prose">
            <Balancer>
              Enjoy
              <span className="font-semibold"> real-time collaboration </span>
              with your team, friends, or family.
              <br />
              <span className="font-semibold">No sign-up required.</span>
            </Balancer>
          </p>

          <Button className="mt-6" variant="secondary">
            Learn more
          </Button>
        </div>

        <div className="container mt-12 grid gap-4 sm:grid-cols-[1fr_0.2fr_1fr]">
          <div className="overflow-clip rounded-xl border bg-white sm:col-span-2">
            <div className="flex items-center justify-center p-6 py-16">
              <div
                className={
                  "before:content-[' '] flex items-center gap-6 text-xs text-gray-11 before:block before:h-2 before:w-2 before:rounded-full before:bg-stone-300 data-[status='connected']:before:bg-emerald-500 sm:text-base"
                }
                data-status={"connected"}
              >
                <span className="group overflow-ellipsis whitespace-nowrap text-xl">
                  2 users in room
                </span>

                <Button
                  className="h-12 select-none text-xl"
                  variant="outline"
                  size="lg"
                >
                  Share
                </Button>

                <div className="group flex flex-row-reverse items-center">
                  {users.length > 0 &&
                    users.map(
                      (
                        user: { name: string; photo: string; color: string },
                        n
                      ) => {
                        if (n < 4) {
                          return (
                            <Avatar
                              key={n}
                              className={`${
                                n != 0
                                  ? "-mr-4 h-16 w-16 transition-all group-hover:mr-0"
                                  : "h-[4.5rem] w-[4.5rem]"
                              } ring-4 ring-offset-[3px]`}
                              style={
                                {
                                  "--tw-ring-color": user?.color,
                                  zIndex: users?.length - n,
                                } as React.CSSProperties
                              }
                            >
                              <Image
                                width={256}
                                height={256}
                                quality={100}
                                className={`object-cover ${
                                  n == 0 && "h-20 w-20"
                                }`}
                                src={user?.photo}
                                alt={"bocchi"}
                              />
                            </Avatar>
                          )
                        }
                      }
                    )}
                </div>
              </div>
            </div>
            <div className="p-6 ">
              <h3 className="font-display text-xl font-semibold">
                Collaborative by default
              </h3>
              <p className="mt-2 text-gray-11">
                Kaiwa uses <a href="https://yjs.dev">Y.js</a> and{" "}
                <a href="https://partykit.io">PartyKit</a> to provide real-time
                collaboration capabilities.
              </p>
            </div>
          </div>

          <div className="overflow-clip rounded-xl border bg-white ">
            <div className="flex items-center justify-center py-16">
              <CircleSlash2 className="text-violet-400" size={64} />
            </div>
            <div className="p-6 ">
              <h3 className="font-display text-xl font-semibold">
                Keep distractions away
              </h3>
              <p className="mt-2 text-gray-11">
                We built Kaiwa to be a distraction-free environment. Only
                essential notifications, no distractions.
              </p>
            </div>
          </div>

          <div className="overflow-clip rounded-xl border bg-white ">
            <div className="flex items-center justify-center py-12  ">
              <Hash className="text-gray-12" size={80} />
            </div>
            <div className="p-6 ">
              <h3 className="font-display text-xl font-semibold">
                Markdown Support
              </h3>
              <p className="mt-2 text-gray-11">
                Kaiwa suppports Github Flavored Markdown, so you can add rich
                content to your documents.
              </p>
            </div>
          </div>

          <div className="col-span-2 overflow-clip rounded-xl border bg-white ">
            <div className="flex items-center justify-center py-12  ">
              <Github className="text-gray-12" size={80} />
            </div>
            <div className="p-6 ">
              <h3 className="font-display text-xl font-semibold">
                Proudly Open Source
              </h3>
              <p className="mt-2 text-gray-11">
                Kaiwa is open source. You can find the source code on{" "}
                <a href="https://github.com/iojcde/kaiwa">GitHub</a>.
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
