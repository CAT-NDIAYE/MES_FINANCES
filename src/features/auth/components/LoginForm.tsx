'use client'

import { useState } from 'react' 
import { useForm } from 'react-hook-form'//bibliothèque qui gère les formulaires (valeurs saisies, erreurs, soumission) sans que tu aies à tout coder toi-même.
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'//bibliothèque de validation. On définit des "règles" que les données doivent respecter.
import { useAuth } from '../hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Icons } from '@/components/ui/icons'
import { toast } from 'sonner'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const { signIn } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    try {
      await signIn(data.email, data.password)
      toast.success('Connexion réussie')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Email ou mot de passe incorrect')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          type="email" 
          placeholder="nom@exemple.com" 
          autoComplete="email"
          inputMode="email"
          autoCapitalize="none"
          {...register('email')} 
        /> 
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Mot de passe</Label>
          <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
            Mot de passe oublié ?
          </Link>
        </div>
        <div className="relative">
          <Input 
            id="password" 
            type={showPassword ? 'text' : 'password'} 
            autoComplete="current-password"
            autoCapitalize="none"
            autoCorrect="off"
            className="pr-10"
            {...register('password')} 
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showPassword ? <Icons.eyeOff className="h-4 w-4" /> : <Icons.eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Connexion en cours...' : 'Se connecter'}
      </Button>
    </form>
  )
}
