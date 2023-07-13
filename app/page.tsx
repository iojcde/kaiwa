import { MainNav } from "@/components/main-nav";
import { Nav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "./footer";
import { MainEditorDemo } from "@/components/mainEditorDemo";
import { ScrollArea } from "@/components/ui/scroll-area";

import CollabImage from "@/public/images/collab.png";
import { Balancer } from "react-wrap-balancer";
export default async function Home() {
  return (
    <>
      <div className="relative ">
        <MainNav />
        <main className="container pb-24 h-[70vh] md:h-auto grid grid-cols-1 md:grid-cols-2 gap-8 justify-between">
          <div>
            <div className="py-16 mt-8 md:px-6 md:py-20">
              <div className="border select-none mb-2 border-orange-5 bg-orange-4 max-w-min whitespace-nowrap rounded-full px-2 py-1 text-xs">
                <span className="font-semibold uppercase">New</span> Kaiwa is
                now in alpha!
              </div>
              <h1 className="text-8xl lg:text-9xl font-display tracking-tight">
                Kaiwa
              </h1>
              <p className="mt-4 md:text-xl text-gray-11 max-w-[32ch]">
                <Balancer>
                  Kaiwa is a collaborative document editor built on Milkdown,
                  Y.js, and Partykit.
                </Balancer>
              </p>
              <Link
                href="/login"
                className="rounded-full select-none bg-gray-12 text-gray-1 hover:bg-gray-12/90 transition inline-block p-2 px-6 mt-8"
              >
                Get started
              </Link>
            </div>
          </div>

          <div className="rounded-[16px] p-1 border mt-8 sm:block hidden bg-white shadow w-full">
            <div className="border rounded-xl w-full overflow-clip">
              <ScrollArea className="h-[30rem] bg-white">
                <MainEditorDemo />
              </ScrollArea>
            </div>
          </div>
        </main>
        <div className="gradient "></div>
      </div>

      <div className=" w-full py-16 mt-16 relative">
        <div className="container text-center relative">
          <h2 className="text-4xl font-medium sm:max-w-none mx-auto">
            <Balancer>Collaborate with ease</Balancer>
          </h2>
          <p className="mt-6 max-w-prose mx-auto">
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

        <div className="grid container lg:grid-cols-[1fr_0.2fr_1fr] gap-4 mt-12">
          <div className="border rounded-xl bg-white overflow-clip lg:col-span-2">
            <Image src={CollabImage} alt="" className="py-8" />
            <div className="p-6 ">
              <h3 className="text-xl font-display font-semibold">
                Collaborative by default
              </h3>
              <p className="mt-2">
                Kaiwa uses <a href="https://yjs.dev">Y.js</a> to provide
                real-time collaboration.
              </p>
            </div>
          </div>

          <div className="border rounded-xl bg-white overflow-clip ">
            {/* <Image  alt="" className="py-8" /> */}
            <div className="p-6 ">
              <h3 className="text-xl font-display font-semibold">
                Keep your distractions away
              </h3>
              <p className="mt-2">
                Kaiwa is a minimalistic editor that focuses on writing.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
export const metadata = {
  title: "Kaiwa",
};
