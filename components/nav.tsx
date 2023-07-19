import { UserNav } from "@/components/user-nav"
import Link from "next/link"

export const Nav = () => {
  return (
    <nav className="flex border-b py-3">
      <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between px-6">
        <Link
          href="/dashboard"
          className="font-display flex items-center gap-2 text-xl font-medium"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <circle cx="12" cy="12" r="10"></circle>
          </svg>
          Kaiwa
        </Link>
        <UserNav />
      </div>
    </nav>
  )
}
