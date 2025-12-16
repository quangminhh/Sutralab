/**
 * Supabase Database Client
 * Provides type-safe database access using Supabase
 */

import { createClient } from '@supabase/supabase-js'
import type { BlogPost, CreatePostInput } from './schema'

/**
 * Convert Vietnamese string to URL-safe slug
 */
function slugify(text: string): string {
  // Vietnamese character map
  const vietnameseMap: Record<string, string> = {
    'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
    'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
    'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
    'đ': 'd',
    'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
    'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
    'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
    'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
    'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
    'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
    'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
    'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
    'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
  }

  return text
    .toLowerCase()
    .split('')
    .map(char => vietnameseMap[char] || char)
    .join('')
    .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric except spaces and hyphens
    .replace(/\s+/g, '-')          // Replace spaces with hyphens
    .replace(/-+/g, '-')           // Replace multiple hyphens with single
    .replace(/^-|-$/g, '')         // Remove leading/trailing hyphens
}

// Supabase client singleton
let supabaseClient: ReturnType<typeof createClient> | null = null

/**
 * Get or create Supabase client
 */
export function getSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  // Support both naming conventions
  const supabaseAnonKey = 
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)')
  }

  supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  return supabaseClient
}

/**
 * Check if database is configured
 */
export function isDatabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
     process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
  )
}

/**
 * Database operations for blog posts
 */
export const db = {
  /**
   * Check if database is configured
   */
  isDatabaseConfigured(): boolean {
    return !!(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
       process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
    )
  },

  /**
   * Get all posts (published or all)
   */
  async getPosts(publishedOnly: boolean = true): Promise<BlogPost[]> {
    const supabase = getSupabaseClient()
    let query = supabase
      .from('posts')
      .select('*')
      .order('published_at', { ascending: false })

    if (publishedOnly) {
      query = query.eq('published', true)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching posts:', error)
      throw error
    }

    // Map snake_case to camelCase
    return (data || []).map((post: any) => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      author: post.author,
      source: post.source,
      tags: post.tags || [],
      imageUrl: post.image_url,
      imageSource: post.image_source,
      apifySourceUrl: post.apify_source_url,
      apifyActorId: post.apify_actor_id,
      geminiModel: post.gemini_model,
      geminiPrompt: post.gemini_prompt,
      deepThinkUsed: post.deep_think_used || false,
      published: post.published,
      publishedAt: post.published_at ? new Date(post.published_at) : null,
      createdAt: new Date(post.created_at),
      updatedAt: new Date(post.updated_at),
    })) as BlogPost[]
  },

  /**
   * Get post by slug
   */
  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return null
      }
      console.error('Error fetching post:', error)
      throw error
    }

    // Map snake_case to camelCase
    const post = data as any
    return {
      id: post.id,
      slug: post.slug,
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      author: post.author,
      source: post.source,
      tags: post.tags || [],
      imageUrl: post.image_url,
      imageSource: post.image_source,
      apifySourceUrl: post.apify_source_url,
      apifyActorId: post.apify_actor_id,
      geminiModel: post.gemini_model,
      geminiPrompt: post.gemini_prompt,
      deepThinkUsed: post.deep_think_used || false,
      published: post.published,
      publishedAt: post.published_at ? new Date(post.published_at) : null,
      createdAt: new Date(post.created_at),
      updatedAt: new Date(post.updated_at),
    } as BlogPost
  },

  /**
   * Create a new post
   */
  async createPost(input: CreatePostInput): Promise<BlogPost> {
    const supabase = getSupabaseClient()
    
    // Generate slug from title - handle Vietnamese characters
    const slug = slugify(input.title)

    const postData = {
      slug,
      title: input.title,
      content: input.content,
      excerpt: input.excerpt || '',
      author: input.author || 'AI Assistant',
      source: input.source || 'manual',
      tags: input.tags || [],
      image_url: input.imageUrl || '/blog/images/placeholder.jpg',
      image_source: input.imageSource || 'manual',
      apify_source_url: input.apifySourceUrl || null,
      apify_actor_id: input.apifyActorId || null,
      gemini_model: input.geminiModel || null,
      gemini_prompt: input.geminiPrompt || null,
      deep_think_used: input.deepThinkUsed || false,
      published: input.published ?? false,
      published_at: input.published ? new Date().toISOString() : null,
    }

    const { data, error } = await supabase
      .from('posts')
      .insert(postData)
      .select()
      .single()

    if (error) {
      console.error('Error creating post:', error)
      throw error
    }

    // Map snake_case to camelCase
    const post = data as any
    return {
      id: post.id,
      slug: post.slug,
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      author: post.author,
      source: post.source,
      tags: post.tags || [],
      imageUrl: post.image_url,
      imageSource: post.image_source,
      apifySourceUrl: post.apify_source_url,
      apifyActorId: post.apify_actor_id,
      geminiModel: post.gemini_model,
      geminiPrompt: post.gemini_prompt,
      deepThinkUsed: post.deep_think_used || false,
      published: post.published,
      publishedAt: post.published_at ? new Date(post.published_at) : null,
      createdAt: new Date(post.created_at),
      updatedAt: new Date(post.updated_at),
    } as BlogPost
  },

  /**
   * Update a post
   */
  async updatePost(slug: string, input: Partial<CreatePostInput>): Promise<BlogPost> {
    const supabase = getSupabaseClient()
    
    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    // Map camelCase to snake_case for Supabase
    if (input.title) updateData.title = input.title
    if (input.content) updateData.content = input.content
    if (input.excerpt !== undefined) updateData.excerpt = input.excerpt
    if (input.author) updateData.author = input.author
    if (input.source) updateData.source = input.source
    if (input.tags) updateData.tags = input.tags
    if (input.imageUrl) updateData.image_url = input.imageUrl
    if (input.imageSource) updateData.image_source = input.imageSource
    if (input.apifySourceUrl !== undefined) updateData.apify_source_url = input.apifySourceUrl
    if (input.apifyActorId !== undefined) updateData.apify_actor_id = input.apifyActorId
    if (input.geminiModel !== undefined) updateData.gemini_model = input.geminiModel
    if (input.geminiPrompt !== undefined) updateData.gemini_prompt = input.geminiPrompt
    if (input.deepThinkUsed !== undefined) updateData.deep_think_used = input.deepThinkUsed
    if (input.published !== undefined) {
      updateData.published = input.published
      if (input.published && !updateData.published_at) {
        updateData.published_at = new Date().toISOString()
      }
    }

    const { data, error } = await supabase
      .from('posts')
      .update(updateData)
      .eq('slug', slug)
      .select()
      .single()

    if (error) {
      console.error('Error updating post:', error)
      throw error
    }

    // Map snake_case to camelCase
    const post = data as any
    return {
      id: post.id,
      slug: post.slug,
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      author: post.author,
      source: post.source,
      tags: post.tags || [],
      imageUrl: post.image_url,
      imageSource: post.image_source,
      apifySourceUrl: post.apify_source_url,
      apifyActorId: post.apify_actor_id,
      geminiModel: post.gemini_model,
      geminiPrompt: post.gemini_prompt,
      deepThinkUsed: post.deep_think_used || false,
      published: post.published,
      publishedAt: post.published_at ? new Date(post.published_at) : null,
      createdAt: new Date(post.created_at),
      updatedAt: new Date(post.updated_at),
    } as BlogPost
  },

  /**
   * Delete a post
   */
  async deletePost(slug: string): Promise<void> {
    const supabase = getSupabaseClient()
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('slug', slug)

    if (error) {
      console.error('Error deleting post:', error)
      throw error
    }
  },
}
