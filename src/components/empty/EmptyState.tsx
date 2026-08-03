import * as React from 'react'
import { cn } from '@/lib/utils'
import { Icons, type Icon } from '@/components/ui/icons'
import { Button } from '@/components/ui/button'

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description: string
  icon?: Icon
  actionLabel?: string
  onAction?: () => void
}

/**
 * EmptyState
 * Composant utilisé pour afficher un état vide (aucune transaction, etc.)
 */
export function EmptyState({
  className,
  title,
  description,
  icon: IconComponent = Icons.info,
  actionLabel,
  onAction,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center animate-in fade-in-50',
        className
      )}
      {...props}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
        <IconComponent className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-4">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="outline">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
