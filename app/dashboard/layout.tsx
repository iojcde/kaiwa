import { Nav } from "@/components/nav";
import { ReactNode } from "react";
import { DashboardNav } from "./dashboard-nav";

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div>
    <Nav />
    <div className="container py-8 md:pl-0 grid md:grid-cols-[200px_1fr] gap-12">
      <DashboardNav /> {children}
    </div>
  </div>
);

export default Layout;
