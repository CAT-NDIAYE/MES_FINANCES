import * as React from 'react'
import { cn } from '@/lib/utils'

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  cols?: 1 | 2 | 3 | 4 | 12
  gap?: 'sm' | 'md' | 'lg'
}

/**
 * Grid
 * Abstraction CSS Grid simple et réutilisable. Mobile-first (1 colonne par défaut, s'étend sur desktop).
 */
export function Grid({
  className,
  children,
  cols = 1,
  gap = 'md',
  ...props
}: GridProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1',
        {
          'md:grid-cols-2': cols === 2,
          'md:grid-cols-3': cols === 3,
          'md:grid-cols-4 lg:grid-cols-4': cols === 4,
          'md:grid-cols-12': cols === 12,
          
          'gap-2': gap === 'sm',
          'gap-4': gap === 'md',
          'gap-6': gap === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
