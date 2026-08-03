import { createClient } from '@/lib/supabase/client'

export const authService = {
  async signUp(email: string, password: string, fullName: string) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) throw error
    return data
  },

  async signIn(email: string, password: string) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  },

  async signOut() {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async resetPassword(email: string) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) throw error
    return data
  },

  async updatePassword(password: string) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.updateUser({ password })
    if (error) throw error
    return data
  },

  async getProfile(userId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  },

  async updateProfile(
    userId: string,
    updates: { full_name?: string | null; currency?: string }
  ) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select('*')
      .single()

    if (error) throw error
    return data
  },
}
