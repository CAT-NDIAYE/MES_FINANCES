# Guide de compréhension du projet Mes Finances

Ce document sert de point d’entrée pour comprendre l’architecture du projet, les fichiers importants et le flux de travail général. Il est pensé pour une personne ayant des bases en React et qui veut rapidement comprendre comment tout s’articule.

> Ce fichier peut être enrichi à chaque nouveau prompt ou évolution du projet.

---

## 1. Objectif global du projet

Mes Finances est une application web de gestion personnelle des finances, construite avec :

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- TanStack Query
- Supabase
- shadcn-style UI primitives

L’objectif principal est de permettre :

- de gérer des transactions (ajout, modification, suppression, filtres)
- de visualiser un tableau de bord avec des indicateurs clés
- d’afficher des données financières de manière claire et rapide

---

## 2. Structure principale du projet

Voici l’arborescence essentielle à connaître :

- [src/app](src/app) : pages et routing de l’application
- [src/components](src/components) : composants généraux réutilisables
- [src/features](src/features) : logique métier par domaine
- [src/lib](src/lib) : utilitaires et clients externes
- [public](public) : fichiers statiques
- [supabase](supabase) : scripts SQL et configuration Supabase

### Les dossiers les plus importants

#### [src/app](src/app)

C’est ici que se trouvent les routes de l’application.

Exemples :

- [src/app/(dashboard)/dashboard/page.tsx](<src/app/(dashboard)/dashboard/page.tsx>) : page du tableau de bord
- [src/app/(dashboard)/transactions/page.tsx](<src/app/(dashboard)/transactions/page.tsx>) : page des transactions
- [src/app/(auth)/login/page.tsx](<src/app/(auth)/login/page.tsx>) : page de connexion

Le dossier [src/app](src/app) suit l’architecture App Router de Next.js.

#### [src/features](src/features)

C’est le cœur du projet. Chaque fonctionnalité possède sa propre structure :

- components : composants UI spécifiques à cette feature
- hooks : logique React et état lié aux données
- services : appels API / données / logique métier
- types : définitions TypeScript
- schemas : validation des formulaires

Exemples :

- [src/features/transactions](src/features/transactions)
- [src/features/dashboard](src/features/dashboard)
- [src/features/auth](src/features/auth)
- [src/features/categories](src/features/categories)

#### [src/components](src/components)

Contient les briques d’interface réutilisables à travers le projet :

- layout : PageContainer, PageHeader, DashboardLayout, etc.
- ui : boutons, inputs, dialogs, tables, etc.
- feedback : loaders, spinners, etc.

---

## 3. La logique de lecture du code

Pour comprendre une fonctionnalité, il faut généralement suivre ce chemin :

1. La page
   - ex. [src/app/(dashboard)/transactions/page.tsx](<src/app/(dashboard)/transactions/page.tsx>)
2. Le hook
   - ex. [src/features/transactions/hooks/useTransactions.ts](src/features/transactions/hooks/useTransactions.ts)
3. Le service
   - ex. [src/features/transactions/services/transaction.service.ts](src/features/transactions/services/transaction.service.ts)
4. Les composants UI
   - ex. [src/features/transactions/components](src/features/transactions/components)

En pratique :

- la page orchestre l’affichage
- le hook gère l’état et les appels de données
- le service centralise les requêtes
- les composants affichent l’interface

---

## 4. Les concepts clés à comprendre

### 4.1 Les pages

Une page est un composant React qui représente une route.

Exemple :

- [src/app/(dashboard)/dashboard/page.tsx](<src/app/(dashboard)/dashboard/page.tsx>)

Elle fait souvent appel à :

- un hook feature
- des composants spécifiques
- un layout global

### 4.2 Les hooks

Les hooks sont au centre de la logique côté client.

Ils servent à :

- récupérer les données
- gérer l’état local
- gérer les filtres et la pagination
- déclencher les mutations (ajout, modification, suppression)

Exemple :

- [src/features/transactions/hooks/useTransactions.ts](src/features/transactions/hooks/useTransactions.ts)
- [src/features/dashboard/hooks/useDashboard.ts](src/features/dashboard/hooks/useDashboard.ts)

### 4.3 Les services

Le service est la couche qui parle à Supabase ou à la logique métier.

Il encapsule les appels comme :

- récupérer les transactions
- créer une transaction
- modifier une transaction
- supprimer une transaction
- calculer les résumés

### 4.4 Les composants

Les composants sont séparés par responsabilité :

- un composant de formulaire
- un composant de tableau / liste
- un composant de dialogue
- un composant de résumé

### 4.5 Les schémas de validation

Les schémas servent à valider les formulaires avec Zod.

Ils garantissent que les données envoyées sont cohérentes.

---

## 5. Le module Transactions

C’est probablement la feature la plus importante à comprendre en premier.

### Fichiers principaux

- [src/app/(dashboard)/transactions/page.tsx](<src/app/(dashboard)/transactions/page.tsx>)
- [src/features/transactions/hooks/useTransactions.ts](src/features/transactions/hooks/useTransactions.ts)
- [src/features/transactions/services/transaction.service.ts](src/features/transactions/services/transaction.service.ts)
- [src/features/transactions/types/index.ts](src/features/transactions/types/index.ts)
- [src/features/transactions/schemas/transaction.schema.ts](src/features/transactions/schemas/transaction.schema.ts)
- [src/features/transactions/components](src/features/transactions/components)

