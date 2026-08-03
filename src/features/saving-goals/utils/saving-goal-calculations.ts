import type { SavingGoal, SavingGoalStatus } from '../types'

export function calculateProgressPercentage(current: number, target: number) {
  if (!target || target <= 0) return 0
  return Math.min(100, Math.round((current / target) * 100))
}

export function calculateRemainingAmount(current: number, target: number) {
  return Math.max(0, target - current)
}

export function calculateDaysRemaining(deadline: string) {
  const today = new Date()
  const targetDate = new Date(deadline)
  const diffMs = targetDate.getTime() - today.setHours(0, 0, 0, 0)
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  return Math.max(0, diffDays)
}

export function calculateMonthlyAmount(
  remaining: number,
  daysRemaining: number
) {
  if (!daysRemaining) return remaining
  return remaining / Math.max(1, Math.ceil(daysRemaining / 30))
}

export function calculateWeeklyAmount(
  remaining: number,
  daysRemaining: number
) {
  if (!daysRemaining) return remaining
  return remaining / Math.max(1, Math.ceil(daysRemaining / 7))
}

export function calculateDailyAmount(remaining: number, daysRemaining: number) {
  if (!daysRemaining) return remaining
  return remaining / Math.max(1, daysRemaining)
}

export function calculateSavingGoalStatus(
  progress: number,
  daysRemaining: number,
  isCompleted: boolean
): SavingGoalStatus {
  if (isCompleted || progress >= 100) return 'completed'
  if (daysRemaining <= 0) return 'behind'
  if (progress >= 75) return 'on_track'
  if (progress >= 40) return 'watching'
  return 'behind'
}

export function calculateSavingGoalSummary(goals: SavingGoal[]) {
  const totalTargetAmount = goals.reduce(
    (sum, goal) => sum + goal.target_amount,
    0
  )
  const totalSavedAmount = goals.reduce(
    (sum, goal) => sum + goal.current_amount,
    0
  )
  const completedGoals = goals.filter((goal) => goal.is_completed).length
  const overdueGoals = goals.filter((goal) => goal.status === 'behind').length
  const overallProgress =
    totalTargetAmount > 0
      ? Math.round((totalSavedAmount / totalTargetAmount) * 100)
      : 0

  return {
    totalGoals: goals.length,
    totalTargetAmount,
    totalSavedAmount,
    overallProgress,
    completedGoals,
    overdueGoals,
  }
}
