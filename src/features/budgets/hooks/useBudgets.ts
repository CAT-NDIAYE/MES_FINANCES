'use client'

import * as React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { budgetService } from '../services/budget.service'
import type {
  Budget,
  BudgetArchivedFilter,
  BudgetMonthFilter,
  BudgetStatusFilter,
  CreateBudgetInput,
  UpdateBudgetInput,
} from '../types'
import { calculateBudgetSummary } from '../utils/budget-calculations'

export function useBudgets() {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = React.useState('')
  const [statusFilter, setStatusFilter] =
    React.useState<BudgetStatusFilter>('all')
  const [monthFilter, setMonthFilter] = React.useState<BudgetMonthFilter>('all')
  const [categoryFilter, setCategoryFilter] = React.useState<string>('all')
  const [archivedFilter, setArchivedFilter] =
    React.useState<BudgetArchivedFilter>('active')
  const [sortKey, setSortKey] = React.useState<
    'category' | 'amount' | 'consumption' | 'date' | 'remaining'
  >('date')
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc')

  const {
    data: budgets = [],
    isLoading,
    isFetching,
    error: queryError,
    refetch,
  } = useQuery<Budget[]>({
    queryKey: ['budgets'],
    queryFn: () => budgetService.getBudgets(),
  })

  const summary = React.useMemo(
    () => calculateBudgetSummary(budgets),
    [budgets]
  )

  const filteredBudgets = React.useMemo(() => {
    let result = [...budgets]

    if (archivedFilter === 'active') {
      result = result.filter((budget) => !budget.is_archived)
    } else if (archivedFilter === 'archived') {
      result = result.filter((budget) => budget.is_archived)
    }

    if (statusFilter !== 'all') {
      result = result.filter((budget) => budget.status === statusFilter)
    }

    if (monthFilter !== 'all') {
      result = result.filter((budget) => String(budget.month) === monthFilter)
    }

    if (categoryFilter !== 'all') {
      result = result.filter((budget) => budget.category_id === categoryFilter)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      result = result.filter((budget) =>
        budget.category?.name?.toLowerCase().includes(query)
      )
    }

    result.sort((a, b) => {
      switch (sortKey) {
        case 'amount':
          return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount
        case 'consumption':
          return sortOrder === 'asc'
            ? a.percentage_used - b.percentage_used
            : b.percentage_used - a.percentage_used
        case 'remaining':
          return sortOrder === 'asc'
            ? a.remaining_amount - b.remaining_amount
            : b.remaining_amount - a.remaining_amount
        case 'category':
          return sortOrder === 'asc'
            ? (a.category?.name ?? '').localeCompare(b.category?.name ?? '')
            : (b.category?.name ?? '').localeCompare(a.category?.name ?? '')
        default:
          return sortOrder === 'asc'
            ? new Date(`${a.year}-${a.month}-01`).getTime() -
                new Date(`${b.year}-${b.month}-01`).getTime()
            : new Date(`${b.year}-${b.month}-01`).getTime() -
                new Date(`${a.year}-${a.month}-01`).getTime()
      }
    })

    return result
  }, [
    archivedFilter,
    budgets,
    categoryFilter,
    monthFilter,
    searchQuery,
    sortKey,
    sortOrder,
    statusFilter,
  ])

  const createMutation = useMutation({
    mutationFn: (input: CreateBudgetInput) => budgetService.createBudget(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      toast.success('Budget créé avec succès.')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de la création du budget.')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateBudgetInput }) =>
      budgetService.updateBudget(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      toast.success('Budget mis à jour avec succès.')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de la modification du budget.')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => budgetService.deleteBudget(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      toast.success('Budget supprimé avec succès.')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de la suppression du budget.')
    },
  })

  const archiveMutation = useMutation({
    mutationFn: (id: string) => budgetService.archiveBudget(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      toast.success('Budget archivé avec succès.')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de l’archivage du budget.')
    },
  })

  const restoreMutation = useMutation({
    mutationFn: (id: string) => budgetService.restoreBudget(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      toast.success('Budget restauré avec succès.')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de la restauration du budget.')
    },
  })

  return {
    budgets: filteredBudgets,
    loading:
      isLoading ||
      isFetching ||
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending ||
      archiveMutation.isPending ||
      restoreMutation.isPending,
    error: queryError ? (queryError as Error).message : null,
    createBudget: createMutation.mutateAsync,
    updateBudget: (id: string, input: UpdateBudgetInput) =>
      updateMutation.mutateAsync({ id, input }),
    deleteBudget: deleteMutation.mutateAsync,
    archiveBudget: archiveMutation.mutateAsync,
    restoreBudget: restoreMutation.mutateAsync,
    refresh: refetch,
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
  }
}
