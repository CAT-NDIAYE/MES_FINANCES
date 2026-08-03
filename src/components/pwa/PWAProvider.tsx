'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { InstallPWA } from '@/components/pwa/InstallPWA'
import { NetworkStatusBanner } from '@/components/pwa/NetworkStatusBanner'
import { PWAUpdatePrompt } from '@/components/pwa/PWAUpdatePrompt'

export function PWAProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    if (typeof window === 'undefined') return

    const handleUpdate = () => {
      window.dispatchEvent(new Event('pwa-update-available'))
    }

    window.addEventListener('sw-updated', handleUpdate)

    return () => window.removeEventListener('sw-updated', handleUpdate)
  }, [])

  return (
    <>
      <NetworkStatusBanner />
      <PWAUpdatePrompt />
      {children}
      <div className="mx-auto mt-6 w-full max-w-5xl px-4 pb-6">
        <InstallPWA />
      </div>
    </>
  )
}
