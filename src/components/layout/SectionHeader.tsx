import * as React from 'react'
import { cn } from '@/lib/utils'

interface SectionHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
}

export function SectionHeader({
  className,
  title,
  description,
  action,
  ...props
}: SectionHeaderProps) {
  return (
    <div
      className={cn('flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-4', className)}
      {...props}
    >
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  )
}
