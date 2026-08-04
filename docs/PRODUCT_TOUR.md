# Product Tour - MesFinances Mobile

Ce document décrit le fonctionnement de la visite guidée (Product Tour) de l'application MesFinances.

## Architecture
Le composant principal est [ProductTour.tsx](file:///c:/Users/PC/Desktop/dev/projets/Mes_Finances/src/components/layout/ProductTour.tsx).
Il utilise une découpe CSS via `clipPath` pour assombrir l'écran tout en laissant un trou lumineux (highlight) sur l'élément ciblé par son ID HTML.

## Éléments Ciblés
1. **Tableau de bord** (`#dashboard-stats`) : Aperçu des statistiques financières.
2. **Transactions** (`#nav-transactions`) : Lien vers la liste des transactions.
3. **Budgets** (`#nav-budgets`) : Lien vers le suivi des budgets.
4. **Objectifs d'épargne** (`#nav-saving-goals`) : Lien vers la gestion de l'épargne.
5. **Actions rapides** (`#quick-actions`) : Zone de création rapide.
6. **Paramètres** (`#nav-settings`) : Accès aux configurations utilisateur et au bouton de relance.

## Relance du Tutoriel
Un utilisateur peut réinitialiser le tutoriel depuis l'écran des paramètres (`/settings`). 
L'action appelle `storageService.setProductTourCompleted(false)`. La visite se relancera au prochain chargement de l'accueil.
