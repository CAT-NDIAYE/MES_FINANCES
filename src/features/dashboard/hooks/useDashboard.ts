'use client'

import * as React from 'react'
import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '../services/dashboard.service'
import type {
  DashboardData,
  DashboardDateRange,
  DashboardPeriod,
} from '../types'

export function useDashboard() {
  const [period, setPeriod] = React.useState<DashboardPeriod>('month')
  const [customRange, setCustomRange] = React.useState<
    DashboardDateRange | undefined
  >(undefined)

  const { data, isLoading, isFetching, error, refetch } =
    useQuery<DashboardData>({
      queryKey: ['dashboard', period, customRange],
      queryFn: () => dashboardService.getDashboardData(period, customRange),
      staleTime: 60 * 1000,
    })

  return {
    loading: isLoading || isFetching,
    error: error ? (error as Error).message : null,
    period,
    setPeriod,
    customRange,
    setCustomRange,
    summary: data?.summary,
    charts: data?.charts,
    recentTransactions: data?.recentTransactions ?? [],
    budgets: data?.budgets ?? [],
    savingGoals: data?.savingGoals ?? [],
    refresh: refetch,
  }
}
