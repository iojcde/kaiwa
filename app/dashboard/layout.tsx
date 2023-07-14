import { Nav } from "@/components/nav"
import { ReactNode } from "react"
import { DashboardNav } from "./dashboard-nav"

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div>
    <Nav />
    <div className="container grid gap-12 py-8 md:grid-cols-[200px_1fr]">
      <DashboardNav /> {children}
    </div>
  </div>
)

export default Layout
