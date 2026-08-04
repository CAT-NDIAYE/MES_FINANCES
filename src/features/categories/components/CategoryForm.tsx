'use client'

import * as React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { categorySchema, CategoryFormValues } from '../schemas/category.schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { IconPicker } from './IconPicker'
import { ColorPicker } from './ColorPicker'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface CategoryFormProps {
  defaultValues?: Partial<CategoryFormValues>
  onSubmit: (values: CategoryFormValues) => void
  isLoading?: boolean
  submitLabel?: string
  onCancel?: () => void
}

export function CategoryForm({
  defaultValues,
  onSubmit,
  isLoading,
  submitLabel = 'Enregistrer',
  onCancel,
}: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      type: 'expense',
      icon: 'Wallet',
      color: '#10B981',
      description: '',
      sort_order: 0,
      ...defaultValues,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Type */}
      <div className="space-y-2">
        <Label htmlFor="type">Type de flux</Label>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select onValueChange={(val) => field.onChange(val as any)} value={field.value}>
              <SelectTrigger id="type" className="w-full">
                <SelectValue placeholder="Sélectionner le type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expense">Dépense 🔴</SelectItem>
                <SelectItem value="income">Revenu 🟢</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.type && <p className="text-xs text-red-500">{errors.type.message}</p>}
      </div>

      {/* Nom */}
      <div className="space-y-2">
        <Label htmlFor="name">Nom de la catégorie</Label>
        <Input
          id="name"
          placeholder="Ex: Alimentation, Cadeaux..."
          disabled={isLoading}
          {...register('name')}
        />
        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description (optionnelle)</Label>
        <Textarea
          id="description"
          placeholder="Ex: Abonnements Netflix, Spotify..."
          disabled={isLoading}
          rows={2}
          {...register('description')}
        />
        {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
      </div>

      {/* Icône & Couleur (sur la même ligne) */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Icône</Label>
          <Controller
            name="icon"
            control={control}
            render={({ field }) => (
              <IconPicker value={field.value} onChange={field.onChange} />
            )}
          />
          {errors.icon && <p className="text-xs text-red-500">{errors.icon.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Couleur</Label>
          <Controller
            name="color"
            control={control}
            render={({ field }) => (
              <ColorPicker value={field.value} onChange={field.onChange} />
            )}
          />
          {errors.color && <p className="text-xs text-red-500">{errors.color.message}</p>}
        </div>
      </div>

      {/* Ordre d'affichage */}
      <div className="space-y-2">
        <Label htmlFor="sort_order">Ordre d&apos;affichage (Optionnel)</Label>
        <Input
          id="sort_order"
          type="number"
          placeholder="0"
          disabled={isLoading}
          {...register('sort_order', { valueAsNumber: true })}
        />
        {errors.sort_order && <p className="text-xs text-red-500">{errors.sort_order.message}</p>}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Annuler
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Enregistrement...' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
