'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type { RecentTransactionItem } from '../types'

interface RecentTransactionsProps {
  transactions: RecentTransactionItem[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Dernières transactions</CardTitle>
        <Button variant="ghost" size="sm">
          Voir tout
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {transactions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aucune transaction récente.
          </p>
        ) : (
          transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between rounded-xl border p-3"
            >
              <div className="flex flex-1 min-w-0 items-center gap-3">
                <div
                  className={`rounded-full p-2 ${transaction.type === 'income' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}
                >
                  {transaction.type === 'income' ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {transaction.category_name ?? 'Sans catégorie'}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {transaction.description ?? 'Aucune description'}
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p
                  className={`font-semibold ${transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}
                >
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(transaction.transaction_date).toLocaleDateString(
                    'fr-FR'
                  )}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
