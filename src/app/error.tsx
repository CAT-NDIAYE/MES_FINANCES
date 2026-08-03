'use client'

import * as React from 'react'
import { EmptyState } from '@/components/empty'
import { Icons } from '@/components/ui/icons'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    console.error('App Error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <EmptyState
        title="Une erreur est survenue"
        description="Un problème technique inattendu s'est produit. Nous nous en excusons."
        icon={Icons.error}
        actionLabel="Réessayer"
        onAction={() => reset()}
      />
    </div>
  )
}
