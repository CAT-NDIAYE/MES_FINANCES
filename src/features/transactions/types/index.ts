export type TransactionType = 'income' | 'expense'

export type TransactionFilterMode = 'all' | TransactionType

export type TransactionDateFilter = 'all' | 'today' | 'week' | 'month' | 'year'

export type TransactionSortKey =
  'transaction_date' | 'amount' | 'category_name' | 'created_at'

export type TransactionSortOrder = 'asc' | 'desc'

export interface TransactionCategory {
  id: string
  user_id: string
  name: string
  type: TransactionType
  icon: string | null
  color: string | null
  is_archived: boolean
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  user_id: string
  category_id: string | null
  amount: number
  type: TransactionType
  description: string | null
  transaction_date: string
  created_at: string
  updated_at: string
  category?: TransactionCategory | null
}

export interface CreateTransactionInput {
  category_id: string
  amount: number
  type: TransactionType
  description?: string
  transaction_date: string
}

export interface UpdateTransactionInput {
  category_id?: string
  amount?: number
  type?: TransactionType
  description?: string
  transaction_date?: string
}

export interface TransactionListParams {
  page: number
  pageSize: number
  search?: string
  type?: TransactionFilterMode
  dateFilter?: TransactionDateFilter
  categoryId?: string | null
  minAmount?: number | null
  maxAmount?: number | null
  sortKey?: TransactionSortKey
  sortOrder?: TransactionSortOrder
}

export interface TransactionSummary {
  totalIncome: number
  totalExpense: number
  balance: number
  count: number
}

export interface TransactionListResponse {
  items: Transaction[]
  total: number
  page: number
  pageSize: number
  summary: TransactionSummary
}
