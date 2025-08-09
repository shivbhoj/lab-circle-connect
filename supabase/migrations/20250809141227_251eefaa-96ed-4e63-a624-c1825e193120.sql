-- Add foreign key constraints to link equipment and profiles to auth.users
-- This will establish the proper relationships for joining data

-- Add foreign key constraint for equipment.user_id -> auth.users.id
ALTER TABLE public.equipment 
ADD CONSTRAINT equipment_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add foreign key constraint for profiles.user_id -> auth.users.id  
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;