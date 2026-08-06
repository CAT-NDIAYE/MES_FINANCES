'use client'

import * as React from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuth } from '@/features/auth/hooks/useAuth'

interface MobileHeaderProps {
  title: string
  action?: React.ReactNode
}

/**
 * MobileHeader
 * Barre supérieure mobile (< md), fixe en haut.
 * Affiche le titre de la page courante et l'avatar de l'utilisateur.
 */
export function MobileHeader({ title, action }: MobileHeaderProps) {
  const { user } = useAuth()
  const initial = user?.email?.charAt(0).toUpperCase() || 'U'

  return (
    <header className="md:hidden sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pt-[env(safe-area-inset-top,0px)]">
      <div className="flex h-14 items-center justify-between px-4">
        <h1 className="text-lg font-semibold tracking-tight truncate flex-1 min-w-0 mr-2">{title}</h1>
        <div className="flex items-center gap-2 shrink-0">
          {action}
          <Avatar className="h-8 w-8 border">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              {initial}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
