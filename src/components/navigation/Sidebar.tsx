'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navigationConfig } from '@/config/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { useAuth } from '@/features/auth/hooks/useAuth'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

/**
 * Sidebar
 * Navigation latérale Desktop (>= md breakpoint).
 * - Collapsible (largeur animée entre 256px et 72px).
 * - État persisté dans `localStorage`.
 *
 * Note: Uses Base UI primitives — TooltipTrigger renders as a <span>.
 * We wrap the Link in the trigger directly, using the `render` prop.
 */
export function Sidebar() {
  const pathname = usePathname()
  const { signOut } = useAuth()

  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const navItems = navigationConfig.filter((item) => item.showInSidebar)

  React.useEffect(() => {
    const stored = localStorage.getItem('sidebar-collapsed')
    if (stored !== null) {
      setIsCollapsed(stored === 'true')
    }
  }, [])

  const toggleSidebar = () => {
    const next = !isCollapsed
    setIsCollapsed(next)
    localStorage.setItem('sidebar-collapsed', String(next))
  }

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col bg-card border-r h-screen sticky top-0 transition-all duration-300 ease-in-out shrink-0',
        isCollapsed ? 'w-[72px]' : 'w-64'
      )}
    >
      {/* ── Logo & Toggle ── */}
      <div className="flex h-16 items-center border-b px-4">
        {isCollapsed ? (
          <button
            onClick={toggleSidebar}
            className="mx-auto flex items-center justify-center text-primary hover:opacity-80 transition-opacity"
            aria-label="Ouvrir le menu"
          >
            <Icons.logo className="h-7 w-7" />
          </button>
        ) : (
          <>
            <Link href="/dashboard" className="flex items-center gap-2.5 font-bold text-lg text-primary">
              <Icons.logo className="h-6 w-6 shrink-0" />
              <span className="truncate">MesFinances</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="ml-auto text-muted-foreground hover:text-foreground"
              aria-label="Réduire le menu"
            >
              <Icons.chevronLeft className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>

      {/* ── Navigation links ── */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1" aria-label="Navigation principale">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(`${item.href}/`))

          const linkEl = (
            <Link
              href={item.href}
              id={`nav-${item.href.replace('/', '')}`}
              className={cn(
                'flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                isCollapsed ? 'justify-center' : 'gap-3'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span>{item.title}</span>}
            </Link>
          )

          if (isCollapsed) {
            return (
              <Tooltip key={item.href}>
                {/* Base UI TooltipTrigger: use render prop to make it a transparent wrapper */}
                <TooltipTrigger render={<div />}>
                  {linkEl}
                </TooltipTrigger>
                <TooltipContent side="right">{item.title}</TooltipContent>
              </Tooltip>
            )
          }

          return <React.Fragment key={item.href}>{linkEl}</React.Fragment>
        })}
      </nav>

      {/* ── Footer (déconnexion) ── */}
      <div className="border-t p-3">
        {isCollapsed ? (
          <Tooltip>
            <TooltipTrigger render={<div />}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => signOut()}
                className="w-full text-muted-foreground hover:text-destructive"
                aria-label="Déconnexion"
              >
                <Icons.logout className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Déconnexion</TooltipContent>
          </Tooltip>
        ) : (
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
            onClick={() => signOut()}
          >
            <Icons.logout className="h-5 w-5" />
            <span>Déconnexion</span>
          </Button>
        )}
      </div>
    </aside>
  )
}
