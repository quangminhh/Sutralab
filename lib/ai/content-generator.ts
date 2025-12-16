/**
 * Content Generation Service
 * Orchestrates content generation with:
 * - Unique cover images from Unsplash
 * - Long-form content (1600-2000 words) from Gemini
 * - 1 inline image + 1 video embed (rotating YouTube/TikTok)
 * 
 * NOTE: Twitter and Reddit scrapers removed (require paid subscriptions)
 * 
 * @module lib/ai/content-generator
 */

import { generateBlogPost } from './gemini'
import { 
  findPopularAIPosts, 
  scrapeYouTubeVideos,
  scrapeTikTokVideos,
  isApifyConfigured,
  type ScrapedMedia 
} from '../scrapers/apify'
import { createPost } from '../blog/posts'
import type { CreatePostInput } from '../db/schema'
import { fetchBlogImages, isUnsplashConfigured } from '../services/images'
import { generateEmbed, generateImageEmbed, generateMediaPlaceholder } from '../services/embeds'

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Default topics for AI blog when Apify discovery fails
 */
const DEFAULT_TOPICS = [
  'AI Automation Trends 2025',
  'Machine Learning Best Practices',
  'Generative AI Applications in Business',
  'Computer Vision và ứng dụng thực tế',
  'Natural Language Processing trong doanh nghiệp',
  'AI Ethics và Responsible AI',
  'Large Language Models và ChatGPT',
  'AI trong Healthcare và Medical Imaging',
]

/**
 * Platforms for video embed rotation
 * Each post will use a different platform based on timestamp
 * 
 * NOTE: Only YouTube and TikTok are FREE on Apify
 * - Twitter: requires login since June 2023
 * - Reddit: all scrapers require paid subscription
 */
const VIDEO_PLATFORMS = ['youtube', 'tiktok'] as const
type VideoPlatform = typeof VIDEO_PLATFORMS[number]

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get the next platform in rotation based on current timestamp
 * This ensures variety across posts generated at different times
 */
function getRotatingPlatform(): VideoPlatform {
  // Use current hour to rotate platforms (changes every hour)
  const hourIndex = new Date().getHours() % VIDEO_PLATFORMS.length
  return VIDEO_PLATFORMS[hourIndex]
}

/**
 * Maximum retries per platform before moving to next
 */
const MAX_RETRIES_PER_PLATFORM = 3

/**
 * Delay between retries (exponential backoff)
 */
function getRetryDelay(attempt: number): number {
  return Math.min(1000 * Math.pow(2, attempt), 10000) // 1s, 2s, 4s, max 10s
}

/**
 * Scrape video from a specific platform with retry logic
 * Tries up to MAX_RETRIES_PER_PLATFORM times before giving up
 */
