-- Additional SQL for Google OAuth Authentication
-- Add this to your Supabase SQL Editor
-- Create user_profiles table for storing OAuth user data
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  auth_provider TEXT DEFAULT 'google',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Create row level security policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON user_profiles FOR
SELECT USING (auth.uid() = id);
-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON user_profiles FOR
UPDATE USING (auth.uid() = id);
-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON user_profiles FOR
INSERT WITH CHECK (auth.uid() = id);
-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_provider ON user_profiles(auth_provider);
-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER AS $$ BEGIN
INSERT INTO public.user_profiles (id, email, full_name, avatar_url, auth_provider)
VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    COALESCE(NEW.raw_app_meta_data->>'provider', 'email')
  );
RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Trigger to run the function on user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER
INSERT ON auth.users FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
-- Update housing_listings and roommate_profiles to link with users
ALTER TABLE housing_listings
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE roommate_profiles
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
-- Create RLS policies for user-owned data
ALTER TABLE housing_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE roommate_profiles ENABLE ROW LEVEL SECURITY;
-- Housing listings policies
CREATE POLICY "Users can read all housing listings" ON housing_listings FOR
SELECT USING (true);
CREATE POLICY "Users can create own housing listings" ON housing_listings FOR
INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own housing listings" ON housing_listings FOR
UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own housing listings" ON housing_listings FOR DELETE USING (auth.uid() = user_id);
-- Roommate profiles policies  
CREATE POLICY "Users can read all roommate profiles" ON roommate_profiles FOR
SELECT USING (true);
CREATE POLICY "Users can create own roommate profiles" ON roommate_profiles FOR
INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own roommate profiles" ON roommate_profiles FOR
UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own roommate profiles" ON roommate_profiles FOR DELETE USING (auth.uid() = user_id);