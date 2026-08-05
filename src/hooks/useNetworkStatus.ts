'use client'

import * as React from 'react'

import { Capacitor } from '@capacitor/core'
import { Network } from '@capacitor/network'

interface NetworkStatusState {
  isOnline: boolean
  isOffline: boolean
  connectionType: string | null
}

export function useNetworkStatus() {
  const [status, setStatus] = React.useState<NetworkStatusState>({
    isOnline: true,
    isOffline: false,
    connectionType: null,
  })

  React.useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      const getInitialStatus = async () => {
        try {
          const info = await Network.getStatus()
          setStatus({
            isOnline: info.connected,
            isOffline: !info.connected,
            connectionType: info.connectionType,
          })
        } catch (e) {
          console.error('Error fetching native connection status:', e)
        }
      }

      getInitialStatus()

      const handler = Network.addListener('networkStatusChange', (info) => {
        setStatus({
          isOnline: info.connected,
          isOffline: !info.connected,
          connectionType: info.connectionType,
        })
      })

      return () => {
        handler.then((h) => h.remove())
      }
    }

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
