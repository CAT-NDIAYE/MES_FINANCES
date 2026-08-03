'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Check, ChevronDown } from 'lucide-react'

const COLOR_OPTIONS = [
  { name: 'Émeraude', value: '#10B981' },
  { name: 'Bleu', value: '#3B82F6' },
  { name: 'Vert', value: '#22C55E' },
  { name: 'Rouge', value: '#EF4444' },
  { name: 'Orange', value: '#F59E0B' },
  { name: 'Violet', value: '#8B5CF6' },
  { name: 'Rose', value: '#EC4899' },
  { name: 'Indigo', value: '#6366F1' },
  { name: 'Cyan', value: '#06B6D4' },
  { name: 'Teal', value: '#14B8A6' },
  { name: 'Jaune', value: '#EAB308' },
  { name: 'Gris', value: '#6B7280' },
]

interface ColorPickerProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function ColorPicker({ value, onChange, className }: ColorPickerProps) {
  const activeColor = React.useMemo(() => {
    return COLOR_OPTIONS.find((opt) => opt.value.toLowerCase() === value.toLowerCase()) ?? { name: 'Personnalisée', value }
  }, [value])

  return (
    <Popover>
      {/* Base UI: PopoverTrigger renders as <button> by default. Use render prop to compose with our Button. */}
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            className={cn('w-full justify-between h-10 px-3 font-normal', className)}
            aria-label="Sélectionner une couleur"
          />
        }
      >
        <span className="flex items-center gap-2">
          <span
            className="h-5 w-5 rounded-full border border-black/10 shrink-0"
            style={{ backgroundColor: value || '#10B981' }}
          />
          <span className="text-sm text-muted-foreground">{activeColor.name}</span>
        </span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-3" align="start">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Sélectionner une couleur
        </h4>
        <div className="grid grid-cols-4 gap-2">
          {COLOR_OPTIONS.map((opt) => {
            const isSelected = opt.value.toLowerCase() === value.toLowerCase()
            return (
              <button
                key={opt.value}
                type="button"
                className="relative h-10 w-full rounded-md border border-black/10 hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                style={{ backgroundColor: opt.value }}
                onClick={() => onChange(opt.value)}
                aria-label={`Couleur ${opt.name}`}
              >
                {isSelected && (
                  <Check className="h-4 w-4 text-white absolute inset-0 m-auto drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]" />
                )}
              </button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
