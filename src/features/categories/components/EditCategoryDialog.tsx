'use client'

import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CategoryForm } from './CategoryForm'
import { Category } from '../types'
import { CategoryFormValues } from '../schemas/category.schema'

interface EditCategoryDialogProps {
  category: Category | null
  onClose: () => void
  onUpdate: (values: CategoryFormValues) => Promise<any>
  isLoading?: boolean
}

export function EditCategoryDialog({
  category,
  onClose,
  onUpdate,
  isLoading,
}: EditCategoryDialogProps) {
  const handleSubmit = async (values: CategoryFormValues) => {
    try {
      await onUpdate(values)
      onClose()
    } catch (err) {
      // Géré par la mutation
    }
  }

  return (
    <Dialog open={!!category} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier la catégorie</DialogTitle>
          <DialogDescription>
            Ajustez les propriétés de la catégorie sélectionnée.
          </DialogDescription>
        </DialogHeader>
        {category && (
          <CategoryForm
            defaultValues={{
              name: category.name,
              type: category.type,
              icon: category.icon || 'Wallet',
              color: category.color || '#10B981',
              description: category.description || '',
              sort_order: category.sort_order,
            }}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            onCancel={onClose}
            submitLabel="Mettre à jour"
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
