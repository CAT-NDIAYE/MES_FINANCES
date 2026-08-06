'use client'

import * as React from 'react'
import { PageContainer, PageHeader } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Plus, RefreshCw } from 'lucide-react'
import { useBudgets } from '@/features/budgets/hooks/useBudgets'
import { useCategories } from '@/features/categories/hooks/useCategories'
import {
  BudgetDialog,
  BudgetFilters,
  BudgetList,
  BudgetSummaryCard,
  DeleteBudgetDialog,
} from '@/features/budgets/components'
import type {
  Budget,
  CreateBudgetInput,
  UpdateBudgetInput,
} from '@/features/budgets/types'

export default function BudgetsPage() {
  const {
    budgets,
    loading,
    error,
    createBudget,
    updateBudget,
    deleteBudget,
    archiveBudget,
    restoreBudget,
    refresh,
    summary,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    monthFilter,
    setMonthFilter,
    categoryFilter,
    setCategoryFilter,
    archivedFilter,
    setArchivedFilter,
    sortKey,
    setSortKey,
    sortOrder,
    setSortOrder,
  } = useBudgets()

  const { categories } = useCategories()
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingBudget, setEditingBudget] = React.useState<Budget | null>(null)
  const [deletingBudget, setDeletingBudget] = React.useState<Budget | null>(
    null
  )
  const [pendingAction, setPendingAction] = React.useState(false)

  const months = React.useMemo(
    () => Array.from({ length: 12 }, (_, index) => String(index + 1)),
    []
  )

  const categoryOptions = React.useMemo(
    () =>
      categories
        .filter((category) => !category.is_archived)
        .map((category) => ({ id: category.id, name: category.name })),
    [categories]
  )

  const handleCreate = async (
    values: CreateBudgetInput | UpdateBudgetInput
  ) => {
    setPendingAction(true)
    try {
      await createBudget(values as CreateBudgetInput)
      setEditingBudget(null)
      setIsDialogOpen(false)
    } finally {
      setPendingAction(false)
    }
  }

  const handleEdit = async (values: CreateBudgetInput | UpdateBudgetInput) => {
    if (!editingBudget) return
    setPendingAction(true)
    try {
      await updateBudget(editingBudget.id, values as UpdateBudgetInput)
      setEditingBudget(null)
      setIsDialogOpen(false)
    } finally {
      setPendingAction(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingBudget) return
    setPendingAction(true)
    try {
      await deleteBudget(deletingBudget.id)
      setDeletingBudget(null)
    } finally {
      setPendingAction(false)
    }
  }

  const handleArchive = async (budget: Budget) => {
    setPendingAction(true)
    try {
      await archiveBudget(budget.id)
    } finally {
      setPendingAction(false)
    }
  }

  const handleRestore = async (budget: Budget) => {
    setPendingAction(true)
    try {
      await restoreBudget(budget.id)
    } finally {
      setPendingAction(false)
    }
  }

  const openCreateDialog = () => {
    setEditingBudget(null)
    setIsDialogOpen(true)
  }

  const openEditDialog = (budget: Budget) => {
    setEditingBudget(budget)
    setIsDialogOpen(true)
  }

  return (
    <PageContainer>
      <PageHeader
        title="Budgets"
        description="Suivez vos limites de dépenses par catégorie et par mois."
        action={
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => refresh()}
            >
              <RefreshCw className="h-4 w-4" />
              Rafraîchir
            </Button>
            <Button className="gap-2" onClick={openCreateDialog}>
              <Plus className="h-4 w-4" />
              Ajouter
            </Button>
          </div>
        }
      />

      <div className="space-y-6">
        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <BudgetSummaryCard summary={summary} />

        <BudgetFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          monthFilter={monthFilter}
          onMonthChange={setMonthFilter}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          archivedFilter={archivedFilter}
          onArchivedChange={setArchivedFilter}
          sortKey={sortKey}
          onSortKeyChange={setSortKey}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
          months={months}
          categories={categoryOptions}
          onReset={() => {
            setSearchQuery('')
            setStatusFilter('all')
            setMonthFilter('all')
            setCategoryFilter('all')
            setArchivedFilter('active')
            setSortKey('date')
            setSortOrder('desc')
          }}
        />

        <BudgetList
          budgets={budgets}
          loading={loading}
          onEdit={openEditDialog}
          onDelete={(budget) => setDeletingBudget(budget)}
          onArchive={handleArchive}
          onRestore={handleRestore}
          onCreate={openCreateDialog}
        />
      </div>

      <BudgetDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) {
            setEditingBudget(null)
          }
        }}
        onSubmit={editingBudget ? handleEdit : handleCreate}
        isLoading={pendingAction}
        budget={editingBudget}
        categories={categoryOptions}
      />

      <DeleteBudgetDialog
        open={Boolean(deletingBudget)}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingBudget(null)
          }
        }}
        onConfirm={handleDelete}
        isLoading={pendingAction}
      />
    </PageContainer>
  )
}
