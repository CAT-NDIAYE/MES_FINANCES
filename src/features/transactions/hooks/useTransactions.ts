'use client'

import * as React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { transactionService } from '../services/transaction.service'
import type {
  CreateTransactionInput,
  Transaction,
  TransactionDateFilter,
  TransactionFilterMode,
  TransactionListParams,
  TransactionListResponse,
  TransactionSortKey,
  TransactionSortOrder,
  UpdateTransactionInput,
} from '../types'

const defaultParams = {
  page: 1,
  pageSize: 10,
  search: '',
  type: 'all' as TransactionFilterMode,
  dateFilter: 'all' as TransactionDateFilter,
  categoryId: null as string | null,
  minAmount: null as number | null,
  maxAmount: null as number | null,
  sortKey: 'transaction_date' as TransactionSortKey,
  sortOrder: 'desc' as TransactionSortOrder,
}

export function useTransactions() {
  const queryClient = useQueryClient()
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [typeFilter, setTypeFilter] =
    React.useState<TransactionFilterMode>('all')
  const [dateFilter, setDateFilter] =
    React.useState<TransactionDateFilter>('all')
  const [categoryId, setCategoryId] = React.useState<string | null>(null)
  const [minAmount, setMinAmount] = React.useState<number | null>(null)
  const [maxAmount, setMaxAmount] = React.useState<number | null>(null)
  const [sortKey, setSortKey] =
    React.useState<TransactionSortKey>('transaction_date')
  const [sortOrder, setSortOrder] = React.useState<TransactionSortOrder>('desc')

  const params = React.useMemo<TransactionListParams>(
    () => ({
      page,
      pageSize,
      search: searchQuery,
      type: typeFilter,
      dateFilter,
      categoryId,
      minAmount,
      maxAmount,
      sortKey,
      sortOrder,
    }),
    [
      categoryId,
      dateFilter,
      maxAmount,
      minAmount,
      page,
      pageSize,
      searchQuery,
      sortKey,
      sortOrder,
      typeFilter,
    ]
  )

  const queryKey = React.useMemo(() => ['transactions', params], [params])

  const {
    data,
    isLoading,
    isFetching,
    error: queryError,
    refetch,
  } = useQuery<TransactionListResponse>({
    queryKey,
    queryFn: () => transactionService.getTransactions(params),
    placeholderData: (previousData) => previousData,
  })

  const updateCache = React.useCallback(
    (updater: (items: Transaction[]) => Transaction[]) => {
      queryClient.setQueriesData(
        { queryKey: ['transactions'] },
        (previous: TransactionListResponse | undefined) => {
          if (!previous?.items) {
            return previous
          }

          const nextItems = updater(previous.items)
          return {
            ...previous,
            items: nextItems,
            total: Math.max(previous.total, nextItems.length),
            summary: {
              ...previous.summary,
              count: nextItems.length,
            },
          }
        }
      )
    },
    [queryClient]
  )

  const createMutation = useMutation({
    mutationFn: (input: CreateTransactionInput) =>
      transactionService.createTransaction(input),
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: ['transactions'] })

      const optimisticTransaction: Transaction = {
        id: `temp-${Date.now()}`,
        user_id: 'pending',
        category_id: input.category_id,
        amount: input.amount,
        type: input.type,
        description: input.description ?? null,
        transaction_date: input.transaction_date,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        category: null,
      }

      updateCache((items) => [optimisticTransaction, ...items])
      return { optimisticTransaction }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      toast.success('Transaction ajoutée avec succès.')
    },
    onError: (error: Error) => {
      toast.error(
        error.message || 'Erreur réseau lors de la création de la transaction.'
      )
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string
      input: UpdateTransactionInput
    }) => transactionService.updateTransaction(id, input),
    onMutate: async ({ id, input }) => {
      await queryClient.cancelQueries({ queryKey: ['transactions'] })
      updateCache((items) =>
        items.map((item) =>
          item.id === id
            ? {
                ...item,
                ...input,
                amount: input.amount ?? item.amount,
                type: input.type ?? item.type,
                transaction_date:
                  input.transaction_date ?? item.transaction_date,
                description: input.description ?? item.description,
                updated_at: new Date().toISOString(),
              }
            : item
        )
      )
      return { id }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      toast.success('Transaction mise à jour avec succès.')
    },
    onError: (error: Error) => {
      toast.error(
        error.message ||
          'Erreur réseau lors de la modification de la transaction.'
      )
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => transactionService.deleteTransaction(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['transactions'] })
      updateCache((items) => items.filter((item) => item.id !== id))
      return { id }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      toast.success('Transaction supprimée avec succès.')
    },
    onError: (error: Error) => {
      toast.error(
        error.message ||
          'Erreur serveur lors de la suppression de la transaction.'
      )
    },
  })

  const searchTransactions = React.useCallback((query: string) => {
    setSearchQuery(query)
    setPage(1)
  }, [])

  const filterTransactions = React.useCallback(
    (value: TransactionFilterMode) => {
      setTypeFilter(value)
      setPage(1)
    },
    []
  )

  const sortTransactions = React.useCallback(
    (key: TransactionSortKey, order: TransactionSortOrder) => {
      setSortKey(key)
      setSortOrder(order)
      setPage(1)
    },
    []
  )

  return {
    transactions: data?.items ?? [],
    total: data?.total ?? 0,
    page,
    setPage,
    pageSize,
    setPageSize,
    summary: data?.summary ?? {
      totalIncome: 0,
      totalExpense: 0,
      balance: 0,
      count: 0,
    },
    loading:
      isLoading ||
      isFetching ||
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
    error: queryError ? (queryError as Error).message : null,
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
    createTransaction: createMutation.mutateAsync,
    updateTransaction: (id: string, input: UpdateTransactionInput) =>
      updateMutation.mutateAsync({ id, input }),
    deleteTransaction: deleteMutation.mutateAsync,
    refresh: refetch,
  }
}