### Ce que fait cette feature

Elle permet de :

- voir la liste des transactions
- rechercher une transaction
- filtrer par type, date, catégorie, montant
- trier les données
- paginer les résultats
- ajouter/modifier/supprimer une transaction

### Flux de fonctionnement

1. La page affiche les filtres et la liste.
2. Le hook récupère les données via le service.
3. Les changements de filtre / recherche mettent à jour l’état.
4. Les mutations mettent à jour les données et rafraîchissent la liste.

### À retenir

Si vous voulez modifier une transaction, commencez toujours par :

- la page [src/app/(dashboard)/transactions/page.tsx](<src/app/(dashboard)/transactions/page.tsx>)
- puis le hook [src/features/transactions/hooks/useTransactions.ts](src/features/transactions/hooks/useTransactions.ts)

---

## 6. Le module Dashboard

Le dashboard est la seconde feature centrale du projet.

### Fichiers principaux

- [src/app/(dashboard)/dashboard/page.tsx](<src/app/(dashboard)/dashboard/page.tsx>)
- [src/features/dashboard/hooks/useDashboard.ts](src/features/dashboard/hooks/useDashboard.ts)
- [src/features/dashboard/services/dashboard.service.ts](src/features/dashboard/services/dashboard.service.ts)
- [src/features/dashboard/components](src/features/dashboard/components)

### Ce que fait cette feature

Elle affiche :

- un résumé global des finances
- des cartes de statistiques
- des graphiques
- les transactions récentes
- des actions rapides

### À retenir

Le dashboard s’appuie sur une logique de “période” :

- aujourd’hui
- 7 jours
- 30 jours
- ce mois
- 3 mois
- 6 mois
- 12 mois

Le hook centralise ce paramètre et appelle le service correspondant.

---

## 7. L’authentification

Le système d’authentification est géré via les dossiers dédiés à l’auth.

### Fichiers concernés

- [src/features/auth](src/features/auth)
- [src/lib/supabase](src/lib/supabase)

### À retenir

Le contexte d’auth permet de :

- savoir si l’utilisateur est connecté
- récupérer son profil
- protéger certaines routes

---

## 8. Les données et Supabase

Le projet utilise Supabase comme source de données.

Les fichiers importants sont dans :

- [src/lib/supabase](src/lib/supabase)

### Ce qu’il faut comprendre

- le client Supabase est initialisé dans la lib
- les services appellent Supabase pour lire / écrire des données
- les requêtes sont souvent adaptées aux besoins de l’UI

---

## 9. Le rôle de TanStack Query

TanStack Query est utilisé pour gérer le cache et les requêtes asynchrones.

### Pourquoi c’est important ?

Il évite d’avoir à gérer à la main :

- le chargement
- l’erreur
- le rafraîchissement
- le cache
- les mutations optimistes

En clair : il rend l’application plus fluide et plus propre.

---

## 10. Les prompts passés et ce qu’ils ont permis de construire

Voici un résumé simple des étapes déjà réalisées :

### Prompt 1 — Module Transactions

Objectif : créer un module complet de gestion des transactions.

Résultat :

- page de transactions
- formulaire de création/modification
- suppression
- filtres et recherche
- tri
- pagination
- résumé des montants

### Prompt 2 — Tableau de bord

Objectif : créer un dashboard moderne et exploitable.

Résultat :

- page dashboard
- cartes de statistiques
- graphiques
- transactions récentes
- actions rapides
- sélection de période

### Prompt 3 — Nettoyage et amélioration du code

Objectif : rendre le projet plus propre, stable et plus proche d’une base production.

Résultat :

- amélioration de la structure feature-based
- correction de composants UI
- amélioration de la séparation entre logique et présentation

---

## 11. Comment approcher le code sans se perdre

Si vous voulez comprendre rapidement une partie du projet, suivez cette méthode :

1. Repérez la page concernée
2. Regardez le hook associé
3. Regardez le service associé
4. Regarde les composants UI utilisés
5. Vérifiez les types et schémas si nécessaire

### Mini règle mentale

- page = ce que l’utilisateur voit
- hook = comment la donnée est gérée
- service = où la donnée est récupérée / envoyée
- composant = comment elle est affichée

---

## 12. Points à garder en tête pour les prochaines évolutions

Quand vous ajoutez une nouvelle feature, pensez toujours à :

- créer ou utiliser une structure dans [src/features](src/features)
- garder la séparation entre page, hook, service, composants
- utiliser des types TypeScript pour éviter les erreurs
- valider les formulaires avec les schémas Zod si besoin
- utiliser TanStack Query pour les données asynchrones

---

## 13. Résumé ultra simple

Si vous ne retenez que trois choses :

- [src/app](src/app) = les pages
- [src/features](src/features) = la logique métier par domaine
- [src/components](src/components) = les composants réutilisables

C’est à partir de cette logique que tout le projet est construit.
