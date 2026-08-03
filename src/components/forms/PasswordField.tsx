import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Icons } from '@/components/ui/icons'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface PasswordFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

/**
 * PasswordField
 * Input de type mot de passe avec un bouton pour afficher/masquer le texte.
 */
export const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)

    return (
      <div className="relative">
        <Input
          type={showPassword ? 'text' : 'password'}
          className={cn('pr-10', className)}
          ref={ref}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground"
          onClick={() => setShowPassword((prev) => !prev)}
          tabIndex={-1}
        >
          {showPassword ? (
            <Icons.eyeOff className="h-4 w-4" />
          ) : (
            <Icons.eye className="h-4 w-4" />
          )}
          <span className="sr-only">
            {showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          </span>
        </Button>
      </div>
    )
  }
)
PasswordField.displayName = 'PasswordField'
