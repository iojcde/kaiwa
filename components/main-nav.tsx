import Link from "next/link"
import { Button } from "./ui/button"
import Image from "next/image"

export const MainNav = () => {
  return (
    <nav className="container absolute inset-x-0 top-0 flex items-center justify-between py-4">
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

      <Button asChild variant="outline">
        <Link href="/login">Login</Link>
      </Button>
    </nav>
  )
}
