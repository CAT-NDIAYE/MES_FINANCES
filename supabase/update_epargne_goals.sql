CREATE TABLE IF NOT EXISTS public.saving_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  description TEXT,
  target_amount NUMERIC(12, 2) NOT NULL CHECK (target_amount > 0),
  current_amount NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (current_amount >= 0),
  deadline DATE NOT NULL,
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id)
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'saving_goals'
      AND column_name = 'icon'
  ) THEN
    ALTER TABLE public.saving_goals ADD COLUMN icon TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'saving_goals'
      AND column_name = 'color'
  ) THEN
    ALTER TABLE public.saving_goals ADD COLUMN color TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'saving_goals'
      AND column_name = 'description'
  ) THEN
    ALTER TABLE public.saving_goals ADD COLUMN description TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'saving_goals'
      AND column_name = 'deadline'
  ) THEN
    ALTER TABLE public.saving_goals ADD COLUMN deadline DATE;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'saving_goals'
      AND column_name = 'is_completed'
  ) THEN
    ALTER TABLE public.saving_goals ADD COLUMN is_completed BOOLEAN NOT NULL DEFAULT FALSE;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'saving_goals'
      AND column_name = 'is_archived'
  ) THEN
    ALTER TABLE public.saving_goals ADD COLUMN is_archived BOOLEAN NOT NULL DEFAULT FALSE;
  END IF;
END $$;

ALTER TABLE public.saving_goals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Les utilisateurs voient leurs objectifs" ON public.saving_goals;
CREATE POLICY "Les utilisateurs voient leurs objectifs" ON public.saving_goals FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Les utilisateurs insèrent leurs objectifs" ON public.saving_goals;
CREATE POLICY "Les utilisateurs insèrent leurs objectifs" ON public.saving_goals FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Les utilisateurs modifient leurs objectifs" ON public.saving_goals;
CREATE POLICY "Les utilisateurs modifient leurs objectifs" ON public.saving_goals FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Les utilisateurs suppriment leurs objectifs" ON public.saving_goals;
CREATE POLICY "Les utilisateurs suppriment leurs objectifs" ON public.saving_goals FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_saving_goals_user_id ON public.saving_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_saving_goals_deadline ON public.saving_goals(deadline);
