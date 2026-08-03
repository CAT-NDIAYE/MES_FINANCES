export type BudgetStatus = 'normal' | 'warning' | 'over'

export interface Budget {
  id: string
  user_id: string
  category_id: string
  month: number
  year: number
  amount: number
  alert_percentage: number
  is_archived: boolean
  created_at: string
  updated_at: string
  category?: {
    id: string
    name: string
    type: 'income' | 'expense'
    icon: string | null
    color: string | null
  } | null
  spent_amount: number
  remaining_amount: number
  percentage_used: number
  is_over_budget: boolean
  status: BudgetStatus
  alert_reached: boolean
}

export interface CreateBudgetInput {
  category_id: string
  month: number
  year: number
  amount: number
  alert_percentage?: number
}

export interface UpdateBudgetInput {
  category_id?: string
  month?: number
  year?: number
  amount?: number
  alert_percentage?: number
  is_archived?: boolean
}

export interface BudgetSummary {
  totalBudgets: number
  totalBudgeted: number
  totalSpent: number
  totalRemaining: number
  exceededBudgets: number
}

export type BudgetStatusFilter = 'all' | BudgetStatus
export type BudgetMonthFilter = 'all' | string
export type BudgetArchivedFilter = 'all' | 'active' | 'archived'
