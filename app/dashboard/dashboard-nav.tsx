"use client";
import Link from "next/link";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export const DashboardNav = () => (
  <div className="hidden md:flex flex-col justify-between gap-2 w-[200px]">
    <NavLink className="flex gap-2 items-center" href="/dashboard">
      <FileText size={16} />
      Posts
    </NavLink>
  </div>
);

const NavLink = ({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) => {
  const isActive = href == usePathname();
  return (
    <Link
      className={cn(
        "w-full hover:bg-gray-4 py-2 px-4 text-sm rounded-lg font-medium",
        isActive ? "bg-gray-4" : "",
        className
      )}
      href={href}
    >
      {children}
    </Link>
  );
};
