import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ResetPasswordPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Réinitialisation</CardTitle>
        <CardDescription>Choisissez un nouveau mot de passe</CardDescription>
      </CardHeader>
      <CardContent>
        <ResetPasswordForm />
      </CardContent>
    </Card>
  )
}
