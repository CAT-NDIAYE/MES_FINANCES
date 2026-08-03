'use client'

import * as React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { CalendarIcon, PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import {
  transactionSchema,
  type TransactionFormValues,
} from '../schemas/transaction.schema'
import { useCategories } from '@/features/categories/hooks/useCategories'
import type { Transaction, TransactionType } from '../types'

interface TransactionFormProps {
  defaultValues?: Partial<TransactionFormValues>
  onSubmit: (values: TransactionFormValues) => Promise<void> | void
  isLoading?: boolean
  submitLabel?: string
  onCancel?: () => void
  editingTransaction?: Transaction | null
}

export function TransactionForm({
  defaultValues,
  onSubmit,
  isLoading,
  submitLabel = 'Enregistrer',
  onCancel,
  editingTransaction,
}: TransactionFormProps) {
  const { categories } = useCategories()
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    defaultValues?.transaction_date
      ? new Date(defaultValues.transaction_date)
      : undefined
  )

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'expense',
      amount: 0,
      category_id: '',
      description: '',
      transaction_date:
        defaultValues?.transaction_date ??
        new Date().toISOString().slice(0, 10),
      ...defaultValues,
    },
  })

  React.useEffect(() => {
    if (editingTransaction) {
      setValue('type', editingTransaction.type)
      setValue('amount', editingTransaction.amount)
      setValue('category_id', editingTransaction.category_id ?? '')
      setValue('description', editingTransaction.description ?? '')
      setValue('transaction_date', editingTransaction.transaction_date)
      setSelectedDate(new Date(editingTransaction.transaction_date))
    }
  }, [editingTransaction, setValue])

  const visibleCategories = React.useMemo(() => {
    return categories.filter((category) => !category.is_archived)
  }, [categories])

  const handleDateSelect = (date?: Date) => {
    setSelectedDate(date)
    if (date) {
      setValue('transaction_date', format(date, 'yyyy-MM-dd'))
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="type">Type</Label>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select
              onValueChange={(value: TransactionType) => field.onChange(value)}
              value={field.value}
            >
              <SelectTrigger id="type" className="w-full">
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expense">Dépense</SelectItem>
                <SelectItem value="income">Revenu</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.type && (
          <p className="text-xs text-red-500">{errors.type.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Montant</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0"
          disabled={isLoading}
          {...register('amount', { valueAsNumber: true })}
        />
        {errors.amount && (
          <p className="text-xs text-red-500">{errors.amount.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category_id">Catégorie</Label>
        <Controller
          name="category_id"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger id="category_id" className="w-full">
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {visibleCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.category_id && (
          <p className="text-xs text-red-500">{errors.category_id.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          maxLength={250}
          disabled={isLoading}
          rows={3}
          {...register('description')}
        />
        {errors.description && (
          <p className="text-xs text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Date</Label>
        <Popover>
          <PopoverTrigger
            render={
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start gap-2"
              />
            }
          >
            <CalendarIcon className="h-4 w-4" />
            {selectedDate
              ? format(selectedDate, 'PPP', { locale: fr })
              : 'Choisir une date'}
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors.transaction_date && (
          <p className="text-xs text-red-500">
            {errors.transaction_date.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3 border-t pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Annuler
          </Button>
        )}
        <Button type="submit" disabled={isLoading} className="gap-2">
          <PlusCircle className="h-4 w-4" />
          {isLoading ? 'Enregistrement...' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
