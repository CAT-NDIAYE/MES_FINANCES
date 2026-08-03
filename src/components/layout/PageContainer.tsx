import * as React from 'react'
import { cn } from '@/lib/utils'

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

/**
 * PageContainer
 * Définit la largeur maximale et les marges principales d'une page.
 */
export function PageContainer({ className, children, ...props }: PageContainerProps) {
  return (
    <div
      className={cn('container mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8', className)}
      {...props}
    >
      {children}
    </div>
  )
}
