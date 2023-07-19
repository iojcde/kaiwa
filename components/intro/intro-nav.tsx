import Link from "next/link"
import { Button } from "../ui/button"
import Image from "next/image"
import { getServerSession } from "next-auth"
import { UserNav } from "../user-nav"

export const IntroNav = async () => {
  const session = await getServerSession()
  return (
    <nav className="container flex items-center w-full overflow-x-auto justify-between py-4">
      <div className="flex items-center gap-12">
        <Link
          href="/"
          className="font-display flex items-center gap-2 text-xl font-semibold"
        >
          {/* <Image src="/images/logo.png" alt="" width={20} height={20} /> */}
          Kaiwa
        </Link>
        <div className="flex items-center text-sm">
          <Link href="/about"> About</Link>
        </div>
      </div>

      {session?.user ? (
        <UserNav />
      ) : (
        <Button asChild variant="outline">
          <Link href="/login">Login</Link>
        </Button>
      )}
    </nav>
  )
}
