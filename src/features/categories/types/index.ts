export type CategoryType = 'income' | 'expense'

export interface Category {
  id: string
  user_id: string
  name: string
  type: CategoryType
  icon: string | null
  color: string | null
  description: string | null
  is_default: boolean
  is_archived: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface CreateCategoryInput {
  name: string
  type: CategoryType
  icon: string
  color: string
  description?: string
  sort_order?: number
}

export interface UpdateCategoryInput {
  name?: string
  type?: CategoryType
  icon?: string
  color?: string
  description?: string
  sort_order?: number
  is_archived?: boolean
}
