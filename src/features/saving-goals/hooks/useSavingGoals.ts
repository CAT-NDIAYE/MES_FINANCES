'use client'

import * as React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { savingGoalService } from '../services/saving-goal.service'
import type {
  AddSavingsInput,
  CreateSavingGoalInput,
  SavingGoal,
  SavingGoalSortKey,
  SavingGoalSortOrder,
  SavingGoalStatusFilter,
  UpdateSavingGoalInput,
  WithdrawSavingsInput,
} from '../types'
import { calculateSavingGoalSummary } from '../utils/saving-goal-calculations'

export function useSavingGoals() {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = React.useState('')
  const [statusFilter, setStatusFilter] =
    React.useState<SavingGoalStatusFilter>('all')
  const [archivedFilter, setArchivedFilter] = React.useState<
    'all' | 'active' | 'archived'
  >('active')
  const [sortKey, setSortKey] = React.useState<SavingGoalSortKey>('deadline')
  const [sortOrder, setSortOrder] = React.useState<SavingGoalSortOrder>('asc')

  const {
    data: savingGoals = [],
    isLoading,
    isFetching,
    error: queryError,
    refetch,
  } = useQuery<SavingGoal[]>({
    queryKey: ['saving-goals'],
    queryFn: () => savingGoalService.getSavingGoals(),
  })

  const summary = React.useMemo(
    () => calculateSavingGoalSummary(savingGoals),
    [savingGoals]
  )

  const filteredGoals = React.useMemo(() => {
    let result = [...savingGoals]

    if (archivedFilter === 'active') {
      result = result.filter((goal) => !goal.is_archived)
    } else if (archivedFilter === 'archived') {
      result = result.filter((goal) => goal.is_archived)
    }

    if (statusFilter === 'active') {
      result = result.filter((goal) => !goal.is_archived && !goal.is_completed)
    } else if (statusFilter === 'completed') {
      result = result.filter((goal) => goal.is_completed)
    } else if (statusFilter === 'overdue') {
      result = result.filter((goal) => goal.status === 'behind')
    } else if (statusFilter === 'archived') {
      result = result.filter((goal) => goal.is_archived)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      result = result.filter((goal) => {
        const haystack = `${goal.name} ${goal.description ?? ''}`.toLowerCase()
        return haystack.includes(query)
      })
    }

    result.sort((a, b) => {
      switch (sortKey) {
        case 'name':
          return sortOrder === 'asc'
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name)
        case 'target_amount':
          return sortOrder === 'asc'
            ? a.target_amount - b.target_amount
            : b.target_amount - a.target_amount
        case 'remaining':
          return sortOrder === 'asc'
            ? a.remaining_amount - b.remaining_amount
            : b.remaining_amount - a.remaining_amount
        case 'progress':
          return sortOrder === 'asc'
            ? a.progress_percentage - b.progress_percentage
            : b.progress_percentage - a.progress_percentage
        case 'created_at':
          return sortOrder === 'asc'
            ? new Date(a.created_at).getTime() -
                new Date(b.created_at).getTime()
            : new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
        default:
          return sortOrder === 'asc'
            ? new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
            : new Date(b.deadline).getTime() - new Date(a.deadline).getTime()
      }
    })

    return result
  }, [
    archivedFilter,
    savingGoals,
    searchQuery,
    sortKey,
    sortOrder,
    statusFilter,
  ])

  const createMutation = useMutation({
    mutationFn: (input: CreateSavingGoalInput) =>
      savingGoalService.createSavingGoal(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saving-goals'] })
      toast.success('Objectif créé avec succès.')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de la création de l’objectif.')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateSavingGoalInput }) =>
      savingGoalService.updateSavingGoal(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saving-goals'] })
      toast.success('Objectif mis à jour avec succès.')
    },
    onError: (error: Error) => {
      toast.error(
        error.message || 'Erreur lors de la modification de l’objectif.'
      )
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => savingGoalService.deleteSavingGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saving-goals'] })
      toast.success('Objectif supprimé avec succès.')
    },
    onError: (error: Error) => {
      toast.error(
        error.message || 'Erreur lors de la suppression de l’objectif.'
      )
    },
  })

  const archiveMutation = useMutation({
    mutationFn: (id: string) => savingGoalService.archiveSavingGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saving-goals'] })
      toast.success('Objectif archivé avec succès.')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de l’archivage de l’objectif.')
    },
  })

  const restoreMutation = useMutation({
    mutationFn: (id: string) => savingGoalService.restoreSavingGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saving-goals'] })
      toast.success('Objectif restauré avec succès.')
    },
    onError: (error: Error) => {
      toast.error(
        error.message || 'Erreur lors de la restauration de l’objectif.'
      )
    },
  })

  const addSavingsMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: AddSavingsInput }) =>
      savingGoalService.addSavings(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saving-goals'] })
      toast.success('Épargne ajoutée avec succès.')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de l’ajout d’épargne.')
    },
  })

  const withdrawMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: WithdrawSavingsInput }) =>
      savingGoalService.withdrawSavings(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saving-goals'] })
      toast.success('Retrait enregistré avec succès.')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors du retrait d’épargne.')
    },
  })

  return {
    savingGoals: filteredGoals,
    loading:
      isLoading ||
      isFetching ||
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending ||
      archiveMutation.isPending ||
      restoreMutation.isPending ||
      addSavingsMutation.isPending ||
      withdrawMutation.isPending,
    error: queryError ? (queryError as Error).message : null,
    createSavingGoal: createMutation.mutateAsync,
    updateSavingGoal: (id: string, input: UpdateSavingGoalInput) =>
      updateMutation.mutateAsync({ id, input }),
    deleteSavingGoal: deleteMutation.mutateAsync,
    archiveSavingGoal: archiveMutation.mutateAsync,
    restoreSavingGoal: restoreMutation.mutateAsync,
    addSavings: (id: string, input: AddSavingsInput) =>
      addSavingsMutation.mutateAsync({ id, input }),
    withdrawSavings: (id: string, input: WithdrawSavingsInput) =>
      withdrawMutation.mutateAsync({ id, input }),
    refresh: refetch,
    summary,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    archivedFilter,
    setArchivedFilter,
    sortKey,
    setSortKey,
    sortOrder,
    setSortOrder,
  }
}
