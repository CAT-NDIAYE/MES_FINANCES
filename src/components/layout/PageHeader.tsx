import * as React from 'react'
import { cn } from '@/lib/utils'

interface PageHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
}

export function PageHeader({
  className,
  title,
  description,
  action,
  ...props
}: PageHeaderProps) {
  return (
    <div
      className={cn('flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8', className)}
      {...props}
    >
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          {title}
        </h1>
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
