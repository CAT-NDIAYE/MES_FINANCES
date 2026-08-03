'use client'

import * as React from 'react'
import { formatCurrency } from '@/lib/utils'
import type { BudgetSummary } from '../types'

interface BudgetSummaryCardProps {
  summary: BudgetSummary
}

export function BudgetSummaryCard({ summary }: BudgetSummaryCardProps) {
  const cards = [
    {
      label: 'Budgets',
      value: summary.totalBudgets,
      accent: 'text-foreground',
    },
    {
      label: 'Budgété',
      value: formatCurrency(summary.totalBudgeted),
      accent: 'text-primary',
    },
    {
      label: 'Dépensé',
      value: formatCurrency(summary.totalSpent),
      accent: 'text-amber-600',
    },
    {
      label: 'Restant',
      value: formatCurrency(summary.totalRemaining),
      accent: 'text-emerald-600',
    },
    {
      label: 'Dépassés',
      value: summary.exceededBudgets,
      accent: 'text-rose-600',
    },
  ]

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-2xl border bg-background p-4 shadow-sm"
        >
          <p className="text-sm text-muted-foreground">{card.label}</p>
          <p className={`mt-2 text-xl font-semibold ${card.accent}`}>
            {card.value}
          </p>
        </div>
      ))}
    </div>
  )
}
