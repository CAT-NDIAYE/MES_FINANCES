# Conception de la Base de Données - MesFinances

Ce document contient l'analyse de l'architecture de la base de données, l'explication des optimisations, et le guide complet pour configurer Supabase.

---

## 1. Analyse du modèle de données

L'architecture est construite de manière relationnelle autour de l'entité centrale de l'utilisateur.

- **profiles** : Étend la table système `auth.users` de Supabase. Elle stocke les données métiers de l'utilisateur (nom complet, devise de référence). Cela permet de séparer la logique d'authentification (gérée par Supabase) des données de profil applicatives.
- **categories** : Définit la classification des flux (Revenus ou Dépenses). Chaque utilisateur crée ses propres catégories, garantissant une forte personnalisation.
- **transactions** : La table centrale. Elle est liée à un utilisateur et optionnellement à une catégorie. La suppression d'une catégorie ne supprime pas la transaction (`ON DELETE SET NULL`) pour ne pas fausser les historiques financiers.
- **budgets** : Permet de définir une enveloppe de dépense sur une catégorie donnée, pour un mois et une année spécifiques. L'unicité garantit qu'un utilisateur n'a pas deux budgets concurrents pour la même catégorie le même mois.
- **saving_goals** : Indépendante des transactions, elle permet à l'utilisateur de se fixer des objectifs financiers avec une échéance et un suivi de la progression.

**Pourquoi cette architecture ?**
Elle permet d'isoler parfaitement les données via RLS (chaque table possède `user_id`), d'assurer l'intégrité référentielle (Clés étrangères avec cascades appropriées), et facilite l'évolution (ex: ajout futur de comptes bancaires ou de tags).

---

## 2. Schéma relationnel

```text
auth.users (Système Supabase)
│ (1:1)
└── profiles (id = auth.users.id)
    │
    ├── categories (1:N)
    │   │
    │   ├── transactions (1:N)  <-- (Lié à profiles ET categories)
    │   └── budgets (1:N)       <-- (Lié à profiles ET categories)
    │
    ├── transactions (1:N)      <-- (Transactions sans catégorie)
    └── saving_goals (1:N)
```

---

## 8. Optimisation : Index créés

Pour garantir des requêtes ultra-rapides même avec des millions de transactions, les index suivants ont été implémentés dans `schema.sql` :

- **Index sur les clés étrangères (`user_id` et `category_id`)** : Presque toutes les requêtes frontend filtreront par `user_id` grâce au RLS, et les jointures se font sur `category_id`.
  - `idx_categories_user_id`
  - `idx_transactions_user_id`
  - `idx_transactions_category_id`
  - `idx_budgets_user_id`, `idx_budgets_category_id`
  - `idx_saving_goals_user_id`
- **Index sur les dates (`transaction_date`)** :
  - `idx_transactions_date` : Le tableau de bord et les vues mensuelles filtreront et trieront systématiquement les transactions par date. L'index (en ordre DESC) permet de charger instantanément les transactions récentes.

---

## 9. Guide Supabase Complet

Suivez ces étapes pour configurer l'environnement de production ou de développement :

### Étape 1 : Créer un compte Supabase

Rendez-vous sur [supabase.com](https://supabase.com) et inscrivez-vous via GitHub ou par email.

### Étape 2 : Créer un nouveau projet

Depuis le Dashboard, cliquez sur **"New Project"**, puis sélectionnez votre organisation. Entrez le nom "MesFinances".

### Étape 3 : Choisir la région

Sélectionnez la région la plus proche de vos utilisateurs (ex: **Frankfurt (eu-central-1)** ou **Paris (eu-west-9)** pour l'Europe).

### Étape 4 : Définir le mot de passe de la base

Saisissez un mot de passe très fort pour votre base de données et conservez-le précieusement. Cliquez sur **"Create new project"**.

### Étape 5 : Attendre la création du projet

Le provisionnement de la base de données et des API prend généralement entre 1 et 3 minutes.

### Étape 6 : Ouvrir SQL Editor

Dans le menu latéral gauche, cliquez sur l'icône **"SQL Editor"**, puis sur **"New query"**.

### Étape 7 : Importer le fichier SQL

- Ouvrez le fichier `supabase/schema.sql` généré dans votre projet local.
- Copiez-collez tout son contenu dans l'éditeur SQL de Supabase.
- Cliquez sur le bouton **"Run"** (ou `Cmd+Enter` / `Ctrl+Enter`).
- Vérifiez qu'il n'y a aucune erreur dans l'onglet "Results".

### Étape 8 : Vérifier que toutes les tables existent

Allez dans l'onglet **"Table Editor"**. Vous devriez voir les tables : `profiles`, `categories`, `transactions`, `budgets`, et `saving_goals`. Toutes doivent avoir un petit cadenas indiquant que le RLS est activé.

### Étape 9 : Configurer Authentication

- Allez dans **Authentication** > **Providers**. Vérifiez que **"Email"** est activé.
- Allez dans **Authentication** > **URL Configuration**.
  - **Site URL** : Entrez `http://localhost:3000` (pour le développement).
  - **Redirect URLs** : Ajoutez `http://localhost:3000/**`.

### Étape 10 : Configurer les variables d'environnement

Dans Supabase, allez dans **Project Settings** (l'engrenage) > **API**.
Dans votre projet local, créez (ou modifiez) le fichier `.env.local` et ajoutez ces valeurs :

```env
# Récupéré dans la section Project URL
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxx.supabase.co
# Récupéré dans la section Project API keys (anon / public)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1...
```

### Étape 11 : Tester la connexion et insérer les données de démo

1. Lancez votre application front-end et inscrivez un premier utilisateur (ou créez-en un manuellement dans **Authentication** > **Users** en cliquant sur "Add user").
2. Retournez dans le **SQL Editor**.
3. Copiez-collez le contenu du fichier `supabase/seed.sql`.
4. Cliquez sur **"Run"**. Cela générera automatiquement des catégories et des transactions pour ce premier utilisateur.

---

## 10. Vérifications Finales (Checklist)

- [ ] Projet créé
- [ ] SQL importé (`schema.sql`)
- [ ] Tables créées avec succès
- [ ] RLS activé (cadenas visible dans le Table Editor)
- [ ] Policies créées (visibles dans Authentication > Policies)
- [ ] Auth activée (Email/Password configurés)
- [ ] Variables d'environnement configurées dans `.env.local`
- [ ] Test réussi (Utilisateur inscrit et `seed.sql` exécuté sans erreur)
