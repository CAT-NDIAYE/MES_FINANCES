'use client'

import * as React from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Icons } from '@/components/ui/icons'
import { useNetworkStatus } from '@/hooks/useNetworkStatus'

export function NetworkStatusBanner() {
  const { isOnline, isOffline } = useNetworkStatus()

  if (isOnline) return null

  return (
    <Alert className="border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300">
      <Icons.wifiOff className="h-4 w-4" />
      <AlertTitle>Connexion perdue</AlertTitle>
      <AlertDescription>
        Vous êtes actuellement hors ligne. Certaines fonctionnalités seront
        limitées.
      </AlertDescription>
    </Alert>
  )
}
