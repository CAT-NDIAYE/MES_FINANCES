'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'
import { DashboardLayout, AuthLayout } from '@/components/layout'

/**
 * LayoutWrapper
 * Gère dynamiquement l'application des layouts Dashboard ou Auth.
 */
export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  // On évite d'appliquer les layouts spécifiques pendant l'hydratation
  // pour minimiser les différences avec le HTML statique.
  if (!mounted) {
    return <>{children}</>
  }

  const isAuthRoute =
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/forgot-password') ||
    pathname.startsWith('/reset-password')

  const isDashboardRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/budgets') ||
    pathname.startsWith('/transactions') ||
    pathname.startsWith('/categories') ||
    pathname.startsWith('/saving-goals') ||
    pathname.startsWith('/settings')

  if (isAuthRoute) {
    return <AuthLayout>{children}</AuthLayout>
  }

  if (isDashboardRoute) {
    return <DashboardLayout>{children}</DashboardLayout>
  }

  return <>{children}</>
}
