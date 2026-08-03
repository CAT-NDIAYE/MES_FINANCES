export type SavingGoalStatus = 'on_track' | 'watching' | 'behind' | 'completed'

export interface SavingGoal {
  id: string
  user_id: string
  name: string
  icon: string | null
  color: string | null
  description: string | null
  target_amount: number
  current_amount: number
  deadline: string
  is_completed: boolean
  is_archived: boolean
  created_at: string
  updated_at: string
  progress_percentage: number
  remaining_amount: number
  days_remaining: number
  monthly_amount: number
  weekly_amount: number
  daily_amount: number
  status: SavingGoalStatus
}

export interface CreateSavingGoalInput {
  name: string
  icon?: string | null
  color?: string | null
  description?: string | null
  target_amount: number
  current_amount?: number
  deadline: string
}

export interface UpdateSavingGoalInput {
  name?: string
  icon?: string | null
  color?: string | null
  description?: string | null
  target_amount?: number
  current_amount?: number
  deadline?: string
  is_archived?: boolean
}

export interface SavingGoalSummary {
  totalGoals: number
  totalTargetAmount: number
  totalSavedAmount: number
  overallProgress: number
  completedGoals: number
  overdueGoals: number
}

export interface AddSavingsInput {
  amount: number
  transaction_date?: string
  comment?: string | null
}

export interface WithdrawSavingsInput {
  amount: number
  transaction_date?: string
  comment?: string | null
}

export type SavingGoalStatusFilter =
  'all' | 'active' | 'completed' | 'overdue' | 'archived'
export type SavingGoalSortKey =
  | 'name'
  | 'deadline'
  | 'target_amount'
  | 'remaining'
  | 'progress'
  | 'created_at'
export type SavingGoalSortOrder = 'asc' | 'desc'
