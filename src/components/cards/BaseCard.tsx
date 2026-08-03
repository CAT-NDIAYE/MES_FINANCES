import * as React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface BaseCardProps extends Omit<React.ComponentProps<typeof Card>, 'title'> {
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  footer?: React.ReactNode
}

/**
 * BaseCard
 * Wrapper autour de shadcn Card pour simplifier la création de cartes standards.
 */
export function BaseCard({
  className,
  title,
  description,
  action,
  footer,
  children,
  ...props
}: BaseCardProps) {
  return (
    <Card className={cn('overflow-hidden', className)} {...props}>
      {(title || description || action) && (
        <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
          <div className="space-y-1.5">
            {title && <CardTitle className="text-base">{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {action && <div>{action}</div>}
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
      {footer && <CardFooter className="bg-muted/50 py-3">{footer}</CardFooter>}
    </Card>
  )
}
