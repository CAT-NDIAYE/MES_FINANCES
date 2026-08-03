'use client'

import { useAuthContext } from '../contexts/AuthContext'
import { authService } from '../services/auth.service'

export function useAuth() {
  const { user, profile, loading } = useAuthContext()

  return {
    user,
    profile,
    loading,
    signIn: authService.signIn,
    signUp: authService.signUp,
    signOut: authService.signOut,
    resetPassword: authService.resetPassword,
    updatePassword: authService.updatePassword,
  }
}
