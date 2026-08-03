import * as React from 'react'
import { cn } from '@/lib/utils'

interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  direction?: 'row' | 'col'
  spacing?: 'sm' | 'md' | 'lg' | 'xl'
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between'
}

/**
 * Stack
 * Abstraction Flexbox pour empiler des éléments verticalement ou horizontalement avec des espacements cohérents.
 */
export function Stack({
  className,
  children,
  direction = 'col',
  spacing = 'md',
  align = 'stretch',
  justify = 'start',
  ...props
}: StackProps) {
  return (
    <div
      className={cn(
        'flex',
        {
          'flex-col': direction === 'col',
          'flex-row': direction === 'row',
          // Spacing
          'gap-2': spacing === 'sm',
          'gap-4': spacing === 'md',
          'gap-6': spacing === 'lg',
          'gap-8': spacing === 'xl',
          // Alignment
          'items-start': align === 'start',
          'items-center': align === 'center',
          'items-end': align === 'end',
          'items-stretch': align === 'stretch',
          // Justify
          'justify-start': justify === 'start',
          'justify-center': justify === 'center',
          'justify-end': justify === 'end',
          'justify-between': justify === 'between',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
