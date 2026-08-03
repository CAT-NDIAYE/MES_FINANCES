'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Icons } from '@/components/ui/icons'

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-md border-border/70 shadow-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Icons.wifiOff className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl">
            Vous êtes actuellement hors connexion.
          </CardTitle>
          <CardDescription>
            Vérifiez votre connexion internet puis réessayez d’ouvrir
            l’application.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button className="w-full" onClick={() => window.location.reload()}>
            Réessayer
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Certaines données peuvent déjà être disponibles en cache local.
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
