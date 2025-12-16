/**
 * Database Setup API Route
 * Creates the posts table if it doesn't exist
 */

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    // Need service role key for creating tables
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
                           process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl) {
      return NextResponse.json({
        success: false,
        error: 'NEXT_PUBLIC_SUPABASE_URL not set',
      }, { status: 500 })
    }

    // Try service role key first, then anon key
    const key = supabaseServiceKey || supabaseAnonKey
    if (!key) {
      return NextResponse.json({
        success: false,
        error: 'No Supabase key found',
      }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, key)

    // Create table using raw SQL
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS posts (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          slug TEXT UNIQUE NOT NULL,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          excerpt TEXT NOT NULL DEFAULT '',
          author TEXT DEFAULT 'AI Assistant',
          source TEXT NOT NULL DEFAULT 'manual',
          tags TEXT[] DEFAULT '{}',
          image_url TEXT NOT NULL DEFAULT '/blog/images/placeholder.jpg',
          image_source TEXT NOT NULL DEFAULT 'manual',
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
      `
    })

    if (error) {
      // If RPC doesn't work, return SQL for manual execution
      return NextResponse.json({
        success: false,
        message: 'Cannot create table automatically. Please run this SQL in Supabase SQL Editor:',
        sql: `
-- Run this SQL in Supabase SQL Editor (https://app.supabase.com/project/YOUR_PROJECT/sql/new)

CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL DEFAULT '',
  author TEXT DEFAULT 'AI Assistant',
  source TEXT NOT NULL DEFAULT 'manual',
  tags TEXT[] DEFAULT '{}',
  image_url TEXT NOT NULL DEFAULT '/blog/images/placeholder.jpg',
  image_source TEXT NOT NULL DEFAULT 'manual',
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

-- Allow public access (for testing)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON posts FOR ALL USING (true) WITH CHECK (true);
        `.trim(),
        error: error.message,
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Database setup completed',
    })
  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}

