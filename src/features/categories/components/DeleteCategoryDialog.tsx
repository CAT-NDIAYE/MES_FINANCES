'use client'

import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Category } from '../types'
import { toast } from 'sonner'
import { AlertCircle } from 'lucide-react'

interface DeleteCategoryDialogProps {
  category: Category | null
  onClose: () => void
  onDelete: (id: string, force: boolean) => Promise<any>
  onArchive: (id: string) => Promise<any>
  isLoading?: boolean
}

export function DeleteCategoryDialog({
  category,
  onClose,
  onDelete,
  onArchive,
  isLoading,
}: DeleteCategoryDialogProps) {
  const [suggestArchive, setSuggestArchive] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)

  React.useEffect(() => {
    if (category) {
      setSuggestArchive(false)
    }
  }, [category])

  if (!category) return null

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      // Tenter une suppression normale (force = false)
      await onDelete(category.id, false)
      onClose()
    } catch (err: any) {
      if (err.message === 'USED_BY_TRANSACTIONS') {
        // La catégorie est liée à des transactions -> suggérer l'archivage
        setSuggestArchive(true)
      } else {
        toast.error(err.message || 'Une erreur est survenue.')
      }
    } finally {
      setIsDeleting(false)
    }
  }

  const handleArchive = async () => {
    setIsDeleting(true)
    try {
      await onArchive(category.id)
      onClose()
    } catch (err) {
      // L'erreur est gérée par la mutation
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={!!category} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className={suggestArchive ? 'text-amber-600' : 'text-destructive'}>
            {suggestArchive ? 'Archivage conseillé' : 'Confirmer la suppression'}
          </DialogTitle>
          <DialogDescription className="pt-2">
            {suggestArchive ? (
              <div className="flex gap-2 items-start text-sm text-amber-800 bg-amber-50 p-3 rounded-lg border border-amber-200">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <strong>Attention :</strong> Cette catégorie est utilisée par une ou plusieurs transactions.
                  Elle ne peut pas être supprimée définitivement sans fausser vos historiques.
                  Nous vous conseillons de l&apos;archiver.
                </div>
              </div>
            ) : (
              <span>
                Êtes-vous sûr de vouloir supprimer définitivement la catégorie <strong>{category.name}</strong> ?
                Cette action est irréversible.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose} disabled={isLoading || isDeleting}>
            Annuler
          </Button>
          {suggestArchive ? (
            <Button className="bg-amber-600 hover:bg-amber-500 text-white" onClick={handleArchive} disabled={isLoading || isDeleting}>
              {isDeleting ? 'Archivage...' : 'Archiver la catégorie'}
            </Button>
          ) : (
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading || isDeleting}>
              {isDeleting ? 'Suppression...' : 'Supprimer définitivement'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
