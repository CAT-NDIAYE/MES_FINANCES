import type { Budget, BudgetSummary } from '../types'

export function calculateBudgetPercentage(spent: number, amount: number) {
  if (!amount || amount <= 0) return 0
  return Math.min(100, Math.round((spent / amount) * 100))
}

export function calculateRemainingAmount(spent: number, amount: number) {
  return Math.max(0, amount - spent)
}

export function calculateBudgetStatus(
  percentage: number,
  alertPercentage: number
) {
  if (percentage >= 100) return 'over'
  if (percentage >= alertPercentage) return 'warning'
  return 'normal'
}

export function calculateBudgetStatusMeta(status: string) {
  if (status === 'over') {
    return {
      label: 'Dépassé',
      className: 'bg-rose-100 text-rose-700 border-rose-200',
      dotClassName: 'bg-rose-500',
    }
  }

  if (status === 'warning') {
    return {
      label: 'Attention',
      className: 'bg-amber-100 text-amber-700 border-amber-200',
      dotClassName: 'bg-amber-500',
    }
  }

  return {
    label: 'Normal',
    className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    dotClassName: 'bg-emerald-500',
  }
}

export function calculateOverBudget(spent: number, amount: number) {
  return Math.max(0, spent - amount)
}

export function calculateBudgetSummary(budgets: Budget[]): BudgetSummary {
  return {
    totalBudgets: budgets.length,
    totalBudgeted: budgets.reduce((sum, budget) => sum + budget.amount, 0),
    totalSpent: budgets.reduce((sum, budget) => sum + budget.spent_amount, 0),
    totalRemaining: budgets.reduce(
      (sum, budget) => sum + budget.remaining_amount,
      0
    ),
    exceededBudgets: budgets.filter((budget) => budget.is_over_budget).length,
  }
}
