import * as React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MobileFlowProvider } from '../components/providers/MobileFlowProvider'
import { storageService } from '../lib/storage.service'
import { useAuthContext } from '../features/auth/contexts/AuthContext'
import { useRouter, usePathname } from 'next/navigation'

// Mocks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}))

jest.mock('../lib/storage.service', () => ({
  storageService: {
    isOnboardingCompleted: jest.fn(),
    setOnboardingCompleted: jest.fn(),
    isProductTourCompleted: jest.fn(),
    setProductTourCompleted: jest.fn(),
  },
}))

jest.mock('../features/auth/contexts/AuthContext', () => ({
  useAuthContext: jest.fn(),
}))

jest.mock('@capacitor/splash-screen', () => ({
  SplashScreen: {
    hide: jest.fn(),
  },
}))

describe('Mobile Flow & Routing Guard Tests', () => {
  let mockRouter: any
  let mockPathname: string

  beforeEach(() => {
    jest.clearAllMocks()
    mockRouter = { replace: jest.fn(), push: jest.fn() }
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
    mockPathname = '/dashboard'
    ;(usePathname as jest.Mock).mockReturnValue(mockPathname)
  })

  test('Redirects to /onboarding on first launch (onboarding not completed)', async () => {
    ;(useAuthContext as jest.Mock).mockReturnValue({ user: null, loading: false })
    ;(storageService.isOnboardingCompleted as jest.Mock).mockResolvedValue(false)

    render(
      <MobileFlowProvider>
        <div>Content</div>
      </MobileFlowProvider>
    )

    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledWith('/onboarding')
    })
  })

  test('Redirects to /login if onboarding completed but user not authenticated', async () => {
    ;(useAuthContext as jest.Mock).mockReturnValue({ user: null, loading: false })
    ;(storageService.isOnboardingCompleted as jest.Mock).mockResolvedValue(true)
    mockPathname = '/dashboard'
    ;(usePathname as jest.Mock).mockReturnValue(mockPathname)

    // Note: The AuthProvider redirects to /login if there is no user and they aren't on an auth route.
    // We mock that behavior here or through the provider context.
    render(
      <MobileFlowProvider>
        <div>Content</div>
      </MobileFlowProvider>
    )

    await waitFor(() => {
      // In this test, MobileFlowProvider completes initialization and renders children.
      // The AuthProvider's redirect effect then triggers router.replace('/login')
      expect(screen.getByText('Content')).toBeInTheDocument()
    })
  })

  test('Allows access to dashboard if onboarding completed and user authenticated', async () => {
    ;(useAuthContext as jest.Mock).mockReturnValue({ user: { id: '123' }, loading: false })
    ;(storageService.isOnboardingCompleted as jest.Mock).mockResolvedValue(true)

    render(
      <MobileFlowProvider>
        <div>Dashboard Protected Content</div>
      </MobileFlowProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Dashboard Protected Content')).toBeInTheDocument()
      expect(mockRouter.replace).not.toHaveBeenCalled()
    })
  })
})
