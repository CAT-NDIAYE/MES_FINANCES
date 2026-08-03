'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type {
  CreateSavingGoalInput,
  SavingGoal,
  UpdateSavingGoalInput,
} from '../types'

interface SavingGoalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (
    values: CreateSavingGoalInput | UpdateSavingGoalInput
  ) => Promise<void> | void
  isLoading?: boolean
  goal?: SavingGoal | null
}

export function SavingGoalDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  goal,
}: SavingGoalDialogProps) {
  const [name, setName] = React.useState(goal?.name ?? '')
  const [icon, setIcon] = React.useState(goal?.icon ?? '')
  const [color, setColor] = React.useState(goal?.color ?? '#22c55e')
  const [description, setDescription] = React.useState(goal?.description ?? '')
  const [targetAmount, setTargetAmount] = React.useState(
    String(goal?.target_amount ?? '')
  )
  const [currentAmount, setCurrentAmount] = React.useState(
    String(goal?.current_amount ?? '')
  )
  const [deadline, setDeadline] = React.useState(goal?.deadline ?? '')

  React.useEffect(() => {
    if (open) {
      setName(goal?.name ?? '')
      setIcon(goal?.icon ?? '')
      setColor(goal?.color ?? '#22c55e')
      setDescription(goal?.description ?? '')
      setTargetAmount(String(goal?.target_amount ?? ''))
      setCurrentAmount(String(goal?.current_amount ?? ''))
      setDeadline(goal?.deadline ?? '')
    }
  }, [goal, open])

  const handleSubmit = async () => {
    const parsedTarget = Number(targetAmount)
    const parsedCurrent = Number(currentAmount)

    if (!name.trim() || !parsedTarget || parsedTarget <= 0 || !deadline) {
      return
    }

    if (parsedCurrent < 0 || parsedCurrent > parsedTarget) {
      return
    }

    await onSubmit({
      name: name.trim(),
      icon: icon.trim() || null,
      color: color || '#22c55e',
      description: description.trim() || null,
      target_amount: parsedTarget,
      current_amount: parsedCurrent,
      deadline,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {goal ? 'Modifier l’objectif' : 'Nouvel objectif'}
          </DialogTitle>
          <DialogDescription>
            {goal
              ? 'Mettez à jour les informations de votre objectif.'
              : 'Définissez un nouvel objectif d’épargne.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nom</label>
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Icône</label>
              <Input
                value={icon}
                onChange={(event) => setIcon(event.target.value)}
                placeholder="ex. 🎯"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Montant cible</label>
              <Input
                type="number"
                min="1"
                value={targetAmount}
                onChange={(event) => setTargetAmount(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Montant actuel</label>
              <Input
                type="number"
                min="0"
                value={currentAmount}
                onChange={(event) => setCurrentAmount(event.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Couleur</label>
              <Input
                type="color"
                value={color}
                onChange={(event) => setColor(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date cible</label>
              <Input
                type="date"
                value={deadline}
                onChange={(event) => setDeadline(event.target.value)}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Enregistrement...' : goal ? 'Enregistrer' : 'Créer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
