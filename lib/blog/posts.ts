/**
 * Blog Posts Data Access Layer
 * Handles both file system (manual posts) and database (AI-generated posts)
 */

import fs from 'fs'
import path from 'path'
import { parseMarkdown, generateExcerpt } from './markdown'
import { db } from '../db/client'
import type { BlogPost, CreatePostInput } from '../db/schema'

const POSTS_DIRECTORY = path.join(process.cwd(), 'content', 'posts')

/**
 * Get all posts from both file system and database
 */
export async function getAllPosts(publishedOnly: boolean = true): Promise<BlogPost[]> {
  const posts: BlogPost[] = []

  // Get posts from database (AI-generated)
  try {
    if (db.isDatabaseConfigured()) {
      const dbPosts = await db.getPosts(publishedOnly)
      posts.push(...dbPosts)
    }
  } catch (error) {
    console.error('Error fetching posts from database:', error)
  }

  // Get posts from file system (manual)
  try {
    if (fs.existsSync(POSTS_DIRECTORY)) {
      const fileNames = fs.readdirSync(POSTS_DIRECTORY)
      const mdFiles = fileNames.filter(name => name.endsWith('.md'))

      for (const fileName of mdFiles) {
        try {
          const filePath = path.join(POSTS_DIRECTORY, fileName)
          const fileContents = fs.readFileSync(filePath, 'utf8')
          const { frontmatter, content } = parseMarkdown(fileContents)

          if (publishedOnly && !frontmatter.published) {
            continue
          }

          const post: BlogPost = {
            id: `file-${frontmatter.slug}`,
            slug: frontmatter.slug,
            title: frontmatter.title,
            content: content,
            excerpt: frontmatter.excerpt || generateExcerpt(content),
            author: frontmatter.author || 'Manual Author',
            source: frontmatter.source || 'manual',
            tags: frontmatter.tags || [],
            imageUrl: frontmatter.image || '/blog/images/placeholder.jpg',
            imageSource: 'manual',
            published: frontmatter.published !== false,
            publishedAt: frontmatter.published !== false ? new Date(frontmatter.date) : null,
            createdAt: new Date(frontmatter.date),
            updatedAt: new Date(frontmatter.date),
          }

          posts.push(post)
        } catch (error) {
          console.error(`Error reading post file ${fileName}:`, error)
        }
      }
    }
  } catch (error) {
    console.error('Error reading posts directory:', error)
  }

  // Sort by publishedAt (most recent first)
  return posts.sort((a, b) => {
    const dateA = a.publishedAt?.getTime() || 0
    const dateB = b.publishedAt?.getTime() || 0
    return dateB - dateA
  })
}

/**
 * Get post by slug
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  // Try database first
  try {
    if (db.isDatabaseConfigured()) {
      const post = await db.getPostBySlug(slug)
      if (post) {
        return post
      }
    }
  } catch (error) {
    console.error('Error fetching post from database:', error)
  }

  // Try file system
  try {
    if (fs.existsSync(POSTS_DIRECTORY)) {
      const fileNames = fs.readdirSync(POSTS_DIRECTORY)
      const mdFile = fileNames.find(name => {
        const filePath = path.join(POSTS_DIRECTORY, name)
        const fileContents = fs.readFileSync(filePath, 'utf8')
        const { frontmatter } = parseMarkdown(fileContents)
        return frontmatter.slug === slug
      })

      if (mdFile) {
        const filePath = path.join(POSTS_DIRECTORY, mdFile)
        const fileContents = fs.readFileSync(filePath, 'utf8')
        const { frontmatter, content } = parseMarkdown(fileContents)

        return {
          id: `file-${frontmatter.slug}`,
          slug: frontmatter.slug,
          title: frontmatter.title,
          content: content,
          excerpt: frontmatter.excerpt || generateExcerpt(content),
          author: frontmatter.author || 'Manual Author',
          source: frontmatter.source || 'manual',
          tags: frontmatter.tags || [],
          imageUrl: frontmatter.image || '/blog/images/placeholder.jpg',
          imageSource: 'manual',
          published: frontmatter.published !== false,
          publishedAt: frontmatter.published !== false ? new Date(frontmatter.date) : null,
          createdAt: new Date(frontmatter.date),
          updatedAt: new Date(frontmatter.date),
        }
      }
    }
  } catch (error) {
    console.error('Error reading post from file system:', error)
  }

  return null
}

/**
 * Create a new post (saves to database)
 */
export async function createPost(input: CreatePostInput): Promise<BlogPost> {
  if (!db.isDatabaseConfigured()) {
    throw new Error('Database not configured. Cannot create post.')
  }

  return await db.createPost(input)
}

