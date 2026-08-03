-- Mises à jour de la table `categories` pour l'Étape 5
ALTER TABLE public.categories 
  ADD COLUMN IF NOT EXISTS is_default BOOLEAN DEFAULT FALSE NOT NULL,
  ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT FALSE NOT NULL,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Contrainte d'unicité : un nom de catégorie unique par utilisateur
ALTER TABLE public.categories 
  ADD CONSTRAINT unique_user_category_name UNIQUE (user_id, name);

-- Mise à jour de la fonction `handle_new_user` pour insérer automatiquement les catégories par défaut
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_user_id UUID;
BEGIN
  new_user_id := NEW.id;

  -- 1. Insérer le profil
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    new_user_id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );

  -- 2. Insérer les catégories de dépenses par défaut
  INSERT INTO public.categories (user_id, name, type, icon, color, is_default, sort_order)
  VALUES
    (new_user_id, 'Alimentation', 'expense', '🍔', '#10B981', true, 1),
    (new_user_id, 'Transport', 'expense', '🚗', '#3B82F6', true, 2),
    (new_user_id, 'Logement', 'expense', '🏠', '#F59E0B', true, 3),
    (new_user_id, 'Factures', 'expense', '⚡', '#EF4444', true, 4),
    (new_user_id, 'Santé', 'expense', '💊', '#EC4899', true, 5),
    (new_user_id, 'Éducation', 'expense', '🎓', '#8B5CF6', true, 6),
    (new_user_id, 'Loisirs', 'expense', '🎮', '#6366F1', true, 7),
    (new_user_id, 'Shopping', 'expense', '🛒', '#14B8A6', true, 8),
    (new_user_id, 'Cadeaux', 'expense', '🎁', '#F43F5E', true, 9),
    (new_user_id, 'Voyage', 'expense', '✈️', '#06B6D4', true, 10),
    (new_user_id, 'Téléphone', 'expense', '📱', '#6B7280', true, 11),
    (new_user_id, 'Internet', 'expense', '🌐', '#4B5563', true, 12),
    (new_user_id, 'Autres', 'expense', '📦', '#9CA3AF', true, 13);

  -- 3. Insérer les catégories de revenus par défaut
  INSERT INTO public.categories (user_id, name, type, icon, color, is_default, sort_order)
  VALUES
    (new_user_id, 'Salaire', 'income', '💼', '#10B981', true, 1),
    (new_user_id, 'Freelance', 'income', '💻', '#3B82F6', true, 2),
    (new_user_id, 'Business', 'income', '🏢', '#F59E0B', true, 3),
    (new_user_id, 'Cadeaux', 'income', '🎁', '#EC4899', true, 4),
    (new_user_id, 'Investissements', 'income', '📈', '#8B5CF6', true, 5),
    (new_user_id, 'Prime', 'income', '💰', '#6366F1', true, 6),
    (new_user_id, 'Autres', 'income', '📦', '#9CA3AF', true, 7);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
