'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react'
import type {
  BudgetArchivedFilter,
  BudgetMonthFilter,
  BudgetStatusFilter,
} from '../types'

interface BudgetFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  statusFilter: BudgetStatusFilter
  onStatusChange: (value: BudgetStatusFilter) => void
  monthFilter: BudgetMonthFilter
  onMonthChange: (value: BudgetMonthFilter) => void
  categoryFilter: string
  onCategoryChange: (value: string) => void
  archivedFilter: BudgetArchivedFilter
  onArchivedChange: (value: BudgetArchivedFilter) => void
  sortKey: string
  onSortKeyChange: (value: string) => void
  sortOrder: 'asc' | 'desc'
  onSortOrderChange: (value: 'asc' | 'desc') => void
  months: string[]
  categories: Array<{ id: string; name: string }>
  onReset: () => void
}

export function BudgetFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  monthFilter,
  onMonthChange,
  categoryFilter,
  onCategoryChange,
  archivedFilter,
  onArchivedChange,
  sortKey,
  onSortKeyChange,
  sortOrder,
  onSortOrderChange,
  months,
  categories,
  onReset,
}: BudgetFiltersProps) {
  return (
    <div className="space-y-4 rounded-2xl border bg-background p-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Rechercher une catégorie"
            className="pl-9"
          />
        </div>
        <Button
          variant="outline"
          className="gap-2"
          type="button"
          onClick={onReset}
        >
          <RotateCcw className="h-4 w-4" />
          Réinitialiser
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Select
          value={statusFilter}
          onValueChange={(value) => onStatusChange(value as BudgetStatusFilter)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="État" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="warning">Attention</SelectItem>
            <SelectItem value="over">Dépassé</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={monthFilter}
          onValueChange={(value) => onMonthChange(value as BudgetMonthFilter)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Mois" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les mois</SelectItem>
            {months.map((month) => (
              <SelectItem key={month} value={month}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={categoryFilter}
          onValueChange={(value) => onCategoryChange(value)}
        >
          <SelectTrigger className="w-[170px]">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={archivedFilter}
          onValueChange={(value) =>
            onArchivedChange(value as BudgetArchivedFilter)
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Archivés" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Actifs</SelectItem>
            <SelectItem value="archived">Archivés</SelectItem>
            <SelectItem value="all">Tous</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={sortKey}
          onValueChange={(value) => onSortKeyChange(value)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="category">Catégorie</SelectItem>
            <SelectItem value="amount">Montant</SelectItem>
            <SelectItem value="consumption">Pourcentage</SelectItem>
            <SelectItem value="remaining">Montant restant</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={sortOrder}
          onValueChange={(value) => onSortOrderChange(value as 'asc' | 'desc')}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Ordre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Décroissant</SelectItem>
            <SelectItem value="asc">Croissant</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
