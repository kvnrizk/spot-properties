"use client";

// import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export function SessionProvider({ children }: { children: ReactNode }) {
  // Temporarily disabled auth session check
  // Uncomment when you're ready to use authentication
  // return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
  return <>{children}</>;
}
