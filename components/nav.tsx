import { UserNav } from "@/components/user-nav";
import Link from "next/link";

export const Nav = () => {
  return (
    <nav className="border-b py-3">
      <div className="max-w-screen-xl mx-auto w-full flex items-center px-6 justify-between">
        <Link
          href="/dashboard"
          className="font-semibold text-xl flex gap-2 items-center"
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
          郁代
        </Link>
        <div>
          <UserNav />
        </div>
      </div>
    </nav>
  );
};
