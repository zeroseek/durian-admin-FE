"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { isLoggedIn, clearToken } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const NAV = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/users", label: "Users" },
  { href: "/dashboard/deposits", label: "Deposits" },
  { href: "/dashboard/withdrawals", label: "Withdrawals" },
  { href: "/dashboard/certificates", label: "Certificates" },
  { href: "/dashboard/commissions", label: "Commissions" },
  { href: "/dashboard/promotions", label: "Promotions" },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoggedIn()) router.replace("/login")
  }, [router])

  function handleLogout() {
    clearToken()
    router.replace("/login")
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-52 border-r bg-muted/30 flex flex-col p-4 gap-1">
        <p className="font-semibold text-sm px-2 py-1 mb-2">🌵 Durian Admin</p>
        <Separator className="mb-2" />
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className={`text-sm px-3 py-2 rounded-md hover:bg-accent transition-colors ${
              pathname === n.href ? "bg-accent font-medium" : "text-muted-foreground"
            }`}
          >
            {n.label}
          </Link>
        ))}
        <div className="flex-1" />
        <Separator className="my-2" />
        <Button variant="ghost" size="sm" onClick={handleLogout} className="justify-start">
          Sign out
        </Button>
      </aside>
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  )
}
