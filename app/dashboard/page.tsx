import { WorkspaceCard } from "./vault-card"
import { authOptions } from "@/lib/auth"
import { Vaults } from "./vaults"
import { Suspense } from "react"
import Link from "next/link"

const Dashboard = async () => {
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-4xl font-bold tracking-tight">Vaults</h1>
        <Link href="/create-vault">Create Vault</Link>
      </div>

      <Suspense
        fallback={
          <div className="divide-border-200 mt-8 divide-y rounded-md border">
            <WorkspaceCard.Skeleton />
            <WorkspaceCard.Skeleton />
            <WorkspaceCard.Skeleton />
            <WorkspaceCard.Skeleton />
            <WorkspaceCard.Skeleton />
          </div>
        }
      >
        <Vaults />
      </Suspense>
    </div>
  )
}

export default Dashboard

export const metadata = {
  title: "Dashboard",
}

export const revalidate = 0
