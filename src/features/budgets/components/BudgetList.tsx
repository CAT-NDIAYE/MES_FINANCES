'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/empty/EmptyState'
import { formatCurrency } from '@/lib/utils'
import { Archive, Edit3, Plus, Trash2 } from 'lucide-react'
import type { Budget } from '../types'
import { BudgetProgressBar } from './BudgetProgressBar'
import { calculateBudgetStatusMeta } from '../utils/budget-calculations'

interface BudgetListProps {
  budgets: Budget[]
  loading: boolean
  onEdit: (budget: Budget) => void
  onDelete: (budget: Budget) => void
  onArchive: (budget: Budget) => void
  onRestore: (budget: Budget) => void
  onCreate: () => void
}

export function BudgetList({
  budgets,
  loading,
  onEdit,
  onDelete,
  onArchive,
  onRestore,
  onCreate,
}: BudgetListProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border bg-background p-10 text-center text-sm text-muted-foreground">
        Chargement des budgets...
      </div>
    )
  }

  if (!budgets.length) {
    return (
      <EmptyState
        title="Aucun budget"
        description="Créez votre premier budget pour mieux contrôler vos dépenses."
        icon={Plus}
        actionLabel="Créer un budget"
        onAction={onCreate}
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="hidden lg:block overflow-hidden rounded-2xl border bg-background">
        <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr_0.8fr] border-b bg-muted/40 px-4 py-3 text-sm font-medium text-muted-foreground">
          <div>Catégorie</div>
          <div>Budget</div>
          <div>Dépensé</div>
          <div>Restant</div>
          <div>Progression</div>
          <div>Actions</div>
        </div>
        {budgets.map((budget) => {
          const statusMeta = calculateBudgetStatusMeta(budget.status)
          return (
            <div
              key={budget.id}
              className="grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr_0.8fr] items-center gap-3 border-b px-4 py-4 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground">
                  {budget.category?.icon ?? '📌'}
                </div>
                <div>
                  <p className="font-medium">
                    {budget.category?.name ?? 'Catégorie'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {budget.month}/{budget.year}
                  </p>
                </div>
              </div>
              <div className="font-medium">{formatCurrency(budget.amount)}</div>
              <div className="text-amber-600">
                {formatCurrency(budget.spent_amount)}
              </div>
              <div
                className={
                  budget.remaining_amount > 0
                    ? 'text-emerald-600'
                    : 'text-rose-600'
                }
              >
                {formatCurrency(budget.remaining_amount)}
              </div>
              <div>
                <BudgetProgressBar
                  value={budget.percentage_used}
                  showLabel={false}
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  {budget.percentage_used}% consommé
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={statusMeta.className}>
                  {statusMeta.label}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onEdit(budget)}
                  aria-label={`Modifier ${budget.category?.name ?? 'le budget'}`}
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onDelete(budget)}
                  aria-label={`Supprimer ${budget.category?.name ?? 'le budget'}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() =>
                    budget.is_archived ? onRestore(budget) : onArchive(budget)
                  }
                  aria-label={
                    budget.is_archived
                      ? 'Restaurer le budget'
                      : 'Archiver le budget'
                  }
                >
                  <Archive className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid gap-4 lg:hidden">
        {budgets.map((budget) => {
          const statusMeta = calculateBudgetStatusMeta(budget.status)
          return (
            <div
              key={budget.id}
              className="rounded-2xl border bg-background p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-1 min-w-0 items-center gap-3">
                  <div className="flex shrink-0 h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground">
                    {budget.category?.icon ?? '📌'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">
                      {budget.category?.name ?? 'Catégorie'}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {budget.month}/{budget.year}
                    </p>
                  </div>
                </div>
                <Badge className={`${statusMeta.className} shrink-0`}>
                  {statusMeta.label}
                </Badge>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Budget</span>
                  <span className="font-medium">
                    {formatCurrency(budget.amount)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Consommé</span>
                  <span className="font-medium text-amber-600">
                    {formatCurrency(budget.spent_amount)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Restant</span>
                  <span
                    className={`font-medium ${budget.remaining_amount > 0 ? 'text-emerald-600' : 'text-rose-600'}`}
                  >
                    {formatCurrency(budget.remaining_amount)}
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <BudgetProgressBar value={budget.percentage_used} />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Button
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={() => onEdit(budget)}
                >
                  <Edit3 className="h-4 w-4" />
                  Modifier
                </Button>
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() =>
                    budget.is_archived ? onRestore(budget) : onArchive(budget)
                  }
                  aria-label={budget.is_archived ? 'Restaurer' : 'Archiver'}
                >
                  <Archive className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => onDelete(budget)}
                  aria-label="Supprimer"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
