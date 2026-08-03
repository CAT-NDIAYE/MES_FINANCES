import { createClient } from '@/lib/supabase/client'
import type {
  AddSavingsInput,
  CreateSavingGoalInput,
  SavingGoal,
  SavingGoalSummary,
  UpdateSavingGoalInput,
  WithdrawSavingsInput,
} from '../types'
import {
  calculateDailyAmount,
  calculateDaysRemaining,
  calculateMonthlyAmount,
  calculateProgressPercentage,
  calculateRemainingAmount,
  calculateSavingGoalStatus,
  calculateSavingGoalSummary,
  calculateWeeklyAmount,
} from '../utils/saving-goal-calculations'

const mapSavingGoal = (item: Record<string, unknown>): SavingGoal => {
  const targetAmount = Number(item.target_amount ?? 0)
  const currentAmount = Number(item.current_amount ?? 0)
  const progressPercentage = calculateProgressPercentage(
    currentAmount,
    targetAmount
  )
  const remainingAmount = calculateRemainingAmount(currentAmount, targetAmount)
  const daysRemaining = calculateDaysRemaining(String(item.deadline ?? ''))
  const monthlyAmount = calculateMonthlyAmount(remainingAmount, daysRemaining)
  const weeklyAmount = calculateWeeklyAmount(remainingAmount, daysRemaining)
  const dailyAmount = calculateDailyAmount(remainingAmount, daysRemaining)
  const isCompleted = currentAmount >= targetAmount
  const status = calculateSavingGoalStatus(
    progressPercentage,
    daysRemaining,
    isCompleted
  )

  return {
    id: String(item.id ?? ''),
    user_id: String(item.user_id ?? ''),
    name: String(item.name ?? ''),
    icon: (item.icon as string | null) ?? null,
    color: (item.color as string | null) ?? null,
    description: (item.description as string | null) ?? null,
    target_amount: targetAmount,
    current_amount: currentAmount,
    deadline: String(item.deadline ?? ''),
    is_completed: isCompleted,
    is_archived: Boolean(item.is_archived),
    created_at: String(item.created_at ?? ''),
    updated_at: String(item.updated_at ?? ''),
    progress_percentage: progressPercentage,
    remaining_amount: remainingAmount,
    days_remaining: daysRemaining,
    monthly_amount: monthlyAmount,
    weekly_amount: weeklyAmount,
    daily_amount: dailyAmount,
    status,
  }
}

export const savingGoalService = {
  async getSavingGoals(): Promise<SavingGoal[]> {
    const supabase = createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error('Utilisateur non authentifié.')
    }

    const { data, error } = await supabase
      .from('saving_goals')
      .select('*')
      .eq('user_id', user.id)
      .order('deadline', { ascending: true })

    if (error) {
      throw new Error(error.message || 'Impossible de charger les objectifs.')
    }

    return (data ?? []).map((item) => mapSavingGoal(item))
  },

  async getSummary(): Promise<SavingGoalSummary> {
    const goals = await this.getSavingGoals()
    return calculateSavingGoalSummary(goals)
  },

  async createSavingGoal(input: CreateSavingGoalInput): Promise<SavingGoal> {
    const supabase = createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error('Utilisateur non authentifié.')
    }

    const { data, error } = await supabase
      .from('saving_goals')
      .insert({
        user_id: user.id,
        name: input.name,
        icon: input.icon ?? null,
        color: input.color ?? null,
        description: input.description ?? null,
        target_amount: input.target_amount,
        current_amount: input.current_amount ?? 0,
        deadline: input.deadline,
      })
      .select('*')
      .single()

    if (error) {
      throw new Error(error.message || 'Impossible de créer l’objectif.')
    }

    return mapSavingGoal(data)
  },

  async updateSavingGoal(
    id: string,
    input: UpdateSavingGoalInput
  ): Promise<SavingGoal> {
    const supabase = createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error('Utilisateur non authentifié.')
    }

    const { data, error } = await supabase
      .from('saving_goals')
      .update(input)
      .eq('id', id)
      .eq('user_id', user.id)
      .select('*')
      .single()

    if (error) {
      throw new Error(error.message || 'Impossible de modifier l’objectif.')
    }

    return mapSavingGoal(data)
  },

  async deleteSavingGoal(id: string): Promise<void> {
    const supabase = createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error('Utilisateur non authentifié.')
    }

    const { error } = await supabase
      .from('saving_goals')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      throw new Error(error.message || 'Impossible de supprimer l’objectif.')
    }
  },

  async archiveSavingGoal(id: string): Promise<SavingGoal> {
    return this.updateSavingGoal(id, { is_archived: true })
  },

  async restoreSavingGoal(id: string): Promise<SavingGoal> {
    return this.updateSavingGoal(id, { is_archived: false })
  },

  async addSavings(id: string, input: AddSavingsInput): Promise<SavingGoal> {
    const supabase = createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error('Utilisateur non authentifié.')
    }

    const { data: currentGoal, error: fetchError } = await supabase
      .from('saving_goals')
      .select('id, target_amount, current_amount')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !currentGoal) {
      throw new Error('Objectif introuvable.')
    }

    const nextAmount =
      Number(currentGoal.current_amount ?? 0) + Number(input.amount)
    if (nextAmount > Number(currentGoal.target_amount ?? 0)) {
      throw new Error('Le montant actuel ne peut pas dépasser la cible.')
    }

    const { data, error } = await supabase
      .from('saving_goals')
      .update({
        current_amount: nextAmount,
        is_completed: nextAmount >= Number(currentGoal.target_amount ?? 0),
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select('*')
      .single()

    if (error) {
      throw new Error(
        error.message || 'Impossible de mettre à jour l’objectif.'
      )
    }

    return mapSavingGoal(data)
  },

  async withdrawSavings(
    id: string,
    input: WithdrawSavingsInput
  ): Promise<SavingGoal> {
    const supabase = createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error('Utilisateur non authentifié.')
    }

    const { data: currentGoal, error: fetchError } = await supabase
      .from('saving_goals')
      .select('id, current_amount, target_amount')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !currentGoal) {
      throw new Error('Objectif introuvable.')
    }

    const nextAmount =
      Number(currentGoal.current_amount ?? 0) - Number(input.amount)
    if (nextAmount < 0) {
      throw new Error('Le montant actuel ne peut pas devenir négatif.')
    }

    const { data, error } = await supabase
      .from('saving_goals')
      .update({
        current_amount: nextAmount,
        is_completed: nextAmount >= Number(currentGoal.target_amount ?? 0),
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select('*')
      .single()

    if (error) {
      throw new Error(error.message || 'Impossible de retirer de l’épargne.')
    }

    return mapSavingGoal(data)
  },
}
