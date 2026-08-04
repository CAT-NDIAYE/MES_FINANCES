'use client'

import * as React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { EmptyState } from '@/components/empty/EmptyState'
import { Spinner } from '@/components/feedback/Spinner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency } from '@/lib/utils'
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import type { Transaction } from '../types'

interface TransactionListProps {
  transactions: Transaction[]
  loading: boolean
  onEdit: (transaction: Transaction) => void
  onDelete: (transaction: Transaction) => void
}

export function TransactionList({
  transactions,
  loading,
  onEdit,
  onDelete,
}: TransactionListProps) {
  if (loading) {
    return (
      <div className="flex min-h-60 items-center justify-center rounded-xl border bg-background">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!transactions.length) {
    return (
      <EmptyState
        title="Aucune transaction"
        description="Ajoutez votre première transaction pour commencer à suivre vos finances."
        icon={ArrowDownRight}
        actionLabel="Ajouter"
        onAction={() => {}}
      />
    )
  }

  return (
    <>
      <div className="hidden lg:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <Badge
                    variant={
                      transaction.type === 'income' ? 'default' : 'secondary'
                    }
                  >
                    {transaction.type === 'income' ? 'Revenu' : 'Dépense'}
                  </Badge>
                </TableCell>
                <TableCell
                  className={
                    transaction.type === 'income'
                      ? 'text-emerald-600'
                      : 'text-rose-600'
                  }
                >
                  {formatCurrency(transaction.amount)}
                </TableCell>
                <TableCell>
                  {transaction.category?.name ?? 'Sans catégorie'}
                </TableCell>
                <TableCell>{transaction.description ?? '—'}</TableCell>
                <TableCell>
                  {new Date(transaction.transaction_date).toLocaleDateString(
                    'fr-FR'
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Actions pour ${transaction.description ?? 'transaction'}`}
                        />
                      }
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(transaction)}>
                        <Pencil className="mr-2 h-4 w-4" /> Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(transaction)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="grid gap-3 lg:hidden">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="rounded-xl border bg-background p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`rounded-full p-2 ${transaction.type === 'income' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}
                >
                  {transaction.type === 'income' ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <p className="font-medium">
                    {transaction.category?.name ?? 'Sans catégorie'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(transaction.transaction_date).toLocaleDateString(
                      'fr-FR'
                    )}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`font-semibold ${transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}
                >
                  {formatCurrency(transaction.amount)}
                </p>
              </div>
            </div>
            {transaction.description && (
              <p className="mt-3 text-sm text-muted-foreground">
                {transaction.description}
              </p>
            )}
            <div className="mt-4 flex items-center justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Actions pour ${transaction.description ?? 'transaction'}`}
                    />
                  }
                >
                  <MoreHorizontal className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(transaction)}>
                    <Pencil className="mr-2 h-4 w-4" /> Modifier
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(transaction)}>
                    <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
