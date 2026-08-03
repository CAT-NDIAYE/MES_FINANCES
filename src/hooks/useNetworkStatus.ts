'use client'

import * as React from 'react'

interface NetworkStatusState {
  isOnline: boolean
  isOffline: boolean
  connectionType: string | null
}

export function useNetworkStatus() {
  const [status, setStatus] = React.useState<NetworkStatusState>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isOffline: typeof navigator !== 'undefined' ? !navigator.onLine : false,
    connectionType:
      typeof navigator !== 'undefined' && 'connection' in navigator
        ? ((
            navigator as Navigator & { connection?: { effectiveType?: string } }
          ).connection?.effectiveType ?? null)
        : null,
  })

  React.useEffect(() => {
    const updateStatus = () => {
      const online = typeof navigator !== 'undefined' ? navigator.onLine : true
      const connectionType =
        typeof navigator !== 'undefined' && 'connection' in navigator
          ? ((
              navigator as Navigator & {
                connection?: { effectiveType?: string }
              }
            ).connection?.effectiveType ?? null)
          : null

      setStatus({
        isOnline: online,
        isOffline: !online,
        connectionType,
      })
    }

    updateStatus()
    window.addEventListener('online', updateStatus)
    window.addEventListener('offline', updateStatus)

    return () => {
      window.removeEventListener('online', updateStatus)
      window.removeEventListener('offline', updateStatus)
    }
  }, [])

  return status
}
