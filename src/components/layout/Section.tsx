import * as React from 'react'
import { cn } from '@/lib/utils'

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
}

/**
 * Section
 * Wrapper sémantique pour délimiter les grandes parties d'une page avec un espacement standard.
 */
export function Section({ className, children, ...props }: SectionProps) {
  return (
    <section className={cn('py-6 md:py-8', className)} {...props}>
      {children}
    </section>
  )
}
