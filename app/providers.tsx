"use client"

import { SessionProvider } from "next-auth/react"
import { Provider as BalancerProvider } from "react-wrap-balancer"

import { ReactNode } from "react"

export const Providers: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <BalancerProvider>
      <SessionProvider> {children}</SessionProvider>
    </BalancerProvider>
  )
}
