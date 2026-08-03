'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { authService } from '../services/auth.service'

type Profile = {
  id: string
  full_name: string | null
  avatar_url: string | null
  currency: string
}

type AuthContextType = {
  user: User | null
  profile: Profile | null
  loading: boolean
  updateProfile: (updates: Partial<Profile>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user?.id) {
      throw new Error('Utilisateur non connecté.')
    }

    const updatedProfile = await authService.updateProfile(user.id, {
      full_name: updates.full_name,
      currency: updates.currency,
    })

    setProfile((currentProfile) =>
      currentProfile
        ? { ...currentProfile, ...updatedProfile }
        : (updatedProfile as Profile | null)
    )
  }

  useEffect(() => {
    const supabase = createClient()

    // Fonction pour charger la session initiale
    const loadSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setUser(session?.user ?? null)

        if (session?.user) {
          const userProfile = await authService.getProfile(session.user.id)
          setProfile(userProfile)
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la session:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSession()

    // Écouteur des changements d'état de l'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      setLoading(true)

      if (session?.user) {
        try {
          const userProfile = await authService.getProfile(session.user.id)
          setProfile(userProfile)
        } catch (error) {
          console.error('Erreur lors de la récupération du profil:', error)
          setProfile(null)
        }
      } else {
        setProfile(null)
      }

      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, profile, loading, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
