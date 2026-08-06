'use client'

import * as React from 'react'
import { PageContainer, PageHeader } from '@/components/layout'
import { Spinner } from '@/components/feedback/Spinner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuthContext } from '@/features/auth/contexts/AuthContext'
import { useDashboard } from '@/features/dashboard/hooks/useDashboard'
import { ProductTour } from '@/components/layout/ProductTour'
import {
  DashboardCharts,
  DashboardEmptyState,
  DashboardOverview,
  DashboardStats,
  QuickActions,
  RecentTransactions,
} from '@/features/dashboard/components'

export default function DashboardPage() {
  const { profile } = useAuthContext()
  const {
    loading,
    error,
    summary,
    charts,
    recentTransactions,
    budgets,
    savingGoals,
    period,
    setPeriod,
    refresh,
  } = useDashboard()

  React.useEffect(() => {
    refresh()
  }, [refresh])

  const greeting = profile?.full_name
    ? `Bonjour, ${profile.full_name}`
    : 'Bonjour'

  return (
    <PageContainer>
      <ProductTour />
      <PageHeader
        title={greeting}
        description="Voici votre situation financière."
        action={
          <div className="flex items-center gap-2">
            <Select
              value={period}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onValueChange={(value) => setPeriod(value as any)}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Aujourd&apos;hui</SelectItem>
                <SelectItem value="7d">7 jours</SelectItem>
                <SelectItem value="30d">30 jours</SelectItem>
                <SelectItem value="month">Ce mois</SelectItem>
                <SelectItem value="3m">3 mois</SelectItem>
                <SelectItem value="6m">6 mois</SelectItem>
                <SelectItem value="12m">12 mois</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      />

      {loading ? (
        <div className="flex min-h-75 items-center justify-center rounded-2xl border bg-background">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
          {error}
        </div>
      ) : !summary || summary.transactionCount === 0 ? (
        <div className="space-y-6">
          <DashboardEmptyState />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-2xl border bg-background p-4 text-sm text-muted-foreground">
            {new Date().toLocaleDateString('fr-FR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </div>

          <div id="dashboard-stats">
            <DashboardStats summary={summary} />
          </div>
          <DashboardOverview
            summary={summary}
            budgets={budgets}
            savingGoals={savingGoals}
          />
          {charts && (
            <DashboardCharts
              monthly={charts.monthly}
              expensesByCategory={charts.expensesByCategory}
              topCategories={charts.topCategories}
            />
          )}
          <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
            <RecentTransactions transactions={recentTransactions} />
            <div id="quick-actions">
              <QuickActions />
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  )
}
