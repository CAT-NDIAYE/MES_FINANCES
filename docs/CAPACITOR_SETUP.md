# Configuration de Capacitor - MesFinances Mobile

Ce document décrit les étapes d'installation, de configuration et les commandes essentielles pour exécuter l'application sur Android et iOS.

## Dépendances Installées
Les paquets suivants ont été installés dans le projet :
- `@capacitor/core` : Le cœur de Capacitor.
- `@capacitor/cli` : L'interface en ligne de commande pour Capacitor.
- `@capacitor/android` : Plateforme Android.
- `@capacitor/ios` : Plateforme iOS.
- `@capacitor/preferences` : Plugin d'abstraction du stockage local natif.
- `@capacitor/splash-screen` : Gestion du Splash Screen natif.
- `@capacitor/app` : API pour les événements d'application (comme la fermeture).

## Commandes Importantes

### 1. Build de Next.js (Export Statique)
Next.js doit être compilé en HTML/CSS/JS statique pour pouvoir être chargé par les conteneurs natifs.
```bash
npm run build
```
*Note : Cette commande génère les fichiers compilés dans le dossier `/out`.*

### 2. Synchronisation des actifs Web vers les projets Natifs
Cette commande copie les fichiers compilés du dossier `/out` vers les sous-dossiers Android et iOS.
```bash
npx cap sync
```

### 3. Lancement de l'environnement de développement natif
Ouvre Android Studio ou Xcode avec le projet correspondant :
```bash
npx cap open android
npx cap open ios
```

## Structure de Configuration (`capacitor.config.ts`)
```typescript
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mesfinances.app',
  appName: 'MesFinances',
  webDir: 'out',
  plugins: {
    SplashScreen: {
      launchShowDuration: 1000,
      launchAutoHide: false,
      backgroundColor: '#0f172a',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
};

export default config;
```
