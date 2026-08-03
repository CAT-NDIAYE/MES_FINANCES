-- =======================================================================================
-- SCHEMA INITIAL DE LA BASE DE DONNÉES "MesFinances" (Supabase / PostgreSQL)
-- =======================================================================================
-- Ce script crée l'architecture complète, les triggers, et la sécurité RLS.
-- Compatible avec PostgreSQL 15+ utilisé par Supabase.

-- ---------------------------------------------------------------------------------------
-- 0. EXTENSIONS ET FONCTIONS UTILITAIRES
-- ---------------------------------------------------------------------------------------

-- Fonction générique pour mettre à jour automatiquement la colonne `updated_at`
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------------------------
-- 1. CREATION DES TABLES
-- ---------------------------------------------------------------------------------------

-- Table: profiles
-- Description: Étend auth.users pour les informations spécifiques à l'application.
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  currency TEXT DEFAULT 'EUR'::TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Table: categories
-- Description: Catégories personnalisées de l'utilisateur pour les revenus/dépenses.
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Table: transactions
-- Description: Enregistre tous les flux financiers de l'utilisateur.
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  amount NUMERIC(12, 2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  description TEXT,
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Table: budgets
-- Description: Fixe une limite de dépenses mensuelles par catégorie.
CREATE TABLE IF NOT EXISTS public.budgets (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
  alert_percentage INTEGER NOT NULL DEFAULT 80 CHECK (alert_percentage >= 0 AND alert_percentage <= 100),
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id),
  -- Contrainte d'unicité : Un seul budget par catégorie, par mois et par an pour un utilisateur.
  CONSTRAINT unique_budget_per_category_month_year UNIQUE (user_id, category_id, month, year)
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'budgets'
      AND column_name = 'alert_percentage'
  ) THEN
    ALTER TABLE public.budgets ADD COLUMN alert_percentage INTEGER NOT NULL DEFAULT 80;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'budgets'
      AND column_name = 'is_archived'
  ) THEN
    ALTER TABLE public.budgets ADD COLUMN is_archived BOOLEAN NOT NULL DEFAULT FALSE;
  END IF;
END $$;

-- Table: saving_goals
-- Description: Suivi des objectifs d'épargne.
CREATE TABLE IF NOT EXISTS public.saving_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  target_amount NUMERIC(12, 2) NOT NULL CHECK (target_amount > 0),
  current_amount NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (current_amount >= 0),
  deadline DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- ---------------------------------------------------------------------------------------
-- 2. TRIGGERS (DÉCLENCHEURS)
-- ---------------------------------------------------------------------------------------

-- Application du trigger `updated_at` sur chaque table métier
DROP TRIGGER IF EXISTS handle_profiles_updated_at ON public.profiles;
CREATE TRIGGER handle_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS handle_categories_updated_at ON public.categories;
CREATE TRIGGER handle_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS handle_transactions_updated_at ON public.transactions;
CREATE TRIGGER handle_transactions_updated_at BEFORE UPDATE ON public.transactions FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS handle_budgets_updated_at ON public.budgets;
CREATE TRIGGER handle_budgets_updated_at BEFORE UPDATE ON public.budgets FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS handle_saving_goals_updated_at ON public.saving_goals;
CREATE TRIGGER handle_saving_goals_updated_at BEFORE UPDATE ON public.saving_goals FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Fonction pour créer un profil automatiquement lors d'une nouvelle inscription via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Déclencheur sur `auth.users`
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ---------------------------------------------------------------------------------------
-- 3. INDEX POUR L'OPTIMISATION
-- ---------------------------------------------------------------------------------------
-- Objectif : Accélérer les jointures sur les clés étrangères et le filtrage (dates).

CREATE INDEX IF NOT EXISTS idx_categories_user_id ON public.categories(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_category_id ON public.transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON public.budgets(user_id);
CREATE INDEX IF NOT EXISTS idx_budgets_category_id ON public.budgets(category_id);
CREATE INDEX IF NOT EXISTS idx_saving_goals_user_id ON public.saving_goals(user_id);

-- ---------------------------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS)
-- ---------------------------------------------------------------------------------------
-- Objectif : Chaque utilisateur ne peut voir, insérer, modifier ou supprimer QUE ses données.

-- Activation du RLS sur chaque table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saving_goals ENABLE ROW LEVEL SECURITY;

-- Politiques pour `profiles`
DROP POLICY IF EXISTS "Les utilisateurs voient leur propre profil" ON public.profiles;
CREATE POLICY "Les utilisateurs voient leur propre profil" ON public.profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Les utilisateurs modifient leur propre profil" ON public.profiles;
CREATE POLICY "Les utilisateurs modifient leur propre profil" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Politiques pour `categories`
DROP POLICY IF EXISTS "Les utilisateurs voient leurs catégories" ON public.categories;
CREATE POLICY "Les utilisateurs voient leurs catégories" ON public.categories FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Les utilisateurs insèrent leurs catégories" ON public.categories;
CREATE POLICY "Les utilisateurs insèrent leurs catégories" ON public.categories FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Les utilisateurs modifient leurs catégories" ON public.categories;
CREATE POLICY "Les utilisateurs modifient leurs catégories" ON public.categories FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Les utilisateurs suppriment leurs catégories" ON public.categories;
CREATE POLICY "Les utilisateurs suppriment leurs catégories" ON public.categories FOR DELETE USING (auth.uid() = user_id);

-- Politiques pour `transactions`
DROP POLICY IF EXISTS "Les utilisateurs voient leurs transactions" ON public.transactions;
CREATE POLICY "Les utilisateurs voient leurs transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Les utilisateurs insèrent leurs transactions" ON public.transactions;
CREATE POLICY "Les utilisateurs insèrent leurs transactions" ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Les utilisateurs modifient leurs transactions" ON public.transactions;
CREATE POLICY "Les utilisateurs modifient leurs transactions" ON public.transactions FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Les utilisateurs suppriment leurs transactions" ON public.transactions;
CREATE POLICY "Les utilisateurs suppriment leurs transactions" ON public.transactions FOR DELETE USING (auth.uid() = user_id);

-- Politiques pour `budgets`
DROP POLICY IF EXISTS "Les utilisateurs voient leurs budgets" ON public.budgets;
CREATE POLICY "Les utilisateurs voient leurs budgets" ON public.budgets FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Les utilisateurs insèrent leurs budgets" ON public.budgets;
CREATE POLICY "Les utilisateurs insèrent leurs budgets" ON public.budgets FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Les utilisateurs modifient leurs budgets" ON public.budgets;
CREATE POLICY "Les utilisateurs modifient leurs budgets" ON public.budgets FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Les utilisateurs suppriment leurs budgets" ON public.budgets;
CREATE POLICY "Les utilisateurs suppriment leurs budgets" ON public.budgets FOR DELETE USING (auth.uid() = user_id);

-- Politiques pour `saving_goals`
DROP POLICY IF EXISTS "Les utilisateurs voient leurs objectifs" ON public.saving_goals;
CREATE POLICY "Les utilisateurs voient leurs objectifs" ON public.saving_goals FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Les utilisateurs insèrent leurs objectifs" ON public.saving_goals;
CREATE POLICY "Les utilisateurs insèrent leurs objectifs" ON public.saving_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Les utilisateurs modifient leurs objectifs" ON public.saving_goals;
CREATE POLICY "Les utilisateurs modifient leurs objectifs" ON public.saving_goals FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Les utilisateurs suppriment leurs objectifs" ON public.saving_goals;
CREATE POLICY "Les utilisateurs suppriment leurs objectifs" ON public.saving_goals FOR DELETE USING (auth.uid() = user_id);
