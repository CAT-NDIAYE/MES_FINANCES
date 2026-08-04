import type { NextConfig } from 'next'
import withPWAInit from '@ducanh2912/next-pwa'

const isCapacitor = process.env.CAPACITOR === 'true'

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development' || isCapacitor,
  register: true,
  workboxOptions: {
    skipWaiting: true,
    clientsClaim: true,
  },
  fallbacks: {
    document: '/offline.html',
  },
})

const nextConfig: NextConfig = {
  turbopack: {},
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}

export default withPWA(nextConfig)
