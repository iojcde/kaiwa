import { UserNav } from "@/components/user-nav"
import Link from "next/link"

export const Nav = () => {
  return (
    <nav className="  z-20 my-0 flex  h-16 w-full items-center justify-center border-b bg-white  px-6 py-4 transition duration-200 dark:border-neutral-800 dark:bg-black lg:px-16">
      <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between px-6">
        <Link
          href="/dashboard"
          className="font-display flex items-center gap-2 text-xl font-medium"
        >
          Kaiwa
        </Link>
        <UserNav />
      </div>
    </nav>
  )
}
