'use client'

import * as React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { SplashScreen } from '@capacitor/splash-screen'
import { Capacitor } from '@capacitor/core'
import { storageService } from '@/lib/storage.service'
import { useAuthContext } from '@/features/auth/contexts/AuthContext'

/**
 * MobileFlowProvider
 * Gère le flux d'onboarding et de redirection spécifique au mobile.
 * Utilise un affichage conditionnel qui ne bloque pas le rendu des enfants
 * pour éviter les erreurs d'hydratation et de hooks.
 */
export function MobileFlowProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading } = useAuthContext()

  const [mounted, setMounted] = React.useState(false)
  const [initialized, setInitialized] = React.useState(false)

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (!mounted || loading) return

    async function initFlow() {
      if (!Capacitor.isNativePlatform()) {
        setInitialized(true)
        return
      }

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
        } catch {}
      }
    }

    initFlow()
  }, [mounted, loading, pathname, router, user])

  // Rendu constant des enfants pour éviter le mismatch de hooks
  // On utilise un overlay pour le chargement
  return (
    <>
      {(!mounted || loading || !initialized) && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0f172a] text-white">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#10b981] border-t-transparent" />
            <p className="text-sm font-medium text-slate-400">Chargement...</p>
          </div>
        </div>
      )}
      <div className={(!mounted || loading || !initialized) ? 'invisible' : 'visible contents'}>
        {children}
      </div>
    </>
  )
}
