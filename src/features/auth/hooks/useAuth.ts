'use client'

import { useRouter } from 'next/navigation'
import { useAuthContext } from '../contexts/AuthContext'
import { authService } from '../services/auth.service'

export function useAuth() {
  const { user, profile, loading } = useAuthContext()
  const router = useRouter()

  const signOut = async () => {
    await authService.signOut()
    router.push('/login')
  }

  return {
    user,
    profile,
    loading,
    signIn: authService.signIn,
    signUp: authService.signUp,
    signOut,
    resetPassword: authService.resetPassword,
    updatePassword: authService.updatePassword,
  }
}
