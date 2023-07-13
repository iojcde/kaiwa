import { MainNav } from "@/components/main-nav";
import { Nav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "./footer";
import { MainEditorDemo } from "@/components/mainEditorDemo";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function Home() {
  return (
    <div className="bg-gray-1">
      <MainNav />
      <main className="container grid items-center grid-cols-1 md:grid-cols-2 justify-between">
        <div>
          <div className="py-6 sm:p-6">
            <div className="border select-none mb-2 border-orange-6 bg-orange-5 max-w-min whitespace-nowrap rounded-full px-2 py-1 text-xs">
              <span className="font-semibold uppercase">New</span> Kaiwa is now
              in alpha!
            </div>
            <h1 className="text-7xl lg:text-9xl font-display tracking-tight">
              Kaiwa
            </h1>
            <p className="mt-4 md:text-xl text-gray-11 max-w-[32ch]">
              Kaiwa is a collaborative document editor built on Milkdown, Y.js,
              and Partykit.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link href="/login">Get started</Link>
            </Button>
          </div>
        </div>

        <div className="rounded-[16px] p-1 border mt-8  shadow w-full">
          <div className="border rounded-xl w-full ">
            <ScrollArea className="h-[32rem]">
              <MainEditorDemo />
            </ScrollArea>
          </div>
        </div>
      </main>
      <div className=" w-full py-16 mt-16 bg-gray-2">
        <div className="container text-center">
          <h2 className="text-4xl font-medium">Collaborate with ease</h2>
          <p className="mt-2">
            Enjoy
            <span className="font-semibold"> real-time collaboration </span>
            with your team, friends, or family.
            <br />
            <span className="font-semibold">No sign-up required.</span>
          </p>
        </div>

        <div>
          <div className="border rounded-xl p-6">
            <h3>Collaborative by default</h3>
            {/* <Image src="" /> */}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
