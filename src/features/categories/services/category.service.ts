import { createClient } from '@/lib/supabase/client'
import { Category, CreateCategoryInput, UpdateCategoryInput } from '../types'

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(error.message || 'Impossible de charger les catégories.')
    }

    return data as Category[]
  },

  async createCategory(input: CreateCategoryInput): Promise<Category> {
    const supabase = createClient()
    
    // Obtenir l'utilisateur actuel
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Utilisateur non authentifié.')

    const { data, error } = await supabase
      .from('categories')
      .insert({
        user_id: user.id,
        name: input.name,
        type: input.type,
        icon: input.icon,
        color: input.color,
        description: input.description || null,
        sort_order: input.sort_order || 0,
        is_default: false,
        is_archived: false,
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        throw new Error('Une catégorie avec ce nom existe déjà.')
      }
      throw new Error(error.message || 'Erreur lors de la création de la catégorie.')
    }

    return data as Category
  },

  async updateCategory(id: string, input: UpdateCategoryInput): Promise<Category> {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('categories')
      .update({
        name: input.name,
        type: input.type,
        icon: input.icon,
        color: input.color,
        description: input.description,
        sort_order: input.sort_order,
        is_archived: input.is_archived,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        throw new Error('Une catégorie avec ce nom existe déjà.')
      }
      throw new Error(error.message || 'Erreur lors de la mise à jour de la catégorie.')
    }

    return data as Category
  },

  async archiveCategory(id: string): Promise<Category> {
    return this.updateCategory(id, { is_archived: true })
  },

  async restoreCategory(id: string): Promise<Category> {
    return this.updateCategory(id, { is_archived: false })
  },

  /**
   * Vérifie si la catégorie est liée à des transactions avant suppression.
   * Retourne true si des transactions existent.
   */
  async checkCategoryUsage(id: string): Promise<boolean> {
    const supabase = createClient()
    const { count, error } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', id)

    if (error) {
      throw new Error(error.message || 'Impossible de vérifier l\'utilisation de la catégorie.')
    }

    return (count || 0) > 0
  },

  async deleteCategory(id: string, force: boolean = false): Promise<void> {
    const supabase = createClient()

    if (!force) {
      const hasTransactions = await this.checkCategoryUsage(id)
      if (hasTransactions) {
        throw new Error('USED_BY_TRANSACTIONS')
      }
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(error.message || 'Erreur lors de la suppression de la catégorie.')
    }
  }
}
