import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import Link from "next/link";

export default async function Home() {
  return (
    <main className=" min-h-screen p-24">
      <div>
        <h1 className="text-4xl font-display font-bold">
          Something Something Editor
        </h1>

        <Link href="/login">/login</Link>
      </div>
    </main>
  );
}
