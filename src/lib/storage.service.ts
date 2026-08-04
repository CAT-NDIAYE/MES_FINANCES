import { Preferences } from '@capacitor/preferences'

export const storageService = {
  async set(key: string, value: string): Promise<void> {
    await Preferences.set({ key, value })
  },

  async get(key: string): Promise<string | null> {
    const { value } = await Preferences.get({ key })
    return value
  },

  async remove(key: string): Promise<void> {
    await Preferences.remove({ key })
  },

  async clear(): Promise<void> {
    await Preferences.clear()
  },

  // Onboarding helpers
  async isOnboardingCompleted(): Promise<boolean> {
    const val = await this.get('onboarding_completed')
    return val === 'true'
  },

  async setOnboardingCompleted(completed: boolean): Promise<void> {
    await this.set('onboarding_completed', String(completed))
  },

  // Product Tour helpers
  async isProductTourCompleted(): Promise<boolean> {
    const val = await this.get('product_tour_completed')
    return val === 'true'
  },

  async setProductTourCompleted(completed: boolean): Promise<void> {
    await this.set('product_tour_completed', String(completed))
  },
}
