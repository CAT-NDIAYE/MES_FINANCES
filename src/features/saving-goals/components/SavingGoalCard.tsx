'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Icons } from '@/components/ui/icons'
import type { SavingGoal } from '../types'

interface SavingGoalCardProps {
  goal: SavingGoal
  onEdit: (goal: SavingGoal) => void
  onDelete: (goal: SavingGoal) => void
  onArchive: (goal: SavingGoal) => void
  onRestore: (goal: SavingGoal) => void
  onAddSavings: (goal: SavingGoal) => void
  onWithdraw: (goal: SavingGoal) => void
}

export function SavingGoalCard({
  goal,
  onEdit,
  onDelete,
  onArchive,
  onRestore,
  onAddSavings,
  onWithdraw,
}: SavingGoalCardProps) {
  const accentColor = goal.color ?? '#22c55e'

  return (
    <Card className="overflow-hidden border-border/70 shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
        <div className="flex flex-1 min-w-0 items-center gap-3">
          <div
            className="flex shrink-0 h-10 w-10 items-center justify-center rounded-full text-lg"
            style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
          >
            {goal.icon ?? '🎯'}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{goal.name}</h3>
            <p className="text-sm text-muted-foreground truncate">
              {goal.description ?? 'Objectif d’épargne'}
            </p>
          </div>
        </div>
        <span
          className="shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium"
          style={{ borderColor: `${accentColor}50`, color: accentColor }}
        >
          {goal.status === 'completed'
            ? 'Atteint'
            : goal.status === 'behind'
              ? 'En retard'
              : goal.status === 'watching'
                ? 'À surveiller'
                : 'En bonne voie'}
        </span>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progression</span>
            <span className="font-medium">{goal.progress_percentage}%</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${goal.progress_percentage}%`,
                backgroundColor: accentColor,
              }}
            />
          </div>
        </div>

        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-lg border bg-muted/40 p-3">
            <p className="text-muted-foreground">Actuel</p>
            <p className="font-semibold">{goal.current_amount} €</p>
          </div>
          <div className="rounded-lg border bg-muted/40 p-3">
            <p className="text-muted-foreground">Cible</p>
            <p className="font-semibold">{goal.target_amount} €</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Icons.calendar className="h-4 w-4" />
            {goal.deadline}
          </span>
          <span className="inline-flex items-center gap-1">
            <Icons.arrowRight className="h-4 w-4" />
            {goal.days_remaining} jours restants
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onAddSavings(goal)}
          >
            Ajouter
          </Button>
          <Button size="sm" variant="outline" onClick={() => onWithdraw(goal)}>
            Retirer
          </Button>
          <Button size="sm" variant="outline" onClick={() => onEdit(goal)}>
            Modifier
          </Button>
          {goal.is_archived ? (
            <Button size="sm" variant="outline" onClick={() => onRestore(goal)}>
              Restaurer
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={() => onArchive(goal)}>
              Archiver
            </Button>
          )}
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(goal)}
          >
            Supprimer
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
