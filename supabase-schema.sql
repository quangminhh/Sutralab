-- Supabase Database Schema for Blog Posts
-- Run this SQL in your Supabase SQL Editor to create the posts table

CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  author TEXT DEFAULT 'AI Assistant',
  source TEXT NOT NULL CHECK (source IN ('gemini', 'apify', 'manual')),
  tags TEXT[] DEFAULT '{}',
  image_url TEXT NOT NULL,
  image_source TEXT NOT NULL CHECK (image_source IN ('apify', 'gemini', 'manual')),
  apify_source_url TEXT,
  apify_actor_id TEXT,
  gemini_model TEXT,
  gemini_prompt TEXT,
  deep_think_used BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_source ON posts(source);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to published posts
CREATE POLICY "Public can view published posts"
  ON posts FOR SELECT
  USING (published = true);

-- Create policy to allow service role to manage all posts
-- Note: This requires service role key, not anon key
CREATE POLICY "Service role can manage all posts"
  ON posts FOR ALL
  USING (auth.role() = 'service_role');

