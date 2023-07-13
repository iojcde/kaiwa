import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";

export const MainNav = () => {
  return (
    <nav className="container flex items-center py-4 justify-between">
      <div className="flex items-center gap-12">
        <Link href="/" className="text-xl font-medium flex items-center gap-2">
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
  );
};
