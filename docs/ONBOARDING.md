# Onboarding - MesFinances Mobile

Ce document décrit le flux d'onboarding sur la version mobile de MesFinances.

## Fonctionnement
- L'onboarding s'affiche uniquement au premier lancement de l'application.
- Cet état est stocké localement sur le périphérique via `@capacitor/preferences`.
- Une fois complété, l'utilisateur est automatiquement redirigé vers l'écran de connexion (`/login`) et ne verra plus jamais les écrans d'onboarding.

## Structure des Écrans (4 étapes)
1. **Écran 1 :** "Gérez votre argent en toute simplicité" - Suivez facilement vos revenus et dépenses au quotidien.
2. **Écran 2 :** "Contrôlez vos budgets" - Visualisez vos budgets et évitez les dépassements.
3. **Écran 3 :** "Atteignez vos objectifs d'épargne" - Suivez votre progression et réalisez vos projets.
4. **Écran 4 :** "Vos finances, partout avec vous" - Retrouvez toutes vos données en toute sécurité sur tous vos appareils.

## Intégration Code
Le fichier principal est [onboarding/page.tsx](file:///c:/Users/PC/Desktop/dev/projets/Mes_Finances/src/app/onboarding/page.tsx).

Le statut d'affichage est persistant grâce à `storageService.setOnboardingCompleted(true)`.
