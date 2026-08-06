import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/features/auth/contexts/AuthContext'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Providers } from '@/components/providers/Providers'
import { MobileFlowProvider } from '@/components/providers/MobileFlowProvider'
import { LayoutWrapper } from '@/components/providers/LayoutWrapper'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'MesFinances',
  description: 'Gestion financière',
}

export const viewport: Viewport = {
  themeColor: '#10b981',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-[#0f172a]" suppressHydrationWarning>
        <Providers>
          <TooltipProvider>
            <AuthProvider>
              <MobileFlowProvider>
                <LayoutWrapper>{children}</LayoutWrapper>
              </MobileFlowProvider>
              <Toaster richColors position="top-right" />
            </AuthProvider>
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  )
}
