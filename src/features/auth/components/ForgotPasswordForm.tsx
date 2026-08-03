'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import Link from 'next/link'

const forgotPasswordSchema = z.object({
  email: z.string().email('Email invalide'),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export function ForgotPasswordForm() {
  const { resetPassword } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema)
  })

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true)
    try {
      await resetPassword(data.email)
      setIsSent(true)
      toast.success('Lien de réinitialisation envoyé !')
    } catch (error: any) {
      toast.error(error.message || 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSent) {
    return (
      <div className="text-center space-y-4">
        <p className="text-sm text-gray-600">
          Si un compte existe avec cette adresse email, un lien de réinitialisation vous a été envoyé.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center w-full h-8 rounded-lg border border-border bg-background px-2.5 text-sm font-medium hover:bg-muted transition-colors"
        >
          Retour à la connexion
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="nom@exemple.com" {...register('email')} />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Envoi en cours...' : 'Envoyer le lien'}
      </Button>
      
      <div className="text-center">
        <Link href="/login" className="text-sm text-blue-600 hover:underline">
          Retour à la connexion
        </Link>
      </div>
    </form>
  )
}
