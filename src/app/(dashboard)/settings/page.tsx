'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { PageContainer, PageHeader } from '@/components/layout'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Icons } from '@/components/ui/icons'
import { useAuthContext } from '@/features/auth/contexts/AuthContext'
import { authService } from '@/features/auth/services/auth.service'

export default function SettingsPage() {
  const router = useRouter()
  const { user, profile, loading, updateProfile } = useAuthContext()

  const [fullName, setFullName] = React.useState(profile?.full_name ?? '')
  const [currency, setCurrency] = React.useState(profile?.currency ?? 'EUR')
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true)
  const [compactMode, setCompactMode] = React.useState(false)
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [isProfileSaving, setIsProfileSaving] = React.useState(false)
  const [isPasswordSaving, setIsPasswordSaving] = React.useState(false)

  React.useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? '')
      setCurrency(profile.currency ?? 'EUR')
    }
  }, [profile])

  React.useEffect(() => {
    if (typeof window === 'undefined') return

    const storedNotifications = window.localStorage.getItem(
      'mes-finances.notificationsEnabled'
    )
    const storedCompactMode = window.localStorage.getItem(
      'mes-finances.compactMode'
    )

    if (storedNotifications !== null) {
      setNotificationsEnabled(storedNotifications === 'true')
    }

    if (storedCompactMode !== null) {
      setCompactMode(storedCompactMode === 'true')
    }
  }, [])

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(
      'mes-finances.notificationsEnabled',
      String(notificationsEnabled)
    )
    window.localStorage.setItem('mes-finances.compactMode', String(compactMode))
  }, [notificationsEnabled, compactMode])

  const handleProfileSave = async () => {
    if (!user) return

    try {
      setIsProfileSaving(true)
      await updateProfile({ full_name: fullName.trim() || null, currency })
      toast.success('Profil mis à jour avec succès.')
    } catch (error) {
      toast.error('Impossible de mettre à jour votre profil.')
    } finally {
      setIsProfileSaving(false)
    }
  }

  const handlePasswordUpdate = async () => {
    if (!password || password.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas.')
      return
    }

    try {
      setIsPasswordSaving(true)
      await authService.updatePassword(password)
      setPassword('')
      setConfirmPassword('')
      toast.success('Mot de passe mis à jour avec succès.')
    } catch (error) {
      toast.error('Impossible de mettre à jour le mot de passe.')
    } finally {
      setIsPasswordSaving(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await authService.signOut()
      router.push('/login')
    } catch (error) {
      toast.error('Impossible de vous déconnecter.')
    }
  }

  return (
    <PageContainer>
      <PageHeader
        title="Paramètres"
        description="Gérez votre profil, vos préférences et votre sécurité"
      />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profil</CardTitle>
            <CardDescription>
              Personnalisez vos informations principales et votre devise.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="full-name">Nom complet</Label>
                <Input
                  id="full-name"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Votre nom"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Adresse e-mail</Label>
                <Input id="email" value={user?.email ?? ''} disabled />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Devise par défaut</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Choisir une devise" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="CAD">CAD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleProfileSave}
                disabled={isProfileSaving || loading}
              >
                {isProfileSaving
                  ? 'Enregistrement...'
                  : 'Enregistrer le profil'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Préférences</CardTitle>
            <CardDescription>
              Adaptez l’expérience de l’application à votre usage.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Recevoir des rappels utiles dans l’application.
                </p>
              </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">Mode compact</p>
                <p className="text-sm text-muted-foreground">
                  Réduire l’espace occupé par les cartes et listes.
                </p>
              </div>
              <Switch checked={compactMode} onCheckedChange={setCompactMode} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sécurité</CardTitle>
            <CardDescription>
              Mettez à jour votre mot de passe si nécessaire.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nouveau mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Minimum 8 caractères"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">
                Confirmer le mot de passe
              </Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Répétez votre mot de passe"
              />
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handlePasswordUpdate}
                disabled={isPasswordSaving}
              >
                {isPasswordSaving
                  ? 'Mise à jour...'
                  : 'Mettre à jour le mot de passe'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compte</CardTitle>
            <CardDescription>
              Gérez votre session de manière simple.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={handleSignOut} className="gap-2">
              <Icons.logout className="h-4 w-4" />
              Se déconnecter
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}
