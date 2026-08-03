import * as React from 'react'

interface AuthLayoutProps {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">MesFinances</h1>
          <p className="text-muted-foreground mt-2">Votre gestionnaire financier personnel</p>
        </div>
        {children}
      </div>
    </div>
  )
}
