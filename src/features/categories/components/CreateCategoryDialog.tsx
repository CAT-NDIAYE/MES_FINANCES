'use client'

import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { CategoryForm } from './CategoryForm'
import { CategoryFormValues } from '../schemas/category.schema'

interface CreateCategoryDialogProps {
  onCreate: (values: CategoryFormValues) => Promise<unknown>
  isLoading?: boolean
}

export function CreateCategoryDialog({
  onCreate,
  isLoading,
}: CreateCategoryDialogProps) {
  const [open, setOpen] = React.useState(false)

  const handleSubmit = async (values: CategoryFormValues) => {
    try {
      await onCreate(values)
      setOpen(false)
    } catch {
      // Toast errors are handled by the mutation in useCategories
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Base UI DialogTrigger — renders as a <button> by default, no asChild needed */}
      <DialogTrigger
        render={
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            <span>Nouvelle catégorie</span>
          </Button>
        }
      />
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Ajouter une catégorie</DialogTitle>
          <DialogDescription>
            Créez une catégorie personnalisée pour organiser vos flux
            financiers.
          </DialogDescription>
        </DialogHeader>
        <CategoryForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          onCancel={() => setOpen(false)}
          submitLabel="Créer"
        />
      </DialogContent>
    </Dialog>
  )
}