async function scrapeVideoFromPlatformWithRetry(
  topic: string,
  platform: VideoPlatform
): Promise<ScrapedMedia | null> {
  console.log(`[ContentGenerator] Trying ${platform} (max ${MAX_RETRIES_PER_PLATFORM} retries)...`)
  
  for (let attempt = 1; attempt <= MAX_RETRIES_PER_PLATFORM; attempt++) {
    try {
      console.log(`[ContentGenerator] ${platform} attempt ${attempt}/${MAX_RETRIES_PER_PLATFORM}`)
      
      let videos: ScrapedMedia[] = []
      
      switch (platform) {
        case 'youtube':
          videos = await scrapeYouTubeVideos(topic, 3)
          break
        case 'tiktok':
          videos = await scrapeTikTokVideos(topic, 3)
          break
      }
      
      if (videos.length > 0) {
        console.log(`[ContentGenerator] ✅ ${platform}: Found ${videos.length} items`)
        return videos[0]
      }
      
      console.log(`[ContentGenerator] ${platform} attempt ${attempt}: No results`)
      
    } catch (error) {
      console.error(`[ContentGenerator] ${platform} attempt ${attempt} error:`, error)
    }
    
    // Wait before retry (except on last attempt)
    if (attempt < MAX_RETRIES_PER_PLATFORM) {
      const delay = getRetryDelay(attempt)
      console.log(`[ContentGenerator] Waiting ${delay}ms before retry...`)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  console.log(`[ContentGenerator] ❌ ${platform}: All ${MAX_RETRIES_PER_PLATFORM} retries failed`)
  return null
}

/**
 * Scrape video with platform rotation, retry logic, and YouTube fallback
 * 
 * Logic:
 * 1. Chọn platform theo rotation (dựa trên timestamp)
 * 2. Thử platform đó 3 lần
 * 3. Nếu fail, thử platform tiếp theo trong rotation
 * 4. YouTube luôn là fallback cuối cùng
 */
async function scrapeVideoWithFallback(topic: string): Promise<ScrapedMedia | null> {
  // Get the platform rotation starting from current
  const primaryPlatform = getRotatingPlatform()
  console.log(`[ContentGenerator] Primary platform: ${primaryPlatform}`)
  
  // Build platform order: primary first, then others, YouTube last
  const platformOrder: VideoPlatform[] = [primaryPlatform]
  
  for (const p of VIDEO_PLATFORMS) {
    if (p !== primaryPlatform && p !== 'youtube') {
      platformOrder.push(p)
    }
  }
  
  // YouTube is always the final fallback
  if (primaryPlatform !== 'youtube') {
    platformOrder.push('youtube')
  }
  
  console.log(`[ContentGenerator] Platform order: ${platformOrder.join(' → ')}`)
  
  // Try each platform with retry logic
  for (const platform of platformOrder) {
    console.log(`\n[ContentGenerator] ===== Trying ${platform.toUpperCase()} =====`)
    
    const video = await scrapeVideoFromPlatformWithRetry(topic, platform)
    
    if (video) {
      console.log(`[ContentGenerator] 🎉 Got video from ${platform}: "${video.title?.substring(0, 50)}"`)
      return video
    }
    
    console.log(`[ContentGenerator] ${platform} failed, trying next platform...`)
  }
  
  console.log('[ContentGenerator] ❌ All platforms exhausted, no video found')
  return null
}

/**
 * Replace placeholders with actual content
 * - [IMAGE_PLACEHOLDER] -> Unsplash inline image
 * - [VIDEO_PLACEHOLDER] -> Video embed (rotating platform)
 */
function insertMediaContent(
  content: string,
  inlineImageUrl: string | null,
  videoEmbed: string | null,
  topic: string
): string {
  let result = content
  
  // Replace image placeholder
  if (result.includes('[IMAGE_PLACEHOLDER]')) {
    if (inlineImageUrl) {
      const imageHtml = generateImageEmbed(
        inlineImageUrl,
        `Hình minh họa về ${topic}`,
        `Nguồn: Unsplash`
      )
      result = result.replace('[IMAGE_PLACEHOLDER]', imageHtml)
      console.log('[ContentGenerator] Inserted inline image')
    } else {
      result = result.replace('[IMAGE_PLACEHOLDER]', '')
      console.log('[ContentGenerator] No inline image available, removed placeholder')
    }
  }
  
  // Replace video placeholder
  if (result.includes('[VIDEO_PLACEHOLDER]')) {
    if (videoEmbed) {
      result = result.replace('[VIDEO_PLACEHOLDER]', videoEmbed)
      console.log('[ContentGenerator] Inserted video embed')
    } else {
      result = result.replace('[VIDEO_PLACEHOLDER]', generateMediaPlaceholder(topic))
      console.log('[ContentGenerator] No video available, using placeholder message')
    }
  }
  
  // Clean up any old-style placeholders
  result = result.replace(/\[MEDIA_PLACEHOLDER_\d+\]/g, '')
  
  return result
}

/**
 * Generate context string from discovered content
 */
function buildContextFromDiscovery(items: Array<{ title: string; content: string; url: string }>): string {
  if (!items || items.length === 0) return ''
  
  const contextParts = items.slice(0, 3).map((item, i) => {
    const cleanContent = item.content
      .replace(/<[^>]*>/g, '')  // Remove HTML tags
      .substring(0, 200)
    return `${i + 1}. ${item.title}\n   ${cleanContent}...`
  })
  
  return `Thông tin tham khảo từ các nguồn gần đây:\n${contextParts.join('\n\n')}`
}

// ============================================================================
// MAIN GENERATION FUNCTIONS
// ============================================================================

/**
 * Generate a complete blog post with:
 * - Unique cover image from Unsplash
 * - 1 inline image from Unsplash
 * - 1 video embed (rotating YouTube/TikTok/Twitter/Reddit)
 * - Long-form content (2500-3000 words)
 */
export async function generatePostFromContent(
  topic: string,
  options: {
    useDeepThink?: boolean
    useApifyImages?: boolean
    skipMediaScraping?: boolean
  } = {}
): Promise<{
  success: boolean
  post?: CreatePostInput
  error?: string
}> {
  try {
    console.log(`\n${'='.repeat(60)}`)
    console.log(`[ContentGenerator] Starting generation for topic: "${topic}"`)
    console.log(`${'='.repeat(60)}`)
    
    // ========================================
    // STEP 1: Fetch 2 UNIQUE images from Unsplash (cover + inline)
    // ========================================
    let coverImageUrl = '/blog/images/placeholder.jpg'
    let inlineImageUrl: string | null = null
    let imageSource: 'unsplash' | 'apify' | 'manual' = 'manual'
    
    console.log(`[ContentGenerator] UNSPLASH_ACCESS_KEY set: ${!!process.env.UNSPLASH_ACCESS_KEY}`)
    
    if (isUnsplashConfigured()) {
      console.log('[ContentGenerator] Fetching 2 UNIQUE images from Unsplash...')
      try {
        // Fetch 2 different images in one API call
        const images = await fetchBlogImages(topic, 2)
        
        // First image for cover
        if (images[0] && images[0].url !== '/blog/images/placeholder.jpg') {
          coverImageUrl = images[0].url
          imageSource = 'unsplash'
          console.log(`[ContentGenerator] ✅ Cover image: ${coverImageUrl.substring(0, 60)}...`)
        }
        
        // Second image for inline (DIFFERENT from cover)
        if (images[1] && images[1].url !== '/blog/images/placeholder.jpg') {
          inlineImageUrl = images[1].url
          console.log(`[ContentGenerator] ✅ Inline image: ${inlineImageUrl.substring(0, 60)}...`)
        }
        
        // Log if images are same (shouldn't happen with 2+ results)
        if (coverImageUrl === inlineImageUrl && inlineImageUrl) {
          console.log('[ContentGenerator] ⚠️ Warning: Cover and inline are same image')
        } else {
          console.log('[ContentGenerator] ✅ Cover and inline are DIFFERENT images')
        }
        
      } catch (error) {
        console.error('[ContentGenerator] ❌ Unsplash fetch error:', error)
      }
    } else {
      console.log('[ContentGenerator] ⚠️ Unsplash not configured (UNSPLASH_ACCESS_KEY missing)')
    }
    
    // ========================================
    // STEP 3: Discover context from Apify
    // ========================================
    let context = ''
    let apifySourceUrl: string | undefined
    let apifyActorId: string | undefined
    
    if (options.useApifyImages !== false && isApifyConfigured()) {
      try {
        console.log('[ContentGenerator] Discovering context from Apify...')
        const discovered = await findPopularAIPosts({ maxResults: 5 })
        
        if (discovered.items && discovered.items.length > 0) {
          const relevant = discovered.items.find(item => 
            item.title.toLowerCase().includes(topic.toLowerCase().split(' ')[0]) ||
            item.content.toLowerCase().includes(topic.toLowerCase().split(' ')[0])
          ) || discovered.items[0]
          
          context = buildContextFromDiscovery(discovered.items)
          apifySourceUrl = relevant.url
          apifyActorId = process.env.APIFY_DEFAULT_ACTOR_ID
          console.log(`[ContentGenerator] ✅ Got context from ${discovered.items.length} sources`)
        }
      } catch (error) {
        console.error('[ContentGenerator] Apify discovery error:', error)
      }
    }
    
    // ========================================
    // STEP 4: Scrape VIDEO with platform rotation
    // ========================================
    let videoEmbed: string | null = null
    
    if (!options.skipMediaScraping && isApifyConfigured()) {
      console.log('[ContentGenerator] Scraping video with platform rotation...')
      const video = await scrapeVideoWithFallback(topic)
      
      if (video) {
        videoEmbed = generateEmbed(video)
        console.log(`[ContentGenerator] ✅ Got ${video.platform} video: ${video.title?.substring(0, 50)}`)
      } else {
        console.log('[ContentGenerator] ⚠️ No video found from any platform')
      }
    }
    
    // ========================================
    // STEP 5: Generate content with Gemini
    // ========================================
    console.log('[ContentGenerator] Generating blog content with Gemini...')
    
    // Determine if we have media to insert
    const hasInlineImage = !!inlineImageUrl
    const hasVideo = !!videoEmbed
    
    const blogPost = await generateBlogPost(topic, context, {
      useDeepThink: options.useDeepThink,
      length: 'extended', // 2500-3000 words
      includeMediaPlaceholders: hasInlineImage || hasVideo,
      mediaCount: (hasInlineImage ? 1 : 0) + (hasVideo ? 1 : 0),
      useNewPlaceholderFormat: true, // Use [IMAGE_PLACEHOLDER] and [VIDEO_PLACEHOLDER]
    })
    
    console.log(`[ContentGenerator] ✅ Generated: "${blogPost.title}" (${blogPost.content.length} chars)`)
    
    // ========================================
    // STEP 6: Insert media content
    // ========================================
    console.log('[ContentGenerator] Inserting media content...')
    const finalContent = insertMediaContent(
      blogPost.content,
      inlineImageUrl,
      videoEmbed,
      topic
    )
    
    // ========================================
    // STEP 7: Save to database
    // ========================================
    const postInput: CreatePostInput = {
      title: blogPost.title,
      content: finalContent,
      excerpt: blogPost.excerpt,
      author: 'Sutralab AI',
      source: 'gemini',
      tags: blogPost.tags,
      imageUrl: coverImageUrl,
      imageSource,
      apifySourceUrl,
      apifyActorId,
      geminiModel: blogPost.model,
      geminiPrompt: `Generate extended blog post about: ${topic}`,
      deepThinkUsed: options.useDeepThink || false,
      published: true,
    }
    
    console.log('[ContentGenerator] Saving post to database...')
    await createPost(postInput)
    
    console.log(`[ContentGenerator] ✅ Post saved successfully!`)
    console.log(`[ContentGenerator] Cover: ${imageSource === 'unsplash' ? 'Unsplash' : 'Placeholder'}`)
    console.log(`[ContentGenerator] Inline image: ${inlineImageUrl ? 'Yes' : 'No'}`)
    console.log(`[ContentGenerator] Video embed: ${videoEmbed ? 'Yes' : 'No'}`)
    
    return {
      success: true,
      post: postInput,
    }
  } catch (error) {
    console.error('[ContentGenerator] ❌ Error generating post:', error)
    
    let errorMessage = 'Unknown error'
    if (error instanceof Error) {
      errorMessage = error.message
      console.error('[ContentGenerator] Stack:', error.stack)
    } else if (typeof error === 'object' && error !== null) {
      errorMessage = (error as any).message || JSON.stringify(error)
    }
    
    return {
      success: false,
      error: errorMessage,
    }
  }
}

/**
 * Generate multiple posts from trending topics
 * Used by cron job for automated daily posting
 * 
 * DEFAULT: 1 post per day (optimal for Apify free tier)
 */
export async function generateMultiplePosts(
  options: {
    count?: number
    useDeepThink?: boolean
    useApifyImages?: boolean
    skipMediaScraping?: boolean
  } = {}
): Promise<{
  success: number
  failed: number
  posts: Array<{
    title: string
    slug: string
    success: boolean
    error?: string
  }>
}> {
  // Default to 1 post per day (optimal for Apify free tier $5/month)
  const count = options.count ?? 1
  const results = {
    success: 0,
    failed: 0,
    posts: [] as Array<{
      title: string
      slug: string
      success: boolean
      error?: string
    }>,
  }
  
  console.log(`\n${'='.repeat(60)}`)
  console.log(`[ContentGenerator] Starting batch generation for ${count} posts`)
  console.log(`${'='.repeat(60)}`)
  
  // ========================================
  // Discover trending topics from Apify
  // ========================================
  let topics: string[] = []
  
  if (isApifyConfigured()) {
    try {
      console.log('[ContentGenerator] Discovering topics from Apify...')
      const discovered = await findPopularAIPosts({
        maxResults: count * 2,
      })
      
      if (discovered.items && discovered.items.length > 0) {
        topics = discovered.items
          .map(item => {
            const words = item.title.split(' ').filter(w => w.length > 3)
            return words.slice(0, 5).join(' ')
          })
          .filter((topic, index, self) => 
            topic.length > 10 && self.indexOf(topic) === index
          )
          .slice(0, count)
        
        console.log(`[ContentGenerator] Discovered ${topics.length} topics`)
      }
    } catch (error) {
      console.error('[ContentGenerator] Topic discovery error:', error)
    }
  }
  
  // Use fallback topics if needed
  if (topics.length < count) {
    console.log('[ContentGenerator] Using fallback topics')
    const shuffled = [...DEFAULT_TOPICS].sort(() => Math.random() - 0.5)
    topics = [...topics, ...shuffled].slice(0, count)
  }
  
  console.log(`[ContentGenerator] Topics to generate: ${topics.join(', ')}`)
  
  // ========================================
  // Generate posts sequentially
  // ========================================
  for (let i = 0; i < topics.length; i++) {
    const topic = topics[i]
    
    try {
      console.log(`\n[ContentGenerator] Generating post ${i + 1}/${topics.length}: "${topic}"`)
      
      const result = await generatePostFromContent(topic, {
        useDeepThink: options.useDeepThink,
        useApifyImages: options.useApifyImages,
        skipMediaScraping: options.skipMediaScraping,
      })
      
      if (result.success && result.post) {
        results.success++
        results.posts.push({
          title: result.post.title,
          slug: result.post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          success: true,
        })
        console.log(`[ContentGenerator] ✅ Success: ${result.post.title}`)
      } else {
        results.failed++
        results.posts.push({
          title: topic,
          slug: topic.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          success: false,
          error: result.error,
        })
        console.log(`[ContentGenerator] ❌ Failed: ${topic} - ${result.error}`)
      }
      
      // Delay between requests to respect rate limits
      if (i < topics.length - 1) {
        console.log('[ContentGenerator] Waiting 5s before next post...')
        await new Promise(resolve => setTimeout(resolve, 5000))
      }
      
    } catch (error) {
      results.failed++
      results.posts.push({
        title: topic,
        slug: topic.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
      console.error(`[ContentGenerator] ❌ Error for "${topic}":`, error)
    }
  }
  
  console.log(`\n${'='.repeat(60)}`)
  console.log(`[ContentGenerator] Batch complete: ${results.success} success, ${results.failed} failed`)
  console.log(`${'='.repeat(60)}`)
  
  return results
}
