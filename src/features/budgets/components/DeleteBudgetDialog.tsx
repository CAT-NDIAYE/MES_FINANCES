'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface DeleteBudgetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => Promise<void> | void
  isLoading?: boolean
}

export function DeleteBudgetDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: DeleteBudgetDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-105">
        <DialogHeader>
          <DialogTitle>Supprimer le budget</DialogTitle>
          <DialogDescription>
            Cette action supprimera définitivement le budget et son suivi
            associé.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={() => onConfirm()}
            disabled={isLoading}
          >
            {isLoading ? 'Suppression...' : 'Supprimer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
