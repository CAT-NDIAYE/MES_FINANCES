'use client'

import * as React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, ArrowUpRight, PiggyBank, PieChart } from 'lucide-react'

export function QuickActions() {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Actions rapides</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        <Button className="justify-start gap-2" variant="outline" render={<Link href="/transactions" />}>
          <Plus className="h-4 w-4" /> Ajouter une transaction
        </Button>
        <Button className="justify-start gap-2" variant="outline" render={<Link href="/transactions" />}>
          <ArrowUpRight className="h-4 w-4" /> Ajouter un revenu
        </Button>
        <Button className="justify-start gap-2" variant="outline" render={<Link href="/budgets" />}>
          <PieChart className="h-4 w-4" /> Créer un budget
        </Button>
        <Button className="justify-start gap-2" variant="outline" render={<Link href="/saving-goals" />}>
          <PiggyBank className="h-4 w-4" /> Créer un objectif d’épargne
        </Button>
      </CardContent>
    </Card>
  )
}
