-- =======================================================================================
-- DONNÉES DE DÉMONSTRATION "MesFinances" (Supabase)
-- =======================================================================================
-- Ce script insère des données factices pour le TOUT PREMIER utilisateur inscrit.
-- Assurez-vous d'avoir créé au moins un utilisateur via Supabase Auth avant d'exécuter ce script.

DO $$
DECLARE
  v_user_id UUID;
  v_cat_salary UUID := gen_random_uuid();
  v_cat_food UUID := gen_random_uuid();
  v_cat_housing UUID := gen_random_uuid();
BEGIN
  -- 1. Récupération de l'utilisateur de test
  -- On prend le tout premier utilisateur de la table auth.users
  SELECT id INTO v_user_id FROM auth.users ORDER BY created_at ASC LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Aucun utilisateur trouvé. Veuillez créer un compte dans Authentication > Users avant de lancer ce script.';
  END IF;

  -- 2. Création de catégories
  INSERT INTO public.categories (id, user_id, name, icon, color, type)
  VALUES 
    (v_cat_salary, v_user_id, 'Salaire', 'briefcase', '#10b981', 'income'),
    (v_cat_food, v_user_id, 'Alimentation', 'shopping-cart', '#f59e0b', 'expense'),
    (v_cat_housing, v_user_id, 'Logement', 'home', '#3b82f6', 'expense');

  -- 3. Création de transactions (Revenus et Dépenses)
  INSERT INTO public.transactions (user_id, category_id, amount, type, description, transaction_date)
  VALUES
    (v_user_id, v_cat_salary, 3500.00, 'income', 'Salaire de Janvier', CURRENT_DATE - INTERVAL '5 days'),
    (v_user_id, v_cat_housing, 1200.00, 'expense', 'Loyer', CURRENT_DATE - INTERVAL '4 days'),
    (v_user_id, v_cat_food, 150.50, 'expense', 'Courses supermarché', CURRENT_DATE - INTERVAL '2 days'),
    (v_user_id, v_cat_food, 35.00, 'expense', 'Restaurant', CURRENT_DATE - INTERVAL '1 day');

  -- 4. Création d'un budget mensuel
  -- On crée un budget pour le mois en cours
  INSERT INTO public.budgets (user_id, category_id, month, year, amount)
  VALUES
    (v_user_id, v_cat_food, EXTRACT(MONTH FROM CURRENT_DATE), EXTRACT(YEAR FROM CURRENT_DATE), 500.00);

  -- 5. Création d'un objectif d'épargne
  INSERT INTO public.saving_goals (user_id, name, target_amount, current_amount, deadline)
  VALUES
    (v_user_id, 'Voyage au Japon', 5000.00, 1500.00, CURRENT_DATE + INTERVAL '1 year');

  RAISE NOTICE 'Données de démonstration insérées avec succès pour l''utilisateur %', v_user_id;
END $$;
