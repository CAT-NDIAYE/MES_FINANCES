'use client'

import * as React from 'react'
import * as Lucide from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

// ~30 finance-relevant Lucide icons
const ICON_OPTIONS = [
  { name: 'Wallet', component: Lucide.Wallet },
  { name: 'CreditCard', component: Lucide.CreditCard },
  { name: 'Banknote', component: Lucide.Banknote },
  { name: 'Landmark', component: Lucide.Landmark },
  { name: 'PiggyBank', component: Lucide.PiggyBank },
  { name: 'Receipt', component: Lucide.Receipt },
  { name: 'Coins', component: Lucide.Coins },
  { name: 'Calculator', component: Lucide.Calculator },
  { name: 'Home', component: Lucide.Home },
  { name: 'Car', component: Lucide.Car },
  { name: 'Plane', component: Lucide.Plane },
  { name: 'Utensils', component: Lucide.Utensils },
  { name: 'Coffee', component: Lucide.Coffee },
  { name: 'ShoppingCart', component: Lucide.ShoppingCart },
  { name: 'ShoppingBag', component: Lucide.ShoppingBag },
  { name: 'Gift', component: Lucide.Gift },
  { name: 'Heart', component: Lucide.Heart },
  { name: 'Stethoscope', component: Lucide.Stethoscope },
  { name: 'Briefcase', component: Lucide.Briefcase },
  { name: 'GraduationCap', component: Lucide.GraduationCap },
  { name: 'Gamepad2', component: Lucide.Gamepad2 },
  { name: 'Tv', component: Lucide.Tv },
  { name: 'Smartphone', component: Lucide.Smartphone },
  { name: 'Wifi', component: Lucide.Wifi },
  { name: 'Zap', component: Lucide.Zap },
  { name: 'Wrench', component: Lucide.Wrench },
  { name: 'Shield', component: Lucide.Shield },
  { name: 'TrendingUp', component: Lucide.TrendingUp },
  { name: 'Sparkles', component: Lucide.Sparkles },
  { name: 'Package', component: Lucide.Package },
  { name: 'User', component: Lucide.User },
  { name: 'Activity', component: Lucide.Activity },
]

interface IconPickerProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function IconPicker({ value, onChange, className }: IconPickerProps) {
  const SelectedIcon = React.useMemo(() => {
    const found = ICON_OPTIONS.find((opt) => opt.name === value)
    return found ? found.component : null
  }, [value])

  return (
    <Popover>
      {/* Base UI: PopoverTrigger renders as <button> by default. Use render prop to merge with our Button. */}
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            className={cn('w-full justify-between h-10 px-3 font-normal', className)}
            aria-label="Sélectionner une icône"
          />
        }
      >
        <span className="flex items-center gap-2">
          {SelectedIcon ? (
            <SelectedIcon className="h-5 w-5 text-muted-foreground" />
          ) : (
            <span className="text-xl leading-none">{value || '❓'}</span>
          )}
          <span className="text-sm text-muted-foreground">
            {SelectedIcon ? value : 'Icône personnalisée'}
          </span>
        </span>
        <Lucide.ChevronDown className="h-4 w-4 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-3" align="start">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Sélectionner une icône
        </h4>
        <div className="grid grid-cols-6 gap-2 max-h-[220px] overflow-y-auto pr-1">
          {ICON_OPTIONS.map((opt) => {
            const Icon = opt.component
            const isSelected = opt.name === value
            return (
              <Button
                key={opt.name}
                type="button"
                variant={isSelected ? 'default' : 'ghost'}
                className={cn('h-10 w-10 p-0 rounded-md', isSelected && 'bg-primary')}
                onClick={() => onChange(opt.name)}
                aria-label={`Icône ${opt.name}`}
              >
                <Icon className={cn('h-5 w-5', isSelected ? 'text-primary-foreground' : 'text-foreground')} />
              </Button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}

/** Renders a Lucide icon or emoji by name string. */
export function renderCategoryIcon(iconName: string | null, className?: string) {
  if (!iconName) return <Lucide.HelpCircle className={className} />

  const IconComponent = (Lucide as Record<string, unknown>)[iconName] as Lucide.LucideIcon | undefined
  if (IconComponent) {
    return <IconComponent className={className} />
  }

  // Fallback: emoji (default categories)
  return <span className={cn('text-xl leading-none', className)}>{iconName}</span>
}
