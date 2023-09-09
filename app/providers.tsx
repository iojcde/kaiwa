"use client"

import { SessionProvider } from "next-auth/react"
import { Provider as BalancerProvider } from "react-wrap-balancer"
import { ThemeProvider } from "next-themes"
import { ReactNode } from "react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AppProgressBar as ProgressBar } from "next-nprogress-bar"

export const Providers: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <BalancerProvider>
      <ThemeProvider attribute="class">
        <SessionProvider>
          <TooltipProvider>
            <ProgressBar />
            {children}
          </TooltipProvider>
        </SessionProvider>
      </ThemeProvider>
    </BalancerProvider>
  )
}
