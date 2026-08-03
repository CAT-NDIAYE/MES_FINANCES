'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Icons } from '@/components/ui/icons'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] =
    React.useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = React.useState(false)
  const [isIOS, setIsIOS] = React.useState(false)
  const [isStandalone, setIsStandalone] = React.useState(false)

  React.useEffect(() => {
    if (typeof window === 'undefined') return

    const standalone = window.matchMedia('(display-mode: standalone)').matches
    const ios = /iPad|iPhone|iPod/.test(window.navigator.userAgent)

    setIsStandalone(standalone)
    setIsIOS(ios)
    setIsInstalled(
      standalone || window.matchMedia('(display-mode: standalone)').matches
    )

    const handler = (event: Event) => {
      event.preventDefault()
      setDeferredPrompt(event as BeforeInstallPromptEvent)
    }

    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', () => setIsInstalled(true))

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  if (isInstalled || isStandalone) return null

  const handleInstall = async () => {
    if (!deferredPrompt) {
      return
    }

    await deferredPrompt.prompt()
  }

  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icons.download className="h-5 w-5" />
          Installer l’application
        </CardTitle>
        <CardDescription>
          Ajoutez MesFinances à votre écran d’accueil pour une expérience plus
          rapide.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {isIOS ? (
          <p className="text-sm text-muted-foreground">
            Sur iPhone, ouvrez le menu Partager puis « Ajouter à l’écran
            d’accueil ».
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Installez l’application pour l’utiliser comme une vraie app native.
          </p>
        )}
        {!isIOS && (
          <Button onClick={handleInstall} disabled={!deferredPrompt}>
            Installer l’application
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
