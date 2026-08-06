'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PageLoader } from '@/components/feedback'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirection vers le dashboard par défaut
    // Le MobileFlowProvider s'occupera de rediriger vers l'onboarding si nécessaire
    router.replace('/dashboard')
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f172a] text-white">
      <PageLoader />
    </div>
  )
}
