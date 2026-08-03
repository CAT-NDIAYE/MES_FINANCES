'use client'

import * as React from 'react'
import { BreadcrumbNav } from './BreadcrumbNav'
import { Input } from '@/components/ui/input'
import { Icons } from '@/components/ui/icons'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/features/auth/hooks/useAuth'
import Link from 'next/link'

/**
 * Navbar
 * Barre supérieure desktop (>= md). Contient le fil d'Ariane,
 * un champ de recherche global, une notification factice et le
 * menu utilisateur (dropdown).
 *
 * Note: Uses Base UI primitives (not Radix), no `asChild` prop.
 * The `render` prop is used to compose custom trigger elements.
 */
export function Navbar() {
  const { user, signOut } = useAuth()
  const initial = user?.email?.charAt(0).toUpperCase() || 'U'

  return (
    <header className="hidden md:flex h-16 shrink-0 items-center gap-4 border-b bg-background px-6">
      {/* Left: Breadcrumb */}
      <div className="flex flex-1 items-center gap-4">
        <BreadcrumbNav />
      </div>

      {/* Right: search, notification, avatar */}
      <div className="flex items-center gap-3">
        <div className="relative w-56 lg:w-72">
          <Icons.search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Rechercher..."
            className="bg-muted/50 pl-8 rounded-full h-9 text-sm"
          />
        </div>

        <button
          className="relative rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Notifications"
        >
          <Icons.bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
        </button>

        {/* User dropdown — Base UI does not support asChild; use render prop instead */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Menu utilisateur"
              />
            }
          >
            <Avatar className="h-8 w-8 border cursor-pointer hover:opacity-80 transition-opacity">
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                {initial}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="font-normal">
              <p className="text-sm font-medium truncate">{user?.email || 'Utilisateur'}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              render={<Link href="/settings" className="flex items-center w-full" />}
            >
              <Icons.settings className="mr-2 h-4 w-4" />
              Paramètres
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive cursor-pointer"
              onClick={() => signOut()}
            >
              <Icons.logout className="mr-2 h-4 w-4" />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
