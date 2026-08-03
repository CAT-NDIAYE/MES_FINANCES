import { Spinner } from './Spinner'

export function PageLoader() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <Spinner size="lg" className="text-primary" />
      <p className="text-sm text-muted-foreground animate-pulse">Chargement en cours...</p>
    </div>
  )
}
