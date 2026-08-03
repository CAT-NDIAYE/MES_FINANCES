'use client'

import * as React from 'react'
import { ResponsiveContainer } from 'recharts'
import { cn } from '@/lib/utils'

interface ChartWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactElement
  height?: number | string
  minHeight?: number
}

/**
 * ChartWrapper
 * Fournit un ResponsiveContainer pour s'assurer que les graphiques Recharts 
 * s'adaptent parfaitement au parent, en mode responsive.
 */
export function ChartWrapper({
  children,
  height = '100%',
  minHeight = 300,
  className,
  ...props
}: ChartWrapperProps) {
  return (
    <div
      className={cn('w-full', className)}
      style={{ height, minHeight }}
      {...props}
    >
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  )
}
