import * as React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Icons } from '@/components/ui/icons'
import { cn } from '@/lib/utils'

interface DataTableProps extends React.HTMLAttributes<HTMLDivElement> {
  searchPlaceholder?: string
  onSearch?: (value: string) => void
  children: React.ReactNode
  pagination?: React.ReactNode
  isEmpty?: boolean
  emptyState?: React.ReactNode
}

/**
 * DataTable
 * Wrapper de table moderne incluant une zone de recherche, la table et la pagination.
 */
export function DataTable({
  className,
  searchPlaceholder,
  onSearch,
  children,
  pagination,
  isEmpty,
  emptyState,
  ...props
}: DataTableProps) {
  return (
    <div className={cn('w-full space-y-4', className)} {...props}>
      {/* Barre d'outils (recherche, etc.) */}
      {onSearch && (
        <div className="flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Icons.search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={searchPlaceholder || 'Rechercher...'}
              className="pl-8"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Conteneur de la table avec bordure et scroll horizontal pour le mobile */}
      <div className="rounded-md border bg-card overflow-hidden">
        <div className="w-full overflow-auto">
          {isEmpty && emptyState ? (
            <div className="p-8 text-center">{emptyState}</div>
          ) : (
            children
          )}
        </div>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-end space-x-2 py-4">
          {pagination}
        </div>
      )}
    </div>
  )
}
