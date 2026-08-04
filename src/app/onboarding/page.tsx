'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { storageService } from '@/lib/storage.service'
import { cn } from '@/lib/utils'

const STEPS = [
  {
    icon: Icons.wallet,
    title: 'Gerez votre argent en toute simplicite',
    description: 'Suivez facilement vos revenus et depenses au quotidien.',
  },
  {
    icon: Icons.budgets,
    title: 'Controlez vos budgets',
    description: 'Visualisez vos budgets et evitez les depassements.',
  },
  {
    icon: Icons.goals,
    title: "Atteignez vos objectifs d'epargne",
    description: 'Suivez votre progression et realisez vos projets.',
  },
  {
    icon: Icons.trendingUp,
    title: 'Vos finances, partout avec vous',
    description:
      'Retrouvez toutes vos donnees en toute securite sur tous vos appareils.',
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = React.useState(0)

  const handleNext = async () => {
    if (currentStep < STEPS.length - 1) {
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
    await storageService.setOnboardingCompleted(true)
    router.push('/login')
  }

  const step = STEPS[currentStep]
  const IconComponent = step.icon

  return (
    <main className="flex min-h-screen flex-col bg-[#0f172a] text-white">
      {/* Skip Button */}
      <div className="flex justify-end p-4">
        {currentStep < STEPS.length - 1 && (
          <Button
            variant="ghost"
            onClick={handleFinish}
            className="text-slate-400 hover:text-white"
          >
            Passer
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="mb-8 flex h-40 w-40 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 animate-pulse">
          <IconComponent className="h-20 w-20" />
        </div>
        <h1 className="text-2xl font-bold text-slate-100 sm:text-3xl">
          {step.title}
        </h1>
        <p className="mt-4 max-w-sm text-base text-slate-400">
          {step.description}
        </p>
      </div>

      {/* Footer Navigation */}
      <div className="flex flex-col gap-6 p-6">
        {/* Indicators */}
        <div className="flex justify-center gap-2">
          {STEPS.map((_, index) => (
            <div
              key={index}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                index === currentStep ? 'w-8 bg-[#10b981]' : 'w-2 bg-slate-600'
              )}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-between gap-4">
          {currentStep > 0 ? (
            <Button
              variant="outline"
              onClick={handlePrev}
              className="w-1/3 border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Precedent
            </Button>
          ) : (
            <div className="w-1/3" />
          )}

          <Button
            onClick={handleNext}
            className="w-1/2 bg-[#10b981] text-white hover:bg-[#0d9488]"
          >
            {currentStep === STEPS.length - 1 ? 'Commencer' : 'Suivant'}
          </Button>
        </div>
      </div>
    </main>
  )
}
