"use client"; 
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export const Providers: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <SessionProvider> {children}</SessionProvider>;
};
