"use client"
import Link from "next/link"
import { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { FileText } from "lucide-react"
import { cn } from "@/lib/utils"

export const DashboardNav = () => (
  <div className="hidden w-[200px] flex-col justify-between gap-2 md:flex">
    <NavLink className="flex items-center gap-2" href="/dashboard">
      <FileText size={16} />
      Posts
    </NavLink>
  </div>
)

const NavLink = ({
  href,
  children,
  className,
}: {
  href: string
  children: ReactNode
  className?: string
}) => {
  const isActive = href == usePathname()
  return (
    <Link
      className={cn(
        "w-full rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-4",
        isActive ? "bg-gray-4" : "",
        className
      )}
      href={href}
    >
      {children}
    </Link>
  )
}
