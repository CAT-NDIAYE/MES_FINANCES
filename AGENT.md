AGENTS.md
🤖 Guide de développement pour les agents IA
Ce document définit les règles que tous les agents IA doivent respecter lors du développement de l'application MesFinances.
L'objectif est de produire un code professionnel, évolutif, maintenable et cohérent.
---

Présentation du projet
Nom :
MesFinances
Type :
Application web de gestion financière personnelle (PWA)
Architecture :
Feature-Based
Technologies :
Next.js
React
TypeScript
Supabase
Tailwind CSS
shadcn/ui
---

Objectif principal
Construire une application moderne permettant à plusieurs utilisateurs de gérer leurs finances personnelles.
Chaque utilisateur possède uniquement ses propres données.
Toutes les données doivent être sécurisées.
---

Philosophie du projet
Toujours privilégier :
simplicité
lisibilité
performance
modularité
réutilisabilité
Éviter :
le code dupliqué
les composants géants
la logique métier dans les composants d'interface
les fonctions trop longues
les dépendances inutiles
---

Architecture
Organiser le projet par fonctionnalités.
Exemple :
src/
app/
components/
features/
auth/
dashboard/
transactions/
categories/
budgets/
saving-goals/
settings/
hooks/
services/
lib/
types/
utils/
Chaque fonctionnalité possède son propre dossier.
---

Convention de nommage
Composants :
PascalCase
Exemple :
TransactionCard.tsx
DashboardHeader.tsx
Hooks :
camelCase
Exemple :
useTransactions.ts
useBudget.ts
Pages :
page.tsx
Layouts :
layout.tsx
Services :
transaction.service.ts
budget.service.ts
Types :
transaction.types.ts
---

TypeScript
Toujours utiliser TypeScript strict.
Ne jamais utiliser :
any
Préférer :
interface
type
Les types doivent être centralisés.
---

React
Utiliser uniquement :
Functional Components
Hooks
Ne jamais utiliser :
Class Components
---

Gestion des états
Local :
useState
Complexe :
useReducer
Serveur :
TanStack Query
Ne pas créer de state inutile.
---

Formulaires
Utiliser :
React Hook Form
Validation :
Zod
Toutes les validations doivent être côté client.
Les validations critiques doivent également être côté serveur.
---

UI
Utiliser :
shadcn/ui
Tailwind CSS
Respecter :
espacement cohérent
responsive
accessibilité
mode sombre prêt
---

Responsive
Toujours développer :
Mobile First
Tester :
mobile
tablette
desktop
---

Couleurs
Couleur principale :
Vert émeraude
Couleur secondaire :
Bleu
Couleur succès :
Vert
Erreur :
Rouge
Attention :
Orange
Fond :
Blanc
Mode sombre prévu mais non obligatoire dans le MVP.
---

Icônes
Utiliser :
Lucide React
Ne jamais mélanger plusieurs bibliothèques d'icônes.
---

Gestion des erreurs
Toutes les erreurs doivent être :
capturées
affichées
compréhensibles
Ne jamais laisser une erreur silencieuse.
---

Notifications
Utiliser :
Toast
Succès :
vert
Erreur :
rouge
Information :
bleu
---

Sécurité
Ne jamais exposer :
clé Supabase
clé API
secret
Utiliser les variables d'environnement.
---

Base de données
Chaque table doit :
avoir une clé primaire
avoir created_at
avoir updated_at
avoir user_id lorsque nécessaire
Créer des index sur les colonnes fréquemment recherchées.
---

Sécurité Supabase
Toujours utiliser :
Row Level Security
Chaque utilisateur ne peut accéder qu'à ses propres données.
Aucune exception.
---

Performances
Toujours privilégier :
Pagination
Lazy Loading
Dynamic Import
Memoization lorsque nécessaire
Ne jamais charger toutes les données si ce n'est pas indispensable.
---

Qualité du code
Chaque fonction :
moins de 40 lignes lorsque possible.
Chaque composant :
une seule responsabilité.
Créer des composants réutilisables.
---

Commentaires
Ne commenter que :
la logique complexe
Ne jamais commenter un code évident.
---

Tests
Créer :
Tests unitaires
Tests composants
Tests E2E
Avant toute mise en production.
---

Git
Convention de commits
feat:
fix:
refactor:
docs:
style:
test:
chore:
Exemple :
feat: ajout du module budget
---

Développement
Avant d'écrire du code :
Analyser l'architecture.
Réutiliser les composants existants.
Ne jamais réinventer un composant déjà présent.
---

Bonnes pratiques
Toujours :
factoriser
simplifier
optimiser
typiser
documenter
---

Ce qu'il faut éviter
❌ any
❌ Code dupliqué
❌ CSS inline
❌ Variables inutiles
❌ Console.log oubliés
❌ Fonctions de plusieurs centaines de lignes
❌ Composants gigantesques
---

UX
Chaque écran doit :
être simple
être rapide
être intuitif
Afficher :
Loading
Erreur
État vide
Succès
---

Accessibilité
Tous les champs :
label
placeholder
message d'erreur
Tous les boutons :
aria-label si nécessaire.
---

MVP
Toujours terminer entièrement une fonctionnalité avant de commencer la suivante.
Ne jamais développer une fonctionnalité de V2 si la V1 n'est pas terminée.
---

Fonctionnalités prioritaires
Ordre obligatoire :
Authentification
Catégories
Transactions
Dashboard
Budgets
Objectifs d'épargne
Graphiques
Paramètres
Responsive
PWA
---

Définition d'une fonctionnalité terminée
Une fonctionnalité est considérée comme terminée uniquement si :
✓ le code compile
✓ les types sont corrects
✓ aucune erreur ESLint
✓ responsive
✓ testée
✓ intégrée à l'application
✓ documentée
---

Rôle de l'IA
L'agent IA agit comme un développeur senior.
Avant chaque modification il doit :
analyser le contexte
chercher les composants existants
réutiliser le code
proposer la meilleure architecture
générer un code propre
ne jamais casser une fonctionnalité existante
toujours expliquer les choix techniques lorsque cela est pertinent.
Fin du document.
