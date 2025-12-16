/**
 * Unsplash Image Service
 * Fetches unique, high-quality images from Unsplash API based on topic keywords
 * 
 * @module lib/services/images
 */

// Unsplash API response types
interface UnsplashPhoto {
  id: string
  urls: {
    raw: string
    full: string
    regular: string  // 1080px width - recommended for blog covers
    small: string    // 400px width
    thumb: string    // 200px width
  }
  alt_description: string | null
  description: string | null
  user: {
    name: string
    username: string
    links: {
      html: string
    }
  }
  links: {
    download_location: string
  }
}

interface UnsplashSearchResponse {
  total: number
  total_pages: number
  results: UnsplashPhoto[]
}

// Default placeholder when Unsplash fails or no API key
const DEFAULT_PLACEHOLDER = '/blog/images/placeholder.jpg'

/**
 * Check if Unsplash API is configured
 */
export function isUnsplashConfigured(): boolean {
  return !!process.env.UNSPLASH_ACCESS_KEY
}

/**
 * Tech/AI related keywords to detect technology topics
 */
const TECH_KEYWORDS = [
  'ai', 'artificial', 'intelligence', 'robot', 'robotics', 'automation',
  'machine', 'learning', 'neural', 'deep', 'computer', 'vision',
  'software', 'code', 'programming', 'algorithm', 'data', 'tech',
  'technology', 'digital', 'cloud', 'api', 'llm', 'gpt', 'chatgpt',
  'nlp', 'ml', 'testing', 'devops', 'blockchain', 'crypto', 'iot',
  'cybersecurity', 'security', 'network', 'server', 'database',
]

/**
 * Extract keywords from a topic for image search
 * Forces tech/AI context for technology-related topics to avoid irrelevant images
 * 
 * @param topic - The blog topic string
 * @returns Clean keywords optimized for Unsplash search
 */
function extractKeywords(topic: string): string {
  const topicLower = topic.toLowerCase()
  
  // Check if topic is tech/AI related
  const isTechTopic = TECH_KEYWORDS.some(k => topicLower.includes(k))
  
  // Common filler words to remove
  const fillerWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
    'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'need',
    'về', 'và', 'hoặc', 'nhưng', 'trong', 'trên', 'tại', 'để', 'cho',
    'của', 'với', 'bởi', 'từ', 'là', 'được', 'có', 'sẽ', 'đã', 'đang',
    'how', 'what', 'when', 'where', 'why', 'which', 'who', 'whom',
    'this', 'that', 'these', 'those', 'it', 'its', 'their', 'your', 'our',
    'trends', '2024', '2025', 'best', 'top', 'new', 'latest', 'guide',
  ])

  // Split and filter
  const words = topicLower
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !fillerWords.has(word))

  // Take first 2-3 meaningful keywords
  let keywords = words.slice(0, 3).join(' ')
  
  // If too short, use original topic cleaned up
  if (!keywords) {
    keywords = topic.replace(/[^\w\s]/g, ' ').trim()
  }
  
  // CRITICAL: Force tech context for tech topics to avoid irrelevant images
  // Unsplash needs explicit "technology" or "AI" terms to return tech images
  if (isTechTopic) {
    // Add tech context but keep it concise for better search results
    keywords = `${keywords} technology computer`
    console.log(`[Images] Tech topic detected, search: "${keywords}"`)
  }
  
  return keywords
}

/**
 * Fetch multiple unique images from Unsplash for cover and inline use
 * Returns 2 different images to avoid cover/inline being the same
 * 
 * @param topic - The blog post topic
 * @param count - Number of images to fetch (default 2: cover + inline)
 * @returns Array of image objects with URLs
 */
