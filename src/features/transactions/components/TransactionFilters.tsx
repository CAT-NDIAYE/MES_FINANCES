'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useCategories } from '@/features/categories/hooks/useCategories'
import type {
  TransactionDateFilter,
  TransactionFilterMode,
  TransactionSortKey,
  TransactionSortOrder,
} from '../types'

interface TransactionFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  typeFilter: TransactionFilterMode
  onTypeChange: (value: TransactionFilterMode) => void
  dateFilter: TransactionDateFilter
  onDateChange: (value: TransactionDateFilter) => void
  categoryId: string | null
  onCategoryChange: (value: string | null) => void
  minAmount: number | null
  onMinAmountChange: (value: number | null) => void
  maxAmount: number | null
  onMaxAmountChange: (value: number | null) => void
  sortKey: TransactionSortKey
  onSortKeyChange: (value: TransactionSortKey) => void
  sortOrder: TransactionSortOrder
  onSortOrderChange: (value: TransactionSortOrder) => void
  onReset: () => void
}

export function TransactionFilters({
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeChange,
  dateFilter,
  onDateChange,
  categoryId,
  onCategoryChange,
  minAmount,
  onMinAmountChange,
  maxAmount,
  onMaxAmountChange,
  sortKey,
  onSortKeyChange,
  sortOrder,
  onSortOrderChange,
  onReset,
}: TransactionFiltersProps) {
  const { categories } = useCategories()
  const visibleCategories = React.useMemo(
    () => categories.filter((category) => !category.is_archived),
    [categories]
  )

  return (
    <div className="space-y-4 rounded-xl border bg-background p-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-55">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher une transaction"
            className="pl-9"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2" type="button">
          <SlidersHorizontal className="h-4 w-4" />
          Filtres
        </Button>
        <Button
          variant="ghost"
          className="gap-2"
          type="button"
          onClick={onReset}
        >
          <X className="h-4 w-4" />
          Réinitialiser
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="space-y-2">
          <Label>Type</Label>
          <Select
            value={typeFilter}
            onValueChange={(value) =>
              onTypeChange(value as any)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              <SelectItem value="income">Revenus</SelectItem>
              <SelectItem value="expense">Dépenses</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Période</Label>
          <Select
            value={dateFilter}
            onValueChange={(value) =>
              onDateChange(value as any)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              <SelectItem value="today">Aujourd'hui</SelectItem>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
              <SelectItem value="year">Cette année</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Catégorie</Label>
          <Select
            value={categoryId ?? 'all'}
            onValueChange={(value) =>
              onCategoryChange(value === 'all' ? null : value)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Toutes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              {visibleCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Trier par</Label>
          <Select
            value={sortKey}
            onValueChange={(value) =>
              onSortKeyChange(value as any)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="transaction_date">Date</SelectItem>
              <SelectItem value="amount">Montant</SelectItem>
              <SelectItem value="category_name">Nom de catégorie</SelectItem>
              <SelectItem value="created_at">Date de création</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Ordre</Label>
          <Select
            value={sortOrder}
            onValueChange={(value) =>
              onSortOrderChange(value as any)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascendant</SelectItem>
              <SelectItem value="desc">Descendant</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Montant min</Label>
          <Input
            type="number"
            step="0.01"
            value={minAmount ?? ''}
            onChange={(e) =>
              onMinAmountChange(e.target.value ? Number(e.target.value) : null)
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Montant max</Label>
          <Input
            type="number"
            step="0.01"
            value={maxAmount ?? ''}
            onChange={(e) =>
              onMaxAmountChange(e.target.value ? Number(e.target.value) : null)
            }
          />
        </div>
      </div>
    </div>
  )
}
