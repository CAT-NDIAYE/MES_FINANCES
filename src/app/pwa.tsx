'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'
import { PWAProvider } from '@/components/pwa/PWAProvider'

export default function PWAClientShell({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  React.useEffect(() => {
    if (typeof window === 'undefined') return

    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.ready.then(() => {
          if (navigator.serviceWorker.controller) {
            window.dispatchEvent(new Event('sw-updated'))
          }
        })
      })
    }
  }, [pathname])

  return <PWAProvider>{children}</PWAProvider>
}
