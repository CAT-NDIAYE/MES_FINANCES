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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Budget, CreateBudgetInput, UpdateBudgetInput } from '../types'

interface BudgetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (
    values: CreateBudgetInput | UpdateBudgetInput
  ) => Promise<void> | void
  isLoading?: boolean
  budget?: Budget | null
  categories: Array<{ id: string; name: string }>
}

export function BudgetDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  budget,
  categories,
}: BudgetDialogProps) {
  const [categoryId, setCategoryId] = React.useState(budget?.category_id ?? '')
  const [amount, setAmount] = React.useState(String(budget?.amount ?? ''))
  const [month, setMonth] = React.useState(
    String(budget?.month ?? new Date().getMonth() + 1)
  )
  const [year, setYear] = React.useState(
    String(budget?.year ?? new Date().getFullYear())
  )
  const [alertPercentage, setAlertPercentage] = React.useState(
    String(budget?.alert_percentage ?? 80)
  )

  React.useEffect(() => {
    if (open) {
      setCategoryId(budget?.category_id ?? '')
      setAmount(String(budget?.amount ?? ''))
      setMonth(String(budget?.month ?? new Date().getMonth() + 1))
      setYear(String(budget?.year ?? new Date().getFullYear()))
      setAlertPercentage(String(budget?.alert_percentage ?? 80))
    }
  }, [budget, open])

  const handleSubmit = async () => {
    const parsedAmount = Number(amount)
    const parsedMonth = Number(month)
    const parsedYear = Number(year)
    const parsedAlert = Number(alertPercentage)

    if (
      !categoryId ||
      !parsedAmount ||
      parsedAmount <= 0 ||
      parsedMonth < 1 ||
      parsedMonth > 12 ||
      parsedYear < 2000 ||
      parsedAlert < 0 ||
      parsedAlert > 100
    ) {
      return
    }

    await onSubmit({
      category_id: categoryId,
      month: parsedMonth,
      year: parsedYear,
      amount: parsedAmount,
      alert_percentage: parsedAlert,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-130">
        <DialogHeader>
          <DialogTitle>
            {budget ? 'Modifier le budget' : 'Nouveau budget'}
          </DialogTitle>
          <DialogDescription>
            {budget
              ? 'Mettez à jour les paramètres du budget.'
              : 'Définissez un budget mensuel pour une catégorie.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Catégorie</label>
            <Select value={categoryId} onValueChange={(val) => setCategoryId(val as string)}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Montant</label>
              <Input
                type="number"
                min="0"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Seuil d’alerte (%)</label>
              <Input
                type="number"
                min="0"
                max="100"
                value={alertPercentage}
                onChange={(event) => setAlertPercentage(event.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Mois</label>
              <Input
                type="number"
                min="1"
                max="12"
                value={month}
                onChange={(event) => setMonth(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Année</label>
              <Input
                type="number"
                min="2000"
                value={year}
                onChange={(event) => setYear(event.target.value)}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Enregistrement...' : budget ? 'Enregistrer' : 'Créer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
