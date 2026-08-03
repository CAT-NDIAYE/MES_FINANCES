'use client'

import * as React from 'react'
import { Sidebar, Navbar, BottomNav, MobileHeader } from '@/components/navigation'
import { usePathname } from 'next/navigation'
import { navigationConfig } from '@/config/navigation'

interface DashboardLayoutProps {
  children: React.ReactNode
}

/**
 * DashboardLayout
 * Le layout principal des pages privées (protégées par le middleware).
 *
 * ── Desktop (>= md) ──
 * ┌──────────┬──────────────────────────────┐
 * │ Sidebar  │ Navbar                       │
 * │          │────────────────────────────── │
 * │          │ Main content                 │
 * └──────────┴──────────────────────────────┘
 *
 * ── Mobile (< md) ──
 * ┌──────────────────────────────┐
 * │ MobileHeader                │
 * │──────────────────────────── │
 * │ Main content (scrollable)   │
 * │──────────────────────────── │
 * │ BottomNav                   │
 * └──────────────────────────────┘
 */
export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()

  const currentNavItem = navigationConfig.find(
    (item) => item.href === pathname || (item.href !== '/dashboard' && pathname.startsWith(`${item.href}/`))
  )
  const mobileTitle = currentNavItem?.title || 'MesFinances'

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar (hidden < md) */}
      <Sidebar />

      <div className="flex flex-1 flex-col min-w-0">
        {/* Desktop: Navbar */}
        <Navbar />
        {/* Mobile: Header */}
        <MobileHeader title={mobileTitle} />

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6">
          {children}
        </main>

        {/* Mobile: Bottom navigation */}
        <BottomNav />
      </div>
    </div>
  )
}
