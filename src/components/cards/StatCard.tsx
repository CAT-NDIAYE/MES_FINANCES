import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { type Icon } from '@/components/ui/icons'

interface StatCardProps extends React.ComponentProps<typeof Card> {
  title: string
  value: string | number
  icon?: Icon
  trend?: {
    value: number
    label: string
    isPositive?: boolean
  }
}

/**
 * StatCard
 * Carte pour afficher une statistique clé (KPI) avec éventuellement une tendance.
 */
export function StatCard({
  className,
  title,
  value,
  icon: IconComponent,
  trend,
  ...props
}: StatCardProps) {
  return (
    <Card className={cn('', className)} {...props}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {IconComponent && (
          <IconComponent className="h-4 w-4 text-muted-foreground" />
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p
            className={cn('text-xs mt-1', {
              'text-success': trend.isPositive,
              'text-destructive': trend.isPositive === false,
              'text-muted-foreground': trend.isPositive === undefined,
            })}
          >
            {trend.isPositive ? '+' : ''}
            {trend.value}% {trend.label}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
