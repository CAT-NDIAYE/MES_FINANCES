'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, TrendingUp, Wallet, Target, PiggyBank } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type {
  BudgetOverview,
  SavingGoalOverview,
  DashboardSummary,
} from '../types'

interface DashboardOverviewProps {
  summary: DashboardSummary | undefined
  budgets: BudgetOverview[]
  savingGoals: SavingGoalOverview[]
}

export function DashboardOverview({
  summary,
  budgets,
  savingGoals,
}: DashboardOverviewProps) {
  if (!summary) return null

  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      <Card className="rounded-2xl border-emerald-100 bg-emerald-50/60 dark:border-emerald-950 dark:bg-emerald-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" /> Résumé du mois
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Revenus</p>
              <p className="text-xl font-semibold">
                {formatCurrency(summary.totalIncome)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Dépenses</p>
              <p className="text-xl font-semibold">
                {formatCurrency(summary.totalExpense)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Épargne</p>
              <p className="text-xl font-semibold">
                {formatCurrency(summary.balance)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Taux d’épargne</p>
              <p className="text-xl font-semibold">
                {summary.savingsRate.toFixed(1)}%
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-background/80 p-3 text-sm">
            <span>Catégorie la plus dépensière</span>
            <span className="font-semibold">
              {summary.topCategory ?? 'Aucune donnée'}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-background/80 p-3 text-sm">
            <span>Jours restants dans le mois</span>
            <span className="font-semibold">{summary.daysRemaining}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" /> Aperçu rapide
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-xl border p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Budgets</span>
              <span className="font-semibold">{budgets.length}</span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>{budgets.length ? 'À suivre' : 'Aucun budget encore'}</span>
            </div>
          </div>
          <div className="rounded-xl border p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Objectifs</span>
              <span className="font-semibold">{savingGoals.length}</span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <PiggyBank className="h-4 w-4" />
              <span>
                {savingGoals.length
                  ? 'Progression active'
                  : 'Aucun objectif pour l’instant'}
              </span>
            </div>
          </div>
          <Button variant="outline" className="w-full justify-between">
            Voir les transactions
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
