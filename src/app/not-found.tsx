'use client'

import * as React from 'react'
import { EmptyState } from '@/components/empty'
import { Icons } from '@/components/ui/icons'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <EmptyState
        title="Page introuvable"
        description="Désolé, la page que vous recherchez n'existe pas ou a été déplacée."
        icon={Icons.search}
        actionLabel="Retourner à l'accueil"
        onAction={() => router.push('/')}
      />
    </div>
  )
}
