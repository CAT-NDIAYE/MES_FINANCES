'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { storageService } from '@/lib/storage.service'

interface TourStep {
  targetId: string
  title: string
  description: string
  position: 'top' | 'bottom' | 'left' | 'right'
}

const TOUR_STEPS: TourStep[] = [
  {
    targetId: 'dashboard-stats',
    title: 'Tableau de bord',
    description: 'Visualisez un aperçu rapide de vos statistiques financières (revenus, dépenses, solde).',
    position: 'bottom',
  },
  {
    targetId: 'nav-transactions',
    title: 'Transactions',
    description: 'Accédez à l’historique complet de vos transactions et enregistrez-en de nouvelles.',
    position: 'top',
  },
  {
    targetId: 'nav-budgets',
    title: 'Budgets',
    description: 'Définissez des limites de dépenses par catégorie pour éviter les imprévus.',
    position: 'top',
  },
  {
    targetId: 'nav-saving-goals',
    title: 'Objectifs d’épargne',
    description: 'Planifiez vos projets d’épargne et suivez votre progression.',
    position: 'top',
  },
  {
    targetId: 'quick-actions',
    title: 'Actions rapides',
    description: 'Ajoutez des transactions ou des budgets en un seul clic !',
    position: 'top',
  },
  {
    targetId: 'nav-settings',
    title: 'Paramètres',
    description: 'Gérez votre profil, vos préférences d’affichage et relancez ce tutoriel.',
    position: 'top',
  },
]

export function ProductTour() {
  const [active, setActive] = React.useState(false)
  const [currentStep, setCurrentStep] = React.useState(0)
  const [coords, setCoords] = React.useState<{ top: number; left: number; width: number; height: number } | null>(null)

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      ;(window as any).startProductTour = () => {
        setCurrentStep(0)
        setActive(true)
      }
    }
  }, [])

  React.useEffect(() => {
    async function checkTour() {
      const completed = await storageService.isProductTourCompleted()
      if (!completed) {
        setTimeout(() => {
          setActive(true)
        }, 1500)
      }
    }
    checkTour()
  }, [])

  const step = TOUR_STEPS[currentStep]

  React.useEffect(() => {
    if (!active || !step) return

    const updateCoords = () => {
      const el = document.getElementById(step.targetId)
      if (el) {
        const rect = el.getBoundingClientRect()
        setCoords({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
        })
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      } else {
        setCoords(null)
      }
    }

    updateCoords()
    window.addEventListener('resize', updateCoords)
    return () => window.removeEventListener('resize', updateCoords)
  }, [active, step, currentStep])

  if (!active || !step) return null

  const handleNext = async () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      await handleFinish()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleFinish = async () => {
    setActive(false)
    await storageService.setProductTourCompleted(true)
  }

  const getTooltipStyle = (): React.CSSProperties => {
    if (!coords) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }

    const margin = 12
    const tooltipWidth = 280
    const tooltipHeight = 160

    switch (step.position) {
      case 'bottom':
        return {
          top: coords.top + coords.height + margin,
          left: Math.max(margin, Math.min(window.innerWidth - tooltipWidth - margin, coords.left + coords.width / 2 - tooltipWidth / 2)),
        }
      case 'left':
        return {
          top: coords.top + coords.height / 2 - tooltipHeight / 2,
          left: coords.left - tooltipWidth - margin,
        }
      case 'right':
        return {
          top: coords.top + coords.height / 2 - tooltipHeight / 2,
          left: coords.left + coords.width + margin,
        }
      case 'top':
      default:
        return {
          top: coords.top - tooltipHeight - margin - 20,
          left: Math.max(margin, Math.min(window.innerWidth - tooltipWidth - margin, coords.left + coords.width / 2 - tooltipWidth / 2)),
        }
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none select-none">
      <div
        className="absolute inset-0 bg-slate-950/70 transition-all duration-300 pointer-events-auto"
        style={{
          clipPath: coords
            ? `polygon(
                0% 0%, 
                0% 100%, 
                ${coords.left}px 100%, 
                ${coords.left}px ${coords.top}px, 
                ${coords.left + coords.width}px ${coords.top}px, 
                ${coords.left + coords.width}px ${coords.top + coords.height}px, 
                ${coords.left}px ${coords.top + coords.height}px, 
                ${coords.left}px 100%, 
                100% 100%, 
                100% 0%
              )`
            : undefined,
        }}
        onClick={handleFinish}
      />

      <div
        className="absolute w-72 rounded-2xl border border-slate-700 bg-[#1e293b] p-4 text-white shadow-2xl pointer-events-auto transition-all duration-300"
        style={getTooltipStyle()}
      >
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold text-emerald-400">{step.title}</h4>
          <span className="text-xs text-slate-400">
            {currentStep + 1} / {TOUR_STEPS.length}
          </span>
        </div>
        <p className="text-sm text-slate-300 mb-4">{step.description}</p>
        <div className="flex justify-between items-center">
          <Button variant="ghost" size="sm" onClick={handleFinish} className="text-slate-400 hover:text-white">
            Ignorer
          </Button>
          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button variant="outline" size="sm" onClick={handlePrev} className="border-slate-600 text-slate-300">
                Retour
              </Button>
            )}
            <Button size="sm" onClick={handleNext} className="bg-emerald-500 hover:bg-emerald-600">
              {currentStep === TOUR_STEPS.length - 1 ? 'Finir' : 'Suivant'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
