'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface BudgetProgressBarProps {
  value: number
  className?: string
  showLabel?: boolean
}

export function BudgetProgressBar({
  value,
  className,
  showLabel = true,
}: BudgetProgressBarProps) {
  const clampedValue = Math.max(0, Math.min(100, value))

  return (
    <div className={cn('w-full', className)}>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">Progression</span>
        {showLabel && (
          <span className="text-muted-foreground">{clampedValue}%</span>
        )}
      </div>
      <div
        className="h-2.5 overflow-hidden rounded-full bg-muted"
        aria-hidden="true"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 transition-all duration-500"
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  )
}
