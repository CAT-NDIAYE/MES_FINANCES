import { redirect } from 'next/navigation'

/**
 * La page racine redirige vers /dashboard.
 * Les utilisateurs non-authentifiés seront interceptés par le middleware
 * et redirigés vers /login.
 */
export default function Home() {
  redirect('/dashboard')
}
