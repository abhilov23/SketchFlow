"use client"

import { usePathname } from "next/navigation"
import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header"

export function MainLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isDashboard = pathname === "/dashboard"

  return (
    <div className="flex min-h-screen flex-col">
      {!isDashboard && <Header />}
      <main className="flex-1">{children}</main>
      {!isDashboard && <Footer />}
    </div>
  )
}
