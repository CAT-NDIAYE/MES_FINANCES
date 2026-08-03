'use client'

import { useState } from 'react' 
import { useForm } from 'react-hook-form'//bibliothèque qui gère les formulaires (valeurs saisies, erreurs, soumission) sans que tu aies à tout coder toi-même.
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'//bibliothèque de validation. On définit des "règles" que les données doivent respecter.
import { useAuth } from '../hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const { signIn } = useAuth()//un hook personnalisé (défini ailleurs dans le projet) qui fournit une fonction signIn pour connecter l'utilisateur.
  const router = useRouter()//hook de Next.js pour naviguer entre les pages (ex: rediriger vers /dashboard).
  const [isLoading, setIsLoading] = useState(false)//: un booléen (true/false) pour savoir si la connexion est en cours, afin de désactiver le bouton et afficher un texte différent.

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema)
  }) //handleSubmit : fonction qui valide les données avant d'appeler ta fonction de soumission

  const onSubmit = async (data: LoginFormValues) => { //Cette fonction est appelée seulement si les données passent la validation zod
    setIsLoading(true) //Si l'utilisateur est connecté 
    try {
      await signIn(data.email, data.password)//tente de connecter l'utilisateur avec l'email/mot de passe
      toast.success('Connexion réussie') //affiche une notification de succès
      router.push('/dashboard')//redirige vers /dashboard
    } catch (error: any) {
      toast.error(error.message || 'Email ou mot de passe incorrect')
    } finally {
      setIsLoading(false) //dans tous les cas, remet isLoading à false à la fin
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="nom@exemple.com" {...register('email') /* branche ce champ au formulaire sous le nom "email" */} /> 
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Mot de passe</Label>
          <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
            Mot de passe oublié ?
          </Link>
        </div>
        <Input id="password" type="password" {...register('password')} />
        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Connexion en cours...' : 'Se connecter'}
      </Button>
    </form>
  )
}
