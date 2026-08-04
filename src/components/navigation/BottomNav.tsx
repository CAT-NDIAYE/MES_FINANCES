'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navigationConfig } from '@/config/navigation'
import { cn } from '@/lib/utils'

/**
 * BottomNav
 * Barre de navigation mobile fixée en bas de l'écran (visible < md).
 * Inspirée des applications bancaires modernes.
 * - Gère les Safe Areas via padding-bottom.
 * - Le bouton d'action primaire (➕) est mis en valeur.
 */
export function BottomNav() {
  const pathname = usePathname()
  const navItems = navigationConfig.filter((item) => item.showInBottomNav)

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      aria-label="Navigation mobile"
    >
      <div className="flex items-center justify-around h-16 px-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(`${item.href}/`))

          /* Bouton d'action primaire (flottant, accentué) */
          if (item.isPrimaryAction) {
            return (
              <div key={item.href} className="relative -mt-7" id="nav-new-transaction">
                <Link
                  href={item.href}
                  className="flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg ring-4 ring-background hover:bg-primary/90 transition-all active:scale-95"
                  aria-label={item.title}
                >
                  <item.icon className="w-6 h-6" />
                </Link>
              </div>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              id={`nav-${item.href.replace('/', '')}`}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <item.icon className={cn('w-5 h-5 transition-transform', isActive && 'scale-110')} />
              <span className="text-[10px] font-medium leading-tight">{item.title}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
