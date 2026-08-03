'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface PWAUpdatePromptProps {
  onUpdate?: () => void
}

export function PWAUpdatePrompt({ onUpdate }: PWAUpdatePromptProps) {
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    if (typeof window === 'undefined') return

    const handler = () => {
      setVisible(true)
      toast.success('Une mise à jour est disponible.')
    }

    window.addEventListener('pwa-update-available', handler)

    return () => window.removeEventListener('pwa-update-available', handler)
  }, [])

  if (!visible) return null

  return (
    <Card className="border-primary/30 bg-primary/5 shadow-sm">
      <CardHeader>
        <CardTitle>Mise à jour disponible</CardTitle>
        <CardDescription>
          Une nouvelle version de MesFinances est prête. Mettez à jour pour
          profiter des améliorations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={() => {
            if (onUpdate) {
              onUpdate()
            }
            window.location.reload()
          }}
        >
          Mettre à jour
        </Button>
      </CardContent>
    </Card>
  )
}
