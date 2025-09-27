-- Supabase SQL Setup for Roommate Matching System
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/YOUR_PROJECT/sql
-- Enable the pgvector extension for vector operations
CREATE EXTENSION IF NOT EXISTS vector;
-- Drop existing tables if they exist (optional - remove if you want to keep existing data)
-- DROP TABLE IF EXISTS roommate_profiles;
-- DROP TABLE IF EXISTS housing_listings;
-- Create roommate_profiles table
CREATE TABLE IF NOT EXISTS roommate_profiles (
  id TEXT PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('seeker', 'provider')),
  city TEXT,
  area TEXT,
  budget_pkr INTEGER,
  sleep_schedule TEXT,
  cleanliness TEXT,
  noise_tolerance TEXT,
  study_habits TEXT,
  food_pref TEXT,
  raw_text TEXT,
  -- Original profile text
  embedding vector(384),
  -- all-MiniLM-L6-v2 produces 384-dimensional vectors
  metadata JSONB,
  -- Store original JSON data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Create housing_listings table
CREATE TABLE IF NOT EXISTS housing_listings (
  id TEXT PRIMARY KEY,
  city TEXT,
  area TEXT,
  monthly_rent_pkr INTEGER,
  rooms_available INTEGER,
  availability TEXT CHECK (availability IN ('Available', 'Not Available')),
  amenities JSONB,
  -- Store amenities as JSON array
  embedding vector(384),
  metadata JSONB,
  -- Store original JSON data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Create indexes for vector similarity search (IMPORTANT for performance)
CREATE INDEX IF NOT EXISTS roommate_profiles_embedding_idx ON roommate_profiles USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX IF NOT EXISTS housing_listings_embedding_idx ON housing_listings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
-- Create indexes on frequently queried columns for fast filtering
CREATE INDEX IF NOT EXISTS idx_roommate_role ON roommate_profiles(role);
CREATE INDEX IF NOT EXISTS idx_roommate_city ON roommate_profiles(city);
CREATE INDEX IF NOT EXISTS idx_roommate_budget ON roommate_profiles(budget_pkr);
CREATE INDEX IF NOT EXISTS idx_housing_city ON housing_listings(city);
CREATE INDEX IF NOT EXISTS idx_housing_availability ON housing_listings(availability);
CREATE INDEX IF NOT EXISTS idx_housing_rent ON housing_listings(monthly_rent_pkr);
-- Enable Row Level Security (RLS) for security
ALTER TABLE roommate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE housing_listings ENABLE ROW LEVEL SECURITY;
-- Create policies to allow public read access (adjust as needed)
CREATE POLICY "Allow public read access on roommate_profiles" ON roommate_profiles FOR
SELECT USING (true);
CREATE POLICY "Allow public read access on housing_listings" ON housing_listings FOR
SELECT USING (true);
-- Create policies for insert/update (adjust permissions as needed)
CREATE POLICY "Allow public insert on roommate_profiles" ON roommate_profiles FOR
INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on housing_listings" ON housing_listings FOR
INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on roommate_profiles" ON roommate_profiles FOR
UPDATE USING (true);
CREATE POLICY "Allow public update on housing_listings" ON housing_listings FOR
UPDATE USING (true);
-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW();
RETURN NEW;
END;
$$ language 'plpgsql';
-- Triggers to automatically update timestamps
CREATE TRIGGER update_roommate_profiles_updated_at BEFORE
UPDATE ON roommate_profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_housing_listings_updated_at BEFORE
UPDATE ON housing_listings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
-- Verify tables were created successfully
SELECT 'roommate_profiles' as table_name,
  COUNT(*) as row_count
FROM roommate_profiles
UNION ALL
SELECT 'housing_listings' as table_name,
  COUNT(*) as row_count
FROM housing_listings;
-- Check vector extension is working
SELECT *
FROM pg_extension
WHERE extname = 'vector';