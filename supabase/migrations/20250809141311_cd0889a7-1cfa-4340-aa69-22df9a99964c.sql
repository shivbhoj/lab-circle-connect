-- Idempotent migration to ensure foreign key constraints exist
DO $$
BEGIN
  -- equipment.user_id -> auth.users(id)
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint c
    JOIN pg_class t ON t.oid = c.conrelid
    WHERE c.conname = 'equipment_user_id_fkey'
      AND t.relname = 'equipment'
  ) THEN
    ALTER TABLE public.equipment 
    ADD CONSTRAINT equipment_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;

  -- profiles.user_id -> auth.users(id)
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint c
    JOIN pg_class t ON t.oid = c.conrelid
    WHERE c.conname = 'profiles_user_id_fkey'
      AND t.relname = 'profiles'
  ) THEN
    ALTER TABLE public.profiles 
    ADD CONSTRAINT profiles_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;