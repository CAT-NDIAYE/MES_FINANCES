export type DashboardPeriod =
  'today' | '7d' | '30d' | 'month' | '3m' | '6m' | '12m' | 'custom'

export interface DashboardDateRange {
  start: string
  end: string
}

export interface DashboardSummary {
  totalIncome: number
  totalExpense: number
  balance: number
  transactionCount: number
  budgetRemaining: number
  savingsProgress: number
  savingsRate: number
  topCategory: string | null
  daysRemaining: number
}

export interface MonthlyPoint {
  key: string
  label: string
  income: number
  expense: number
  balance: number
}

export interface CategorySpend {
  name: string
  value: number
}

export interface RecentTransactionItem {
  id: string
  type: 'income' | 'expense'
  amount: number
  description: string | null
  transaction_date: string
  category_name: string | null
}

export interface BudgetOverview {
  id: string
  name: string
  limit: number
  used: number
  remaining: number
  progress: number
}

export interface SavingGoalOverview {
  id: string
  name: string
  target: number
  current: number
  progress: number
  deadline: string | null
}

export interface DashboardData {
  summary: DashboardSummary
  charts: {
    monthly: MonthlyPoint[]
    expensesByCategory: CategorySpend[]
    topCategories: CategorySpend[]
  }
  recentTransactions: RecentTransactionItem[]
  budgets: BudgetOverview[]
  savingGoals: SavingGoalOverview[]
}
