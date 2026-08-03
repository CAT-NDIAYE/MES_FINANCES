import { createClient } from '@/lib/supabase/client'
import type {
  Budget,
  BudgetSummary,
  CreateBudgetInput,
  UpdateBudgetInput,
} from '../types'
import {
  calculateBudgetPercentage,
  calculateBudgetStatus,
  calculateBudgetSummary,
  calculateRemainingAmount,
} from '../utils/budget-calculations'

type BudgetRecord = {
  id?: string
  user_id?: string
  category_id?: string
  month?: number | string | null
  year?: number | string | null
  amount?: number | string | null
  alert_percentage?: number | string | null
  is_archived?: boolean | null
  created_at?: string | null
  updated_at?: string | null
  categories?:
    | {
        id: string
        name: string
        type: 'income' | 'expense'
        icon: string | null
        color: string | null
      }[]
    | {
        id: string
        name: string
        type: 'income' | 'expense'
        icon: string | null
        color: string | null
      }
    | null
  spent_amount?: number | string | null
  remaining_amount?: number | string | null
  percentage_used?: number | string | null
  is_over_budget?: boolean | null
  status?: Budget['status']
  alert_reached?: boolean | null
  [key: string]: unknown
}

const toNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === 'number') return value
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : fallback
  }
  return fallback
}

const mapBudget = (item: BudgetRecord): Budget => {
  const amount = toNumber(item.amount)
  const spentAmount = toNumber(item.spent_amount)
  const remainingAmount = calculateRemainingAmount(spentAmount, amount)
  const percentageUsed = calculateBudgetPercentage(spentAmount, amount)
  const alertPercentage = toNumber(item.alert_percentage, 80)
  const status = calculateBudgetStatus(percentageUsed, alertPercentage)
  const isOverBudget = spentAmount > amount

  return {
    id: (item.id as string | undefined) ?? '',
    user_id: (item.user_id as string | undefined) ?? '',
    category_id: (item.category_id as string | undefined) ?? '',
    month: Number(item.month ?? 0),
    year: Number(item.year ?? 0),
    amount,
    alert_percentage: alertPercentage,
    is_archived: Boolean(item.is_archived),
    created_at: (item.created_at as string | undefined) ?? '',
    updated_at: (item.updated_at as string | undefined) ?? '',
    category: (() => {
      const category = item.categories
      if (Array.isArray(category)) {
        return category[0] ?? null
      }
      return (category as Budget['category']) ?? null
    })(),
    spent_amount: spentAmount,
    remaining_amount: remainingAmount,
    percentage_used: percentageUsed,
    is_over_budget: isOverBudget,
    status,
    alert_reached: percentageUsed >= alertPercentage,
  }
}

export const budgetService = {
  async getBudgets(): Promise<Budget[]> {
    const supabase = createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error('Utilisateur non authentifié.')
    }

    const { data, error } = await supabase
      .from('budgets')
      .select(
        `id, user_id, category_id, month, year, amount, created_at, updated_at, categories (id, name, type, icon, color)`
      )
      .eq('user_id', user.id)
      .order('year', { ascending: true })
      .order('month', { ascending: true })

    if (error) {
      throw new Error(error.message || 'Impossible de charger les budgets.')
    }

    const budgets = data ?? []

    const { data: transactionsData, error: transactionsError } = await supabase
      .from('transactions')
      .select('category_id, amount, type, transaction_date')
      .eq('user_id', user.id)
      .eq('type', 'expense')

    if (transactionsError) {
      throw new Error(
        'Impossible de calculer les dépenses associées aux budgets.'
      )
    }

    return (budgets ?? []).map((budget) => {
      const spentAmount = (transactionsData ?? []).reduce(
        (sum, transaction) => {
          if (transaction.category_id !== budget.category_id) return sum

          const transactionDate = new Date(transaction.transaction_date)
          const transactionMonth = transactionDate.getMonth() + 1
          const transactionYear = transactionDate.getFullYear()

          if (
            transactionMonth !== Number(budget.month) ||
            transactionYear !== Number(budget.year)
          ) {
            return sum
          }

          return sum + Number(transaction.amount || 0)
        },
        0
      )

      return mapBudget({ ...budget, spent_amount: spentAmount })
    })
  },

  async getSummary(): Promise<BudgetSummary> {
    const budgets = await this.getBudgets()
    return calculateBudgetSummary(budgets)
  },

  async createBudget(input: CreateBudgetInput): Promise<Budget> {
    const supabase = createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error('Utilisateur non authentifié.')
    }

    const { data: existing, error: existingError } = await supabase
      .from('budgets')
      .select('id')
      .eq('user_id', user.id)
      .eq('category_id', input.category_id)
      .eq('month', input.month)
      .eq('year', input.year)
      .maybeSingle()

    if (existingError) {
      throw new Error(
        existingError.message || 'Erreur lors de la vérification du budget.'
      )
    }

    if (existing) {
      throw new Error('Un budget existe déjà pour cette catégorie ce mois-ci.')
    }

    const { data, error } = await supabase
      .from('budgets')
      .insert({
        user_id: user.id,
        category_id: input.category_id,
        month: input.month,
        year: input.year,
        amount: input.amount,
      })
      .select(
        `id, user_id, category_id, month, year, amount, created_at, updated_at, categories (id, name, type, icon, color)`
      )
      .single()

    if (error) {
      throw new Error(error.message || 'Impossible de créer le budget.')
    }

    return mapBudget({ ...data, spent_amount: 0 })
  },

  async updateBudget(id: string, input: UpdateBudgetInput): Promise<Budget> {
    const supabase = createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error('Utilisateur non authentifié.')
    }

    const budgetPayload = { ...input }
    delete (
      budgetPayload as Partial<UpdateBudgetInput> & {
        alert_percentage?: number
      }
    ).alert_percentage

    const { data, error } = await supabase
      .from('budgets')
      .update({
        ...budgetPayload,
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select(
        `id, user_id, category_id, month, year, amount, created_at, updated_at, categories (id, name, type, icon, color)`
      )
      .single()

    if (error) {
      throw new Error(error.message || 'Impossible de modifier le budget.')
    }

    return mapBudget({ ...data, spent_amount: 0 })
  },

  async deleteBudget(id: string): Promise<void> {
    const supabase = createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error('Utilisateur non authentifié.')
    }

    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      throw new Error(error.message || 'Impossible de supprimer le budget.')
    }
  },

  async archiveBudget(id: string): Promise<Budget> {
    return this.updateBudget(id, { is_archived: true })
  },

  async restoreBudget(id: string): Promise<Budget> {
    return this.updateBudget(id, { is_archived: false })
  },
}
