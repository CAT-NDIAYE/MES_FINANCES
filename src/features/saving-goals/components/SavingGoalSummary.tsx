'use client'

import * as React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import type { SavingGoalSummary } from '../types'

interface SavingGoalSummaryProps {
  summary: SavingGoalSummary
}

export function SavingGoalSummaryCard({ summary }: SavingGoalSummaryProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Objectifs</p>
          <p className="text-2xl font-semibold">{summary.totalGoals}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">À atteindre</p>
          <p className="text-2xl font-semibold">
            {summary.totalTargetAmount} €
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Déjà épargné</p>
          <p className="text-2xl font-semibold">{summary.totalSavedAmount} €</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Progression globale</p>
          <p className="text-2xl font-semibold">{summary.overallProgress}%</p>
        </CardContent>
      </Card>
    </div>
  )
}
