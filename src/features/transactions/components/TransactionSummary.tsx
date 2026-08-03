'use client'

import * as React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import type { TransactionSummary } from '../types'

interface TransactionSummaryProps {
  summary: TransactionSummary
}

export function TransactionSummaryCard({ summary }: TransactionSummaryProps) {
  return (
    <div className="grid gap-3 md:grid-cols-4">
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Total revenus</p>
          <p className="text-xl font-semibold text-emerald-600">
            {formatCurrency(summary.totalIncome)}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Total dépenses</p>
          <p className="text-xl font-semibold text-rose-600">
            {formatCurrency(summary.totalExpense)}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Solde</p>
          <p
            className={`text-xl font-semibold ${summary.balance >= 0 ? 'text-foreground' : 'text-rose-600'}`}
          >
            {formatCurrency(summary.balance)}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            Nombre de transactions
          </p>
          <p className="text-xl font-semibold">{summary.count}</p>
        </CardContent>
      </Card>
    </div>
  )
}
