'use client'

import * as React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Wallet } from 'lucide-react'

export function DashboardEmptyState() {
  return (
    <Card className="rounded-2xl border-dashed">
      <CardContent className="flex flex-col items-center justify-center gap-4 p-10 text-center">
        <div className="rounded-full bg-muted p-4">
          <Wallet className="h-8 w-8" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">
            Commencez par enregistrer votre première transaction.
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Votre tableau de bord prendra vie dès que vous ajouterez vos
            premiers revenus ou dépenses.
          </p>
        </div>
        <Button>Ajouter une transaction</Button>
      </CardContent>
    </Card>
  )
}