export async function fetchBlogImages(
  topic: string,
  count: number = 2
): Promise<Array<{
  url: string
  attribution?: {
    photographer: string
    photographerUrl: string
    unsplashUrl: string
  }
}>> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY

  // If no API key, return placeholders
  if (!accessKey) {
    console.log('[Images] Unsplash API key not configured, using placeholders')
    return Array(count).fill({ url: DEFAULT_PLACEHOLDER })
  }

  try {
    const keywords = extractKeywords(topic)
    console.log(`[Images] Searching Unsplash for ${count} images: "${keywords}"`)

    // Fetch more images than needed to ensure variety
    const params = new URLSearchParams({
      query: keywords,
      orientation: 'landscape',
      per_page: Math.min(count + 3, 10).toString(), // Get extra for variety
      content_filter: 'high',
    })

    const response = await fetch(
      `https://api.unsplash.com/search/photos?${params}`,
      {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
          'Accept-Version': 'v1',
        },
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[Images] Unsplash API error: ${response.status} - ${errorText}`)
      return Array(count).fill({ url: DEFAULT_PLACEHOLDER })
    }

    const data: UnsplashSearchResponse = await response.json()

    // No results found - try fallback
    if (data.results.length === 0) {
      console.log(`[Images] No results for "${keywords}", trying fallback search`)
      const fallbackKeywords = topic.toLowerCase().includes('ai') ? 'artificial intelligence technology' : 'technology innovation'
      return fetchBlogImages(fallbackKeywords, count)
    }

    // Map results to image objects
    const images = data.results.slice(0, count).map(photo => {
      // Track download as per Unsplash guidelines
      fetch(photo.links.download_location, {
        headers: { Authorization: `Client-ID ${accessKey}` },
      }).catch(() => {}) // Non-critical

      return {
        url: photo.urls.regular,
        attribution: {
          photographer: photo.user.name,
          photographerUrl: photo.user.links.html,
          unsplashUrl: `https://unsplash.com/photos/${photo.id}`,
        },
      }
    })

    console.log(`[Images] Found ${images.length} unique images`)
    
    // If we didn't get enough, pad with placeholder
    while (images.length < count) {
      images.push({ url: DEFAULT_PLACEHOLDER })
    }

    return images
  } catch (error) {
    console.error('[Images] Error fetching from Unsplash:', error)
    return Array(count).fill({ url: DEFAULT_PLACEHOLDER })
  }
}

/**
 * Fetch a unique cover image from Unsplash based on topic
 * @deprecated Use fetchBlogImages() instead for both cover and inline
 */
export async function fetchCoverImage(
  topic: string,
  orientation: 'landscape' | 'portrait' | 'squarish' = 'landscape'
): Promise<{
  url: string
  attribution?: {
    photographer: string
    photographerUrl: string
    unsplashUrl: string
  }
}> {
  const images = await fetchBlogImages(topic, 1)
  return images[0] || { url: DEFAULT_PLACEHOLDER }
}

/**
 * Fetch multiple images for inline use in blog posts
 * 
 * @param topic - The blog post topic
 * @param count - Number of images to fetch (max 10)
 * @returns Array of image URLs
 */
export async function fetchInlineImages(
  topic: string,
  count: number = 2
): Promise<string[]> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY

  if (!accessKey) {
    return []
  }

  try {
    const keywords = extractKeywords(topic)
    const params = new URLSearchParams({
      query: keywords,
      orientation: 'landscape',
      per_page: Math.min(count, 10).toString(),
      content_filter: 'high',
    })

    const response = await fetch(
      `https://api.unsplash.com/search/photos?${params}`,
      {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
          'Accept-Version': 'v1',
        },
      }
    )

    if (!response.ok) {
      return []
    }

    const data: UnsplashSearchResponse = await response.json()
    
    return data.results.map(photo => photo.urls.regular)
  } catch (error) {
    console.error('[Images] Error fetching inline images:', error)
    return []
  }
}

/**
 * Generate attribution HTML for Unsplash (required by their guidelines)
 */
export function generateAttribution(
  photographer: string,
  photographerUrl: string
): string {
  return `Photo by <a href="${photographerUrl}?utm_source=sutralab&utm_medium=referral">${photographer}</a> on <a href="https://unsplash.com/?utm_source=sutralab&utm_medium=referral">Unsplash</a>`
}

