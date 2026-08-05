'use client'

import * as React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { SplashScreen } from '@capacitor/splash-screen'
import { Capacitor } from '@capacitor/core'
import { storageService } from '@/lib/storage.service'
import { useAuthContext } from '@/features/auth/contexts/AuthContext'

export function MobileFlowProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading } = useAuthContext()
  const [initialized, setInitialized] = React.useState(
    !Capacitor.isNativePlatform()
  )

  React.useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return
    }

    async function initFlow() {
      if (loading) return

      try {
        const onboardingCompleted = await storageService.isOnboardingCompleted()

        if (!onboardingCompleted && pathname !== '/onboarding') {
          router.replace('/onboarding')
        } else if (onboardingCompleted && pathname === '/onboarding') {
          if (user) {
            router.replace('/dashboard')
          } else {
            router.replace('/login')
          }
        }
      } catch (err) {
        console.error('Error during mobile flow initialization:', err)
      } finally {
        setInitialized(true)
        try {
          await SplashScreen.hide()
        } catch {
          // Ignore if running on web browser
        }
      }
    }

    initFlow()
  }, [loading, pathname, router, user])

  if (!Capacitor.isNativePlatform()) {
    return <>{children}</>
  }

  if (loading || !initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f172a] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#10b981] border-t-transparent" />
          <p className="text-sm font-medium text-slate-400">Chargement...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
