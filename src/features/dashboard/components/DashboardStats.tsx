'use client'

import * as React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Icons } from '@/components/ui/icons'
import { formatCurrency } from '@/lib/utils'
import type { DashboardSummary } from '../types'

interface DashboardStatsProps {
  summary: DashboardSummary | undefined
}

export function DashboardStats({ summary }: DashboardStatsProps) {
  if (!summary) return null

  const stats = [
    {
      title: 'Solde actuel',
      value: formatCurrency(summary.balance),
      icon: Icons.wallet,
      tone: summary.balance >= 0 ? 'text-emerald-600' : 'text-rose-600',
    },
    {
      title: 'Revenus du mois',
      value: formatCurrency(summary.totalIncome),
      icon: Icons.arrowUp,
      tone: 'text-emerald-600',
    },
    {
      title: 'Dépenses du mois',
      value: formatCurrency(summary.totalExpense),
      icon: Icons.arrowDown,
      tone: 'text-rose-600',
    },
    {
      title: 'Transactions',
      value: summary.transactionCount,
      icon: Icons.transactions,
      tone: 'text-sky-600',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="rounded-2xl">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="mt-2 text-xl font-semibold">{stat.value}</p>
              </div>
              <div className={`rounded-full bg-muted p-3 ${stat.tone}`}>
                <Icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
