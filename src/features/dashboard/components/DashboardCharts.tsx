'use client'

import * as React from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/feedback/Spinner'
import type { CategorySpend, MonthlyPoint } from '../types'

const ResponsiveContainer = dynamic(
  () => import('recharts').then((mod) => mod.ResponsiveContainer),
  { ssr: false }
)
const BarChart = dynamic(() => import('recharts').then((mod) => mod.BarChart), {
  ssr: false,
})
const Bar = dynamic(() => import('recharts').then((mod) => mod.Bar), {
  ssr: false,
})
const LineChart = dynamic(
  () => import('recharts').then((mod) => mod.LineChart),
  { ssr: false }
)
const Line = dynamic(() => import('recharts').then((mod) => mod.Line), {
  ssr: false,
})
const PieChart = dynamic(() => import('recharts').then((mod) => mod.PieChart), {
  ssr: false,
})
const Pie = dynamic(() => import('recharts').then((mod) => mod.Pie), {
  ssr: false,
})
const Cell = dynamic(() => import('recharts').then((mod) => mod.Cell), {
  ssr: false,
})
const XAxis = dynamic(() => import('recharts').then((mod) => mod.XAxis), {
  ssr: false,
})
const YAxis = dynamic(() => import('recharts').then((mod) => mod.YAxis), {
  ssr: false,
})
const CartesianGrid = dynamic(
  () => import('recharts').then((mod) => mod.CartesianGrid),
  { ssr: false }
)
const Tooltip = dynamic(() => import('recharts').then((mod) => mod.Tooltip), {
  ssr: false,
})
const Legend = dynamic(() => import('recharts').then((mod) => mod.Legend), {
  ssr: false,
})

interface DashboardChartsProps {
  monthly: MonthlyPoint[]
  expensesByCategory: CategorySpend[]
  topCategories: CategorySpend[]
}

export function DashboardCharts({
  monthly,
  expensesByCategory,
  topCategories,
}: DashboardChartsProps) {
  const palette = ['#0ea5e9', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6']

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Revenus vs Dépenses</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="income" fill="#10b981" name="Revenus" />
              <Bar dataKey="expense" fill="#f43f5e" name="Dépenses" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Évolution mensuelle</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="#0ea5e9"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Répartition des dépenses</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expensesByCategory}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
              >
                {expensesByCategory.map((entry, index) => (
                  <Cell
                    key={`${entry.name}-${index}`}
                    fill={palette[index % palette.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Top catégories</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topCategories}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} />
              <Tooltip />
              <Bar dataKey="value" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
