import { RegisterForm } from '@/features/auth/components/RegisterForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function RegisterPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Inscription</CardTitle>
        <CardDescription>Créez votre compte MesFinances</CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm />
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Vous avez déjà un compte ?{' '}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Se connecter
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
