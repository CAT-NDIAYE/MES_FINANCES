import { createClient } from '@/lib/supabase/client'
import type {
  DashboardData,
  DashboardDateRange,
  DashboardPeriod,
  DashboardSummary,
  MonthlyPoint,
  CategorySpend,
  RecentTransactionItem,
  BudgetOverview,
  SavingGoalOverview,
} from '../types'

function getDateRange(
  period: DashboardPeriod,
  customRange?: DashboardDateRange
) {
  const end = new Date()
  const start = new Date(end)

  if (customRange) {
    return {
      start: customRange.start,
      end: customRange.end,
    }
  }

  switch (period) {
    case 'today':
      start.setHours(0, 0, 0, 0)
      end.setHours(23, 59, 59, 999)
      break
    case '7d':
      start.setDate(start.getDate() - 6)
      start.setHours(0, 0, 0, 0)
      end.setHours(23, 59, 59, 999)
      break
    case '30d':
      start.setDate(start.getDate() - 29)
      start.setHours(0, 0, 0, 0)
      end.setHours(23, 59, 59, 999)
      break
    case 'month':
      start.setDate(1)
      start.setHours(0, 0, 0, 0)
      end.setMonth(end.getMonth() + 1, 0)
      end.setHours(23, 59, 59, 999)
      break
    case '3m':
      start.setMonth(start.getMonth() - 2)
      start.setDate(1)
      start.setHours(0, 0, 0, 0)
      end.setHours(23, 59, 59, 999)
      break
    case '6m':
      start.setMonth(start.getMonth() - 5)
      start.setDate(1)
      start.setHours(0, 0, 0, 0)
      end.setHours(23, 59, 59, 999)
      break
    case '12m':
      start.setFullYear(start.getFullYear() - 1)
      start.setDate(1)
      start.setHours(0, 0, 0, 0)
      end.setHours(23, 59, 59, 999)
      break
    default:
      start.setFullYear(2000, 0, 1)
      break
  }

  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
  }
}

function formatLabel(date: string) {
  const parsed = new Date(date)
  return parsed.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
}

export const dashboardService = {
  async getDashboardData(
    period: DashboardPeriod,
    customRange?: DashboardDateRange
  ): Promise<DashboardData> {
    const supabase = createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) throw new Error('Utilisateur non authentifié.')

    const range = getDateRange(period, customRange)

    const [transactionsResult, budgetsResult, goalsResult] = await Promise.all([
      supabase
        .from('transactions')
        .select(
          'id, user_id, amount, type, description, transaction_date, categories(name)'
        )
        .eq('user_id', user.id)
        .gte('transaction_date', range.start)
        .lte('transaction_date', range.end)
        .order('transaction_date', { ascending: false })
        .limit(50),
      supabase
        .from('budgets')
        .select('id, category_id, amount')
        .eq('user_id', user.id),
      supabase
        .from('saving_goals')
        .select('id, name, target_amount, current_amount, deadline')
        .eq('user_id', user.id),
    ])

    if (transactionsResult.error)
      throw new Error(transactionsResult.error.message || 'Erreur réseau.')
    if (budgetsResult.error)
      throw new Error(budgetsResult.error.message || 'Erreur réseau.')
    if (goalsResult.error)
      throw new Error(goalsResult.error.message || 'Erreur réseau.')

    const transactions = transactionsResult.data ?? []

    const summary = transactions.reduce<DashboardSummary>(
      (acc, item) => {
        const amount = Number(item.amount)
        if (item.type === 'income') acc.totalIncome += amount
        else acc.totalExpense += amount
        acc.transactionCount += 1
        return acc
      },
      {
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
        transactionCount: 0,
        budgetRemaining: 0,
        savingsProgress: 0,
        savingsRate: 0,
        topCategory: null,
        daysRemaining: 0,
      }
    )

    summary.balance = summary.totalIncome - summary.totalExpense

    const monthlyPoints: MonthlyPoint[] = []
    const monthlyMap = new Map<
      string,
      { income: number; expense: number; balance: number }
    >()

    transactions.forEach((item) => {
      const key = item.transaction_date.slice(0, 7)
      const current = monthlyMap.get(key) ?? {
        income: 0,
        expense: 0,
        balance: 0,
      }
      if (item.type === 'income') current.income += Number(item.amount)
      else current.expense += Number(item.amount)
      current.balance = current.income - current.expense
      monthlyMap.set(key, current)
    })

    Array.from(monthlyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12)
      .forEach(([key, data]) => {
        monthlyPoints.push({
          key,
          label: formatLabel(`${key}-01`),
          income: data.income,
          expense: data.expense,
          balance: data.balance,
        })
      })

    const expensesByCategory = Object.values(
      transactions.reduce<Record<string, number>>((acc, item) => {
        if (item.type === 'expense') {
          const name = (item.categories as any)?.name ?? 'Sans catégorie'
          acc[name] = (acc[name] ?? 0) + Number(item.amount)
        }
        return acc
      }, {})
    )

    const topCategories = Object.entries(
      transactions.reduce<Record<string, number>>((acc, item) => {
        if (item.type === 'expense') {
          const name = (item.categories as any)?.name ?? 'Sans catégorie'
          acc[name] = (acc[name] ?? 0) + Number(item.amount)
        }
        return acc
      }, {})
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }))

    const expensesChart: CategorySpend[] = Object.entries(
      transactions.reduce<Record<string, number>>((acc, item) => {
        if (item.type === 'expense') {
          const name = (item.categories as any)?.name ?? 'Sans catégorie'
          acc[name] = (acc[name] ?? 0) + Number(item.amount)
        }
        return acc
      }, {})
    ).map(([name, value]) => ({ name, value }))

    const recentTransactions: RecentTransactionItem[] = (
      transactions.slice(0, 5) ?? []
    ).map((item) => ({
      id: item.id,
      type: item.type,
      amount: Number(item.amount),
      description: item.description,
      transaction_date: item.transaction_date,
      category_name: (item.categories as any)?.name ?? null,
    }))

    const budgets: BudgetOverview[] = (budgetsResult.data ?? []).map(
      (item) => ({
        id: item.id,
        name: item.category_id ?? 'Budget',
        limit: Number(item.amount),
        used: 0,
        remaining: Number(item.amount),
        progress: 0,
      })
    )

    const savingGoals: SavingGoalOverview[] = (goalsResult.data ?? []).map(
      (item) => ({
        id: item.id,
        name: item.name,
        target: Number(item.target_amount),
        current: Number(item.current_amount),
        progress:
          Number(item.target_amount) > 0
            ? (Number(item.current_amount) / Number(item.target_amount)) * 100
            : 0,
        deadline: item.deadline,
      })
    )

    summary.budgetRemaining = budgets.reduce(
      (acc, item) => acc + item.remaining,
      0
    )
    if (savingGoals.length > 0) {
      const totalTarget = savingGoals.reduce(
        (acc, item) => acc + item.target,
        0
      )
      const totalCurrent = savingGoals.reduce(
        (acc, item) => acc + item.current,
        0
      )
      summary.savingsProgress =
        totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0
      summary.savingsRate =
        totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0
    }

    const currentDate = new Date()
    const monthEnd = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    )
    summary.daysRemaining = monthEnd.getDate() - currentDate.getDate() + 1

    const topCategoryEntry = topCategories[0]
    summary.topCategory = topCategoryEntry?.name ?? null

    return {
      summary,
      charts: {
        monthly: monthlyPoints,
        expensesByCategory: expensesChart,
        topCategories,
      },
      recentTransactions,
      budgets,
      savingGoals,
    }
  },
}
