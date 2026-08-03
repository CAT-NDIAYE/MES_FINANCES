'use client'

import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TransactionForm } from './TransactionForm'
import type { Transaction } from '../types'
import type { TransactionFormValues } from '../schemas/transaction.schema'

interface TransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: TransactionFormValues) => Promise<void> | void
  isLoading?: boolean
  transaction?: Transaction | null
}

export function TransactionDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  transaction,
}: TransactionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-120">
        <DialogHeader>
          <DialogTitle>
            {transaction ? 'Modifier transaction' : 'Nouvelle transaction'}
          </DialogTitle>
          <DialogDescription>
            {transaction
              ? 'Mettez à jour les informations de la transaction.'
              : 'Enregistrez un revenu ou une dépense.'}
          </DialogDescription>
        </DialogHeader>
        <TransactionForm
          editingTransaction={transaction}
          onSubmit={async (values) => {
            await onSubmit(values)
            onOpenChange(false)
          }}
          isLoading={isLoading}
          submitLabel={
            transaction
              ? 'Enregistrer les modifications'
              : 'Créer la transaction'
          }
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
