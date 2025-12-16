/**
 * Database Schema for Blog Posts
 * Using Prisma ORM for type-safe database access
 */

export const PostSchema = {
  id: 'string', // UUID
  slug: 'string', // unique
  title: 'string',
  content: 'string', // markdown
  excerpt: 'string',
  author: 'string',
  source: 'gemini' | 'apify' | 'manual',
  tags: 'string[]',
  imageUrl: 'string',
  imageSource: 'unsplash' | 'apify' | 'gemini' | 'manual',
  apifySourceUrl: 'string | null',
  apifyActorId: 'string | null',
  geminiModel: 'string | null', // e.g., "gemini-3.0-pro", "gemini-3.0-deep-think"
  geminiPrompt: 'string | null',
  deepThinkUsed: 'boolean',
  published: 'boolean',
  publishedAt: 'Date | null',
  createdAt: 'Date',
  updatedAt: 'Date',
} as const

/**
 * TypeScript type for Blog Post
 */
export type BlogPost = {
  id: string
  slug: string
  title: string
  content: string
  excerpt: string
  author: string
  source: 'gemini' | 'apify' | 'manual'
  tags: string[]
  imageUrl: string
  imageSource: 'unsplash' | 'apify' | 'gemini' | 'manual'
  apifySourceUrl?: string | null
  apifyActorId?: string | null
  geminiModel?: string | null
  geminiPrompt?: string | null
  deepThinkUsed?: boolean
  published: boolean
  publishedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

/**
 * Post creation input (for API)
 */
export type CreatePostInput = {
  title: string
  content: string
  excerpt?: string
  author?: string
  source?: 'gemini' | 'apify' | 'manual'
  tags?: string[]
  imageUrl?: string
  imageSource?: 'unsplash' | 'apify' | 'gemini' | 'manual'
  apifySourceUrl?: string
  apifyActorId?: string
  geminiModel?: string
  geminiPrompt?: string
  deepThinkUsed?: boolean
  published?: boolean
}

