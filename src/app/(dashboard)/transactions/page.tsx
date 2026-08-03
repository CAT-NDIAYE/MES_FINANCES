'use client'

import * as React from 'react'
import { PageContainer, PageHeader } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Plus, RefreshCw } from 'lucide-react'
import { useTransactions } from '@/features/transactions/hooks/useTransactions'
import {
  DeleteTransactionDialog,
  TransactionDialog,
  TransactionFilters,
  TransactionList,
  TransactionPagination,
  TransactionSummaryCard,
} from '@/features/transactions/components'
import type { Transaction } from '@/features/transactions/types'
import type { TransactionFormValues } from '@/features/transactions/schemas/transaction.schema'

export default function TransactionsPage() {
  const {
    transactions,
    loading,
    summary,
    page,
    setPage,
    pageSize,
    setPageSize,
    searchQuery,
    searchTransactions,
    typeFilter,
    filterTransactions,
    dateFilter,
    setDateFilter,
    categoryId,
    setCategoryId,
    minAmount,
    setMinAmount,
    maxAmount,
    setMaxAmount,
    sortKey,
    sortOrder,
    sortTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    refresh,
    total,
  } = useTransactions()

  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingTransaction, setEditingTransaction] =
    React.useState<Transaction | null>(null)
  const [deletingTransaction, setDeletingTransaction] =
    React.useState<Transaction | null>(null)
  const [pendingAction, setPendingAction] = React.useState(false)

  const handleCreate = async (values: TransactionFormValues) => {
    setPendingAction(true)
    try {
      await createTransaction(values)
      setEditingTransaction(null)
    } finally {
      setPendingAction(false)
    }
  }

  const handleEdit = async (values: TransactionFormValues) => {
    if (!editingTransaction) return
    setPendingAction(true)
    try {
      await updateTransaction(editingTransaction.id, values)
      setEditingTransaction(null)
    } finally {
      setPendingAction(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingTransaction) return
    setPendingAction(true)
    try {
      await deleteTransaction(deletingTransaction.id)
      setDeletingTransaction(null)
    } finally {
      setPendingAction(false)
    }
  }

  const openCreateDialog = () => {
    setEditingTransaction(null)
    setIsDialogOpen(true)
  }

  const openEditDialog = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setIsDialogOpen(true)
  }

  return (
    <PageContainer>
      <PageHeader
        title="Transactions"
        description="Gérez vos revenus, dépenses, filtres et historique."
        action={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => refresh()}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Rafraîchir
            </Button>
            <Button onClick={openCreateDialog} className="gap-2">
              <Plus className="h-4 w-4" />
              Ajouter
            </Button>
          </div>
        }
      />

      <div className="space-y-6">
        <TransactionSummaryCard summary={summary} />

        <TransactionFilters
          searchQuery={searchQuery}
          onSearchChange={searchTransactions}
          typeFilter={typeFilter}
          onTypeChange={filterTransactions}
          dateFilter={dateFilter}
          onDateChange={setDateFilter}
          categoryId={categoryId}
          onCategoryChange={setCategoryId}
          minAmount={minAmount}
          onMinAmountChange={setMinAmount}
          maxAmount={maxAmount}
          onMaxAmountChange={setMaxAmount}
          sortKey={sortKey}
          onSortKeyChange={(key) => sortTransactions(key, sortOrder)}
          sortOrder={sortOrder}
          onSortOrderChange={(order) => sortTransactions(sortKey, order)}
          onReset={() => {
            searchTransactions('')
            filterTransactions('all')
            setDateFilter('all')
            setCategoryId(null)
            setMinAmount(null)
            setMaxAmount(null)
            sortTransactions('transaction_date', 'desc')
            setPage(1)
          }}
        />

        <div className="overflow-hidden rounded-xl border bg-background">
          <TransactionList
            transactions={transactions}
            loading={loading}
            onEdit={openEditDialog}
            onDelete={(transaction) => setDeletingTransaction(transaction)}
          />

          <TransactionPagination
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={setPage}
            onPageSizeChange={(value) => {
              setPageSize(value)
              setPage(1)
            }}
          />
        </div>
      </div>

      <TransactionDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) {
            setEditingTransaction(null)
          }
        }}
        onSubmit={editingTransaction ? handleEdit : handleCreate}
        isLoading={pendingAction}
        transaction={editingTransaction}
      />

      <DeleteTransactionDialog
        open={Boolean(deletingTransaction)}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingTransaction(null)
          }
        }}
        onConfirm={handleDelete}
        isLoading={pendingAction}
      />
    </PageContainer>
  )
}
