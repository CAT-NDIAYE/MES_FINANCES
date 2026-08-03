'use client'

import * as React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { categoryService } from '../services/category.service'
import { Category, CreateCategoryInput, UpdateCategoryInput } from '../types'
import { toast } from 'sonner'

export type CategoryFilterType = 'all' | 'expense' | 'income' | 'archived' | 'active'
export type CategorySortKey = 'name' | 'created_at' | 'updated_at'

export function useCategories() {
  const queryClient = useQueryClient()
  
  // États locaux de filtrage et tri
  const [searchQuery, setSearchQuery] = React.useState('')
  const [filterType, setFilterType] = React.useState<CategoryFilterType>('active')
  const [sortKey, setSortKey] = React.useState<CategorySortKey>('name')

  // Requête TanStack Query
  const {
    data: allCategories = [],
    isLoading,
    isRefetching,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getCategories(),
  })

  // Mutations
  const createMutation = useMutation({
    mutationFn: (input: CreateCategoryInput) => categoryService.createCategory(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Catégorie créée avec succès.')
    },
    onError: (err: any) => {
      toast.error(err.message || 'Une erreur est survenue.')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateCategoryInput }) =>
      categoryService.updateCategory(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Catégorie mise à jour avec succès.')
    },
    onError: (err: any) => {
      toast.error(err.message || 'Une erreur est survenue.')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: ({ id, force }: { id: string; force?: boolean }) =>
      categoryService.deleteCategory(id, force),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Catégorie supprimée définitivement.')
    },
    onError: (err: any) => {
      // Le composant gèrera l'erreur "USED_BY_TRANSACTIONS" pour afficher le dialogue d'archivage
      if (err.message !== 'USED_BY_TRANSACTIONS') {
        toast.error(err.message || 'Une erreur est survenue lors de la suppression.')
      }
    },
  })

  const archiveMutation = useMutation({
    mutationFn: (id: string) => categoryService.archiveCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Catégorie archivée avec succès.')
    },
    onError: (err: any) => {
      toast.error(err.message || 'Impossible d\'archiver la catégorie.')
    },
  })

  const restoreMutation = useMutation({
    mutationFn: (id: string) => categoryService.restoreCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Catégorie restaurée avec succès.')
    },
    onError: (err: any) => {
      toast.error(err.message || 'Impossible de restaurer la catégorie.')
    },
  })

  // Filtrage et tri des catégories côté client pour plus de réactivité
  const categories = React.useMemo(() => {
    let result = [...allCategories]

    // 1. Filtrage par type / état
    if (filterType === 'expense') {
      result = result.filter((c) => c.type === 'expense' && !c.is_archived)
    } else if (filterType === 'income') {
      result = result.filter((c) => c.type === 'income' && !c.is_archived)
    } else if (filterType === 'archived') {
      result = result.filter((c) => c.is_archived)
    } else if (filterType === 'active') {
      result = result.filter((c) => !c.is_archived)
    }

    // 2. Recherche textuelle (nom et description)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.description && c.description.toLowerCase().includes(q))
      )
    }

    // 3. Tri
    result.sort((a, b) => {
      if (sortKey === 'name') {
        return a.name.localeCompare(b.name)
      }
      if (sortKey === 'created_at') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
      if (sortKey === 'updated_at') {
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      }
      return 0
    })

    return result
  }, [allCategories, filterType, searchQuery, sortKey])

  return {
    categories,
    loading:
      isLoading ||
      isRefetching ||
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending ||
      archiveMutation.isPending ||
      restoreMutation.isPending,
    error: queryError ? (queryError as Error).message : null,
    
    // Actions CRUD
    createCategory: createMutation.mutateAsync,
    updateCategory: (id: string, input: UpdateCategoryInput) =>
      updateMutation.mutateAsync({ id, input }),
    deleteCategory: (id: string, force?: boolean) =>
      deleteMutation.mutateAsync({ id, force }),
    archiveCategory: archiveMutation.mutateAsync,
    restoreCategory: restoreMutation.mutateAsync,
    
    // Utilitaires de recherche / filtrage / tri
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    sortKey,
    setSortKey,
    refresh: refetch,
  }
}
