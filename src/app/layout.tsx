import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/features/auth/contexts/AuthContext'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Providers } from '@/components/providers/Providers'
import PWAClientShell from '@/app/pwa'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'MesFinances — Gestion financière personnelle',
  description:
    'Gérez vos finances personnelles de manière simple et efficace avec MesFinances.',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MesFinances',
  },
  icons: {
    icon: [{ url: '/icons/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
    apple: [
      { url: '/icons/icon.svg', sizes: '180x180', type: 'image/svg+xml' },
    ],
  },
  openGraph: {
    title: 'MesFinances',
    description: 'Gestion financière personnelle installable',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MesFinances',
    description: 'Gestion financière personnelle installable',
  },
}

export const viewport: Viewport = {
  themeColor: '#10b981',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <TooltipProvider>
            <AuthProvider>
              <PWAClientShell>{children}</PWAClientShell>
              <Toaster richColors position="top-right" />
            </AuthProvider>
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  )
}
