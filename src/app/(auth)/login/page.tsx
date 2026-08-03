import { LoginForm } from '@/features/auth/components/LoginForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Connexion</CardTitle>
        <CardDescription>Entrez vos identifiants pour accéder à votre compte</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Pas encore de compte ?{' '}
          <Link href="/register" className="text-primary hover:underline font-medium">
            S&apos;inscrire
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
