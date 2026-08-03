'use client'

import * as React from 'react'
import { Category } from '../types'
import { renderCategoryIcon } from './IconPicker'
import { DataTable } from '@/components/tables'
import { BaseCard } from '@/components/cards'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Icons } from '@/components/ui/icons'
import { EmptyState } from '@/components/empty'

interface CategoryListProps {
  categories: Category[]
  isLoading: boolean
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
  onArchive: (id: string) => void
  onRestore: (id: string) => void
  searchQuery: string
  setSearchQuery: (val: string) => void
  onAddClick: () => void
}

export function CategoryList({
  categories,
  isLoading,
  onEdit,
  onDelete,
  onArchive,
  onRestore,
  searchQuery,
  setSearchQuery,
  onAddClick,
}: CategoryListProps) {
  if (categories.length === 0 && !searchQuery) {
    return (
      <EmptyState
        title="Aucune catégorie"
        description="Vous n'avez pas encore configuré de catégories pour vos finances."
        icon={Icons.categories}
        actionLabel="Ajouter une catégorie"
        onAction={onAddClick}
      />
    )
  }

  if (categories.length === 0 && searchQuery) {
    return (
      <EmptyState
        title="Aucun résultat"
        description="Aucune catégorie ne correspond à votre recherche."
        icon={Icons.search}
        actionLabel="Effacer la recherche"
        onAction={() => setSearchQuery('')}
      />
    )
  }

  return (
    <div className="space-y-4">
      {/* ── Desktop: Table ── */}
      <div className="hidden md:block">
        <DataTable
          searchPlaceholder="Rechercher une catégorie..."
          onSearch={setSearchQuery}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 text-center">Icône</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="w-12 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="text-center">
                    <span
                      className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-black/10 text-white"
                      style={{ backgroundColor: category.color || '#9CA3AF' }}
                    >
                      {renderCategoryIcon(category.icon, 'h-4 w-4')}
                    </span>
                  </TableCell>
                  <TableCell className="font-semibold">{category.name}</TableCell>
                  <TableCell>
                    {category.type === 'expense' ? (
                      <Badge className="bg-red-500/10 text-red-600 border-none">Dépense</Badge>
                    ) : (
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-none">Revenu</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-[200px] truncate text-sm">
                    {category.description || '—'}
                  </TableCell>
                  <TableCell>
                    {category.is_archived ? (
                      <Badge variant="outline" className="text-gray-500">Archivée</Badge>
                    ) : (
                      <Badge variant="outline" className="border-emerald-300 text-emerald-600">Active</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {/* Base UI DropdownMenuTrigger — use render prop, not asChild */}
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Menu actions de ${category.name}`}
                          />
                        }
                      >
                        <Icons.moreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(category)}>
                          <Icons.settings className="mr-2 h-4 w-4 text-muted-foreground" />
                          Modifier
                        </DropdownMenuItem>
                        {category.is_archived ? (
                          <DropdownMenuItem onClick={() => onRestore(category.id)}>
                            <Icons.check className="mr-2 h-4 w-4 text-emerald-500" />
                            Restaurer
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => onArchive(category.id)}>
                            <Icons.archive className="mr-2 h-4 w-4 text-amber-500" />
                            Archiver
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => onDelete(category)}
                        >
                          <Icons.delete className="mr-2 h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DataTable>
      </div>

      {/* ── Mobile: Cards ── */}
      <div className="md:hidden space-y-3">
        {categories.map((category) => (
          <BaseCard
            key={category.id}
            title={
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-black/10 text-white shrink-0"
                  style={{ backgroundColor: category.color || '#9CA3AF' }}
                >
                  {renderCategoryIcon(category.icon, 'h-4 w-4')}
                </span>
                <div>
                  <p className="font-semibold text-sm">{category.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate max-w-[180px]">
                    {category.description || 'Pas de description'}
                  </p>
                </div>
              </div>
            }
            action={
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Menu actions de ${category.name}`}
                    />
                  }
                >
                  <Icons.moreVertical className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(category)}>
                    <Icons.settings className="mr-2 h-4 w-4" />
                    Modifier
                  </DropdownMenuItem>
                  {category.is_archived ? (
                    <DropdownMenuItem onClick={() => onRestore(category.id)}>
                      <Icons.check className="mr-2 h-4 w-4 text-emerald-500" />
                      Restaurer
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={() => onArchive(category.id)}>
                      <Icons.archive className="mr-2 h-4 w-4 text-amber-500" />
                      Archiver
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => onDelete(category)}
                  >
                    <Icons.delete className="mr-2 h-4 w-4" />
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            }
          >
            <div className="flex justify-between items-center text-xs mt-2 pt-2 border-t">
              <span className="text-muted-foreground">Type :</span>
              {category.type === 'expense' ? (
                <Badge className="bg-red-500/10 text-red-600 border-none">Dépense</Badge>
              ) : (
                <Badge className="bg-emerald-500/10 text-emerald-600 border-none">Revenu</Badge>
              )}
            </div>
            <div className="flex justify-between items-center text-xs mt-1.5">
              <span className="text-muted-foreground">Statut :</span>
              {category.is_archived ? (
                <Badge variant="outline" className="text-gray-500">Archivée</Badge>
              ) : (
                <Badge variant="outline" className="border-emerald-300 text-emerald-600">Active</Badge>
              )}
            </div>
          </BaseCard>
        ))}
      </div>
    </div>
  )
}
