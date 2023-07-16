"use client"

import { SessionProvider } from "next-auth/react"
import { Provider as BalancerProvider } from "react-wrap-balancer"
import { ThemeProvider } from 'next-themes'
import { ReactNode } from "react"

export const Providers: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <BalancerProvider>
      <ThemeProvider attribute='class'>
        <SessionProvider> {children}</SessionProvider>
      </ThemeProvider>
    </BalancerProvider>
  )
}
