'use client'

import * as React from 'react'
import { PageContainer, PageHeader } from '@/components/layout'
import {
  CategoryList,
  CreateCategoryDialog,
  EditCategoryDialog,
  DeleteCategoryDialog,
} from '@/features/categories/components'
import { useCategories, CategoryFilterType, CategorySortKey } from '@/features/categories/hooks/useCategories'
import { Category } from '@/features/categories/types'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PageLoader } from '@/components/feedback'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { cn } from '@/lib/utils'

export default function CategoriesPage() {
  const {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    archiveCategory,
    restoreCategory,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    sortKey,
    setSortKey,
  } = useCategories()

  // États pour les modales d'édition et de suppression
  const [editingCategory, setEditingCategory] = React.useState<Category | null>(null)
  const [deletingCategory, setDeletingCategory] = React.useState<Category | null>(null)

  // Filtres disponibles
  const filters: { label: string; value: CategoryFilterType }[] = [
    { label: 'Toutes', value: 'all' },
    { label: 'Actives', value: 'active' },
    { label: 'Dépenses', value: 'expense' },
    { label: 'Revenus', value: 'income' },
    { label: 'Archivées', value: 'archived' },
  ]

  return (
    <PageContainer>
      {/* En-tête de la page */}
      <PageHeader
        title="Catégories"
        description="Gérez vos catégories personnalisées de revenus et de dépenses."
        action={
          <CreateCategoryDialog onCreate={createCategory} isLoading={loading} />
        }
      />

      {/* Gestion des erreurs de requêtes */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Barre de Filtres & Recherche & Tri */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b">
        {/* Filtres par type / état */}
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <Button
              key={f.value}
              variant={filterType === f.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType(f.value)}
              className={cn(
                'rounded-full',
                filterType === f.value && 'bg-primary text-primary-foreground'
              )}
            >
              {f.label}
            </Button>
          ))}
        </div>

        {/* Tri */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <span className="text-xs text-muted-foreground whitespace-nowrap">Trier par :</span>
          <Select
            value={sortKey}
            onValueChange={(val) => setSortKey(val as any)}
          >
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Nom</SelectItem>
              <SelectItem value="created_at">Date de création</SelectItem>
              <SelectItem value="updated_at">Date de modification</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Rendu principal de la liste des catégories */}
      {loading && categories.length === 0 ? (
        <PageLoader />
      ) : (
        <CategoryList
          categories={categories}
          isLoading={loading}
          onEdit={setEditingCategory}
          onDelete={setDeletingCategory}
          onArchive={archiveCategory}
          onRestore={restoreCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onAddClick={() => {
            // Un hack propre pour ouvrir la modale d'ajout
            const addBtn = document.querySelector('[data-slot="button"]') as HTMLButtonElement
            if (addBtn) addBtn.click()
          }}
        />
      )}

      {/* Modale d'Édition */}
      <EditCategoryDialog
        category={editingCategory}
        onClose={() => setEditingCategory(null)}
        onUpdate={(values) => {
          if (editingCategory) {
            return updateCategory(editingCategory.id, values)
          }
          return Promise.resolve()
        }}
        isLoading={loading}
      />

      {/* Modale de Suppression */}
      <DeleteCategoryDialog
        category={deletingCategory}
        onClose={() => setDeletingCategory(null)}
        onDelete={deleteCategory}
        onArchive={archiveCategory}
        isLoading={loading}
      />
    </PageContainer>
  )
}
