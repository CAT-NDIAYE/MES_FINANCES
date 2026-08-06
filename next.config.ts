import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Désactivation explicite de Turbopack pour utiliser Webpack par défaut si nécessaire
  // ou on peut passer le flag --webpack
}

export default nextConfig
