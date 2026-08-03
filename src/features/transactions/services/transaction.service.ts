import { createClient } from '@/lib/supabase/client'
import type {
  CreateTransactionInput,
  Transaction,
  TransactionListParams,
  TransactionListResponse,
  TransactionSummary,
  UpdateTransactionInput,
} from '../types'

const mapTransaction = (item: any): Transaction => ({
  id: item.id,
  user_id: item.user_id,
  category_id: item.category_id,
  amount: Number(item.amount),
  type: item.type,
  description: item.description,
  transaction_date: item.transaction_date,
  created_at: item.created_at,
  updated_at: item.updated_at,
  category: item.categories ?? null,
})

function buildDateRange(dateFilter: TransactionListParams['dateFilter']) {
  if (!dateFilter || dateFilter === 'all') {
    return null
  }

  const now = new Date()
  const start = new Date(now)
  const end = new Date(now)

  if (dateFilter === 'today') {
    start.setHours(0, 0, 0, 0)
    end.setHours(23, 59, 59, 999)
  } else if (dateFilter === 'week') {
    const day = start.getDay()
    const diff = day === 0 ? -6 : 1 - day
    start.setDate(start.getDate() + diff)
    start.setHours(0, 0, 0, 0)
    end.setHours(23, 59, 59, 999)
  } else if (dateFilter === 'month') {
    start.setDate(1)
    start.setHours(0, 0, 0, 0)
    end.setMonth(end.getMonth() + 1, 0)
    end.setHours(23, 59, 59, 999)
  } else if (dateFilter === 'year') {
    start.setMonth(0, 1)
    start.setHours(0, 0, 0, 0)
    end.setMonth(11, 31)
    end.setHours(23, 59, 59, 999)
  }

  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
  }
}

export const transactionService = {
  async getTransactions(
    params: TransactionListParams
  ): Promise<TransactionListResponse> {
    const supabase = createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error('Utilisateur non authentifié.')
    }

    const dateRange = buildDateRange(params.dateFilter)

    let query = supabase
      .from('transactions')
      .select(
        `id, user_id, category_id, amount, type, description, transaction_date, created_at, updated_at, categories (id, user_id, name, type, icon, color, is_archived, created_at, updated_at)`,
        { count: 'exact' }
      )
      .eq('user_id', user.id)

    if (params.type && params.type !== 'all') {
      query = query.eq('type', params.type)
    }

    if (params.categoryId) {
      query = query.eq('category_id', params.categoryId)
    }

    if (dateRange) {
      query = query
        .gte('transaction_date', dateRange.start)
        .lte('transaction_date', dateRange.end)
    }

    if (params.minAmount !== null && params.minAmount !== undefined) {
      query = query.gte('amount', params.minAmount)
    }

    if (params.maxAmount !== null && params.maxAmount !== undefined) {
      query = query.lte('amount', params.maxAmount)
    }

    if (params.search?.trim()) {
      const pattern = `%${params.search.trim()}%`
      query = query.or(
        `description.ilike.${pattern},categories.name.ilike.${pattern}`
      )
    }

    if (params.sortKey === 'category_name') {
      query = query.order('name', {
        foreignTable: 'categories',
        ascending: params.sortOrder === 'asc',
      })
    } else {
      const sortColumn =
        params.sortKey === 'amount'
          ? 'amount'
          : params.sortKey === 'created_at'
            ? 'created_at'
            : 'transaction_date'
      query = query.order(sortColumn, { ascending: params.sortOrder === 'asc' })
    }

    const offset = (params.page - 1) * params.pageSize
    const { data, error, count } = await query.range(
      offset,
      offset + params.pageSize - 1
    )

    if (error) {
      throw new Error(
        error.message || 'Impossible de charger les transactions.'
      )
    }

    const summary = await this.getSummary({
      ...params,
      page: 1,
      pageSize: 1000,
    })

    return {
      items: (data ?? []).map(mapTransaction),
      total: count ?? 0,
      page: params.page,
      pageSize: params.pageSize,
      summary,
    }
  },

  async getSummary(params: TransactionListParams): Promise<TransactionSummary> {
    const supabase = createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error('Utilisateur non authentifié.')
    }

    const dateRange = buildDateRange(params.dateFilter)

    let query = supabase
      .from('transactions')
      .select('amount, type', { count: 'exact' })
      .eq('user_id', user.id)

    if (params.type && params.type !== 'all') {
      query = query.eq('type', params.type)
    }

    if (params.categoryId) {
      query = query.eq('category_id', params.categoryId)
    }

    if (dateRange) {
      query = query
        .gte('transaction_date', dateRange.start)
        .lte('transaction_date', dateRange.end)
    }

    if (params.minAmount !== null && params.minAmount !== undefined) {
      query = query.gte('amount', params.minAmount)
    }

    if (params.maxAmount !== null && params.maxAmount !== undefined) {
      query = query.lte('amount', params.maxAmount)
    }

    if (params.search?.trim()) {
      const pattern = `%${params.search.trim()}%`
      query = query.or(`description.ilike.${pattern}`)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(
        error.message || 'Impossible de calculer le résumé des transactions.'
      )
    }

    const summary = (data ?? []).reduce<TransactionSummary>(
      (acc, item) => {
        const amount = Number(item.amount)
        if (item.type === 'income') {
          acc.totalIncome += amount
        } else {
          acc.totalExpense += amount
        }
        acc.count += 1
        return acc
      },
      { totalIncome: 0, totalExpense: 0, balance: 0, count: 0 }
    )

    summary.balance = summary.totalIncome - summary.totalExpense

    return summary
  },

  async getTransactionById(id: string): Promise<Transaction> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('transactions')
      .select(
        `id, user_id, category_id, amount, type, description, transaction_date, created_at, updated_at, categories (id, user_id, name, type, icon, color, is_archived, created_at, updated_at)`
      )
      .eq('id', id)
      .single()

    if (error) {
      throw new Error(error.message || 'Transaction introuvable.')
    }

    return mapTransaction(data)
  },

  async createTransaction(input: CreateTransactionInput): Promise<Transaction> {
    const supabase = createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error('Utilisateur non authentifié.')
    }

    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        category_id: input.category_id,
        amount: input.amount,
        type: input.type,
        description: input.description?.trim() || null,
        transaction_date: input.transaction_date,
      })
      .select(
        `id, user_id, category_id, amount, type, description, transaction_date, created_at, updated_at, categories (id, user_id, name, type, icon, color, is_archived, created_at, updated_at)`
      )
      .single()

    if (error) {
      throw new Error(
        error.message || 'Erreur réseau lors de la création de la transaction.'
      )
    }

    return mapTransaction(data)
  },

  async updateTransaction(
    id: string,
    input: UpdateTransactionInput
  ): Promise<Transaction> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('transactions')
      .update({
        category_id: input.category_id,
        amount: input.amount,
        type: input.type,
        description: input.description?.trim() || null,
        transaction_date: input.transaction_date,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select(
        `id, user_id, category_id, amount, type, description, transaction_date, created_at, updated_at, categories (id, user_id, name, type, icon, color, is_archived, created_at, updated_at)`
      )
      .single()

    if (error) {
      throw new Error(
        error.message ||
          'Erreur réseau lors de la modification de la transaction.'
      )
    }

    return mapTransaction(data)
  },

  async deleteTransaction(id: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase.from('transactions').delete().eq('id', id)

    if (error) {
      throw new Error(
        error.message ||
          'Erreur serveur lors de la suppression de la transaction.'
      )
    }
  },
}
