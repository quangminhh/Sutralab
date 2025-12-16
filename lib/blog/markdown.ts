/**
 * Markdown Processing Utilities
 * Handles parsing frontmatter and converting markdown to HTML
 */

import matter from 'gray-matter'
import { remark } from 'remark'
import remarkHtml from 'remark-html'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import rehypeStringify from 'rehype-stringify'

/**
 * Frontmatter schema for blog posts
 */
export interface PostFrontmatter {
  title: string
  slug: string
  date: string
  author?: string
  excerpt?: string
  tags?: string[]
  image?: string
  source?: 'gemini' | 'apify' | 'manual'
  published?: boolean
}

/**
 * Parse markdown file with frontmatter
 */
export function parseMarkdown(content: string): {
  frontmatter: PostFrontmatter
  content: string
} {
  const { data, content: markdownContent } = matter(content)
  
  return {
    frontmatter: {
      title: data.title || '',
      slug: data.slug || '',
      date: data.date || new Date().toISOString(),
      author: data.author || 'Manual Author',
      excerpt: data.excerpt || '',
      tags: data.tags || [],
      image: data.image || '',
      source: data.source || 'manual',
      published: data.published !== false, // default to true
    },
    content: markdownContent,
  }
}

/**
 * Convert markdown to HTML
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  const processor = unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeHighlight)
    .use(rehypeStringify)
  
  const result = await processor.process(markdown)
  return result.toString()
}

/**
 * Generate excerpt from markdown content
 */
export function generateExcerpt(content: string, maxLength: number = 160): string {
  // Remove markdown syntax
  const plainText = content
    .replace(/[#*`_~\[\]()]/g, '')
    .replace(/\n/g, ' ')
    .trim()
  
  if (plainText.length <= maxLength) {
    return plainText
  }
  
  return plainText.substring(0, maxLength).trim() + '...'
}

