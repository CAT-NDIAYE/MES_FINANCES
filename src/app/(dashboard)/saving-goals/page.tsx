'use client'

import * as React from 'react'
import { PageContainer, PageHeader } from '@/components/layout'
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
import { EmptyState } from '@/components/empty'
import { Icons } from '@/components/ui/icons'
import { useSavingGoals } from '@/features/saving-goals/hooks/useSavingGoals'
import { SavingGoalCard } from '@/features/saving-goals/components/SavingGoalCard'
import { SavingGoalDialog } from '@/features/saving-goals/components/SavingGoalDialog'
import { SavingGoalSummaryCard } from '@/features/saving-goals/components/SavingGoalSummary'
import type { SavingGoal } from '@/features/saving-goals/types'

export default function SavingGoalsPage() {
  const {
    savingGoals,
    loading,
    error,
    createSavingGoal,
    updateSavingGoal,
    deleteSavingGoal,
    archiveSavingGoal,
    restoreSavingGoal,
    addSavings,
    withdrawSavings,
    refresh,
    summary,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    archivedFilter,
    setArchivedFilter,
    sortKey,
    setSortKey,
    sortOrder,
    setSortOrder,
  } = useSavingGoals()

  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [selectedGoal, setSelectedGoal] = React.useState<SavingGoal | null>(
    null
  )
  const [actionGoal, setActionGoal] = React.useState<SavingGoal | null>(null)
  const [amount, setAmount] = React.useState('')
  const [comment, setComment] = React.useState('')
  const [actionType, setActionType] = React.useState<'add' | 'withdraw'>('add')

  const handleCreateOrUpdate = async (values: any) => {
    if (selectedGoal) {
      await updateSavingGoal(selectedGoal.id, values)
    } else {
      await createSavingGoal(values)
    }
    setDialogOpen(false)
    setSelectedGoal(null)
  }

  const handleDelete = async (goal: SavingGoal) => {
    await deleteSavingGoal(goal.id)
  }

  const handleArchiveToggle = async (goal: SavingGoal) => {
    if (goal.is_archived) {
      await restoreSavingGoal(goal.id)
    } else {
      await archiveSavingGoal(goal.id)
    }
  }

  const handleActionSubmit = async () => {
    if (!actionGoal) return
    const value = Number(amount)
    if (!value || value <= 0) return

    try {
      if (actionType === 'add') {
        await addSavings(actionGoal.id, { amount: value, comment })
      } else {
        await withdrawSavings(actionGoal.id, { amount: value, comment })
      }

      setActionGoal(null)
      setAmount('')
      setComment('')
    } catch (error) {
      console.error('Saving goal action failed', error)
    }
  }

  return (
    <PageContainer>
      <PageHeader
        title="Objectifs d'épargne"
        description="Créez, suivez et motivez vos projets d’épargne"
      />

      <div className="space-y-6">
        <SavingGoalSummaryCard summary={summary} />

        <div className="flex flex-col gap-3 rounded-xl border bg-background/70 p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <Input
              placeholder="Rechercher un objectif"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-35">
                <SelectValue placeholder="Filtrer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="active">En cours</SelectItem>
                <SelectItem value="completed">Terminés</SelectItem>
                <SelectItem value="overdue">En retard</SelectItem>
                <SelectItem value="archived">Archivés</SelectItem>
              </SelectContent>
            </Select>
            <Select value={archivedFilter} onValueChange={setArchivedFilter}>
              <SelectTrigger className="w-35">
                <SelectValue placeholder="État" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="active">Actifs</SelectItem>
                <SelectItem value="archived">Archivés</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortKey} onValueChange={setSortKey}>
              <SelectTrigger className="w-35">
                <SelectValue placeholder="Trier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nom</SelectItem>
                <SelectItem value="deadline">Date cible</SelectItem>
                <SelectItem value="target_amount">Montant cible</SelectItem>
                <SelectItem value="remaining">Montant restant</SelectItem>
                <SelectItem value="progress">Pourcentage</SelectItem>
                <SelectItem value="created_at">Date de création</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-30">
                <SelectValue placeholder="Ordre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Croissant</SelectItem>
                <SelectItem value="desc">Décroissant</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="rounded-xl border p-6 text-sm text-muted-foreground">
            Chargement…
          </div>
        ) : error ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">
            {error}
          </div>
        ) : savingGoals.length === 0 ? (
          <EmptyState
            title="Créez votre premier objectif d'épargne"
            description="Commencez à préparer vos projets avec un objectif clair et visible."
            icon={Icons.goals}
            actionLabel="Créer un objectif"
            onAction={() => setDialogOpen(true)}
          />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {savingGoals.map((goal) => (
              <SavingGoalCard
                key={goal.id}
                goal={goal}
                onEdit={(item) => {
                  setSelectedGoal(item)
                  setDialogOpen(true)
                }}
                onDelete={handleDelete}
                onArchive={handleArchiveToggle}
                onRestore={handleArchiveToggle}
                onAddSavings={(item) => {
                  setActionGoal(item)
                  setActionType('add')
                }}
                onWithdraw={(item) => {
                  setActionGoal(item)
                  setActionType('withdraw')
                }}
              />
            ))}
          </div>
        )}

        <Button
          className="fixed bottom-6 right-6 rounded-full px-5 shadow-lg"
          onClick={() => setDialogOpen(true)}
        >
          <Icons.plus className="mr-2 h-4 w-4" />
          Ajouter un objectif
        </Button>
      </div>

      <SavingGoalDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) {
            setSelectedGoal(null)
          }
        }}
        onSubmit={async (values) => {
          await handleCreateOrUpdate(values)
          setDialogOpen(false)
        }}
        isLoading={loading}
        goal={selectedGoal}
      />

      <Dialog
        open={Boolean(actionGoal)}
        onOpenChange={(open) => !open && setActionGoal(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'add'
                ? 'Ajouter de l’épargne'
                : 'Retirer de l’épargne'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'add'
                ? 'Ajoutez un montant à votre objectif.'
                : 'Retirez un montant de votre objectif.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              type="number"
              min="0"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="Montant"
            />
            <Input
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Commentaire (optionnel)"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionGoal(null)}>
              Annuler
            </Button>
            <Button onClick={handleActionSubmit}>
              {actionType === 'add' ? 'Valider' : 'Retirer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  )
}
