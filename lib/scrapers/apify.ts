/**
 * Apify API Client
 * Handles content discovery and image extraction from various sources
 */

import { ApifyClient } from 'apify-client'

// Initialize Apify client
let apifyClient: ApifyClient | null = null

function getApifyClient(): ApifyClient {
  if (apifyClient) {
    return apifyClient
  }

  const apiToken = process.env.APIFY_API_TOKEN
  if (!apiToken) {
    throw new Error('APIFY_API_TOKEN is not set in environment variables')
  }

  apifyClient = new ApifyClient({ token: apiToken })
  return apifyClient
}

/**
 * Discover trending content from Apify actors
 * 
 * 🏆 RECOMMENDED ACTOR: 'apify/google-search-scraper'
 * 
 * Why Google Search Scraper?
 * - ✅ Tổng hợp content từ nhiều nguồn (websites, blogs, news)
 * - ✅ Content chất lượng cao, SEO-friendly
 * - ✅ Có images từ sources
 * - ✅ Dễ scrape, ít bị block
 * - ✅ Perfect cho AI industry topics
 * - ✅ Cost-effective, real-time trending
 * 
 * Alternative Actors:
 * - Google News: 'apify/google-news-scraper' (news articles only)
 * - RSS: 'apify/rss-reader' (RSS feeds aggregation)
 * - Twitter: 'apify/twitter-scraper' (real-time but short content)
 * - Reddit: 'apify/reddit-scraper' (deep discussions)
 * 
 * Actor ID format: username/actor-name
 * Find actors at: https://apify.com/store
 */
export async function discoverContent(
  query: string,
  options: {
    actorId?: string
    maxResults?: number
    platforms?: ('twitter' | 'linkedin' | 'reddit' | 'news')[]
    // Actor-specific input parameters
    input?: Record<string, any>
  } = {}
): Promise<{
  items: Array<{
    title: string
    content: string
    url: string
    author?: string
    imageUrl?: string
    publishedAt?: string
    platform: string
  }>
  actorId: string
}> {
  const client = getApifyClient()
  const actorId = options.actorId || process.env.APIFY_DEFAULT_ACTOR_ID

  if (!actorId) {
    throw new Error(
      'Apify actor ID not specified. Set APIFY_DEFAULT_ACTOR_ID or pass actorId in options.\n' +
      'Popular actors: apify/twitter-scraper, apify/linkedin-posts-scraper, apify/reddit-scraper\n' +
      'Find more at: https://apify.com/store'
    )
  }

  try {
    // Build actor input based on actor type
    // Different actors have different input formats
    let actorInput: Record<string, any> = options.input || {}

    // Default input for common actors
    if (!options.input) {
      if (actorId.includes('google-search')) {
        // Google Search Scraper - uses 'queries' as a STRING (newline-separated)
        // Reference: https://apify.com/apify/google-search-scraper
        actorInput = {
          queries: query, // Single string, NOT an array
          maxPagesPerQuery: 1,
          resultsPerPage: options.maxResults || 10,
          countryCode: 'vn', // lowercase for Apify
          languageCode: 'vi',
          mobileResults: false,
        }
      } else if (actorId.includes('google-news')) {
        // Google News Scraper
        actorInput = {
          query: query,
          maxItems: options.maxResults || 10,
          country: 'VN',
          language: 'vi',
        }
      } else if (actorId.includes('rss-reader')) {
        // RSS Reader
        actorInput = {
          feeds: [], // Need to provide RSS feed URLs
          maxItems: options.maxResults || 10,
        }
      } else if (actorId.includes('twitter')) {
        actorInput = {
          searchTerms: [query],
          maxTweets: options.maxResults || 10,
          addUserInfo: true,
        }
      } else if (actorId.includes('linkedin')) {
        actorInput = {
          search: query,
          maxResults: options.maxResults || 10,
        }
      } else if (actorId.includes('reddit')) {
        actorInput = {
          searchKeywords: query,
          maxItems: options.maxResults || 10,
        }
      } else {
        // Generic input for unknown actors
        actorInput = {
          query,
          maxResults: options.maxResults || 10,
        }
      }
    }

    // Run actor with input
    const run = await client.actor(actorId).call(actorInput)

    // Wait for run to finish and get results
    const { items } = await client.dataset(run.defaultDatasetId).listItems()

    return {
      items: (items || []).map((item: any) => {
        // Google Search Scraper returns different structure
        if (actorId.includes('google-search')) {
          return {
            title: item.title || item.name || '',
            content: item.description || item.snippet || '',
            url: item.url || item.link || '',
            author: item.author || item.source || '',
            imageUrl: item.image || item.thumbnail || '',
            publishedAt: item.publishedAt || item.date || '',
            platform: 'website',
          }
        }
        
        // Generic mapping for other actors
        return {
          title: item.title || item.text || item.tweetText || item.postText || item.name || '',
          content: item.content || item.text || item.description || item.tweetText || item.postText || item.snippet || '',
          url: item.url || item.link || item.tweetUrl || item.postUrl || '',
          author: item.author || item.username || item.userName || item.creator || item.source || '',
          imageUrl: item.imageUrl || item.image || item.thumbnail || item.mediaUrl || '',
          publishedAt: item.publishedAt || item.date || item.createdAt || item.timestamp || '',
          platform: item.platform || (actorId.includes('twitter') ? 'twitter' : 
                  actorId.includes('linkedin') ? 'linkedin' :
                  actorId.includes('reddit') ? 'reddit' :
                  actorId.includes('google') ? 'website' : 'unknown'),
        }
      }),
      actorId,
    }
  } catch (error) {
    console.error('Apify API error:', error)
    throw new Error(`Failed to discover content: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Extract images from discovered content
 */
export async function extractImages(
  contentItems: Array<{ url: string; imageUrl?: string }>,
  options: {
    minWidth?: number
    minHeight?: number
    maxResults?: number
  } = {}
): Promise<Array<{
  url: string
  sourceUrl: string
  width?: number
  height?: number
}>> {
  const images: Array<{
    url: string
    sourceUrl: string
    width?: number
    height?: number
  }> = []

  for (const item of contentItems) {
    if (item.imageUrl) {
      images.push({
        url: item.imageUrl,
        sourceUrl: item.url,
      })
    }
  }

  // Filter by size if specified
  const filtered = options.minWidth || options.minHeight
    ? images.filter(img => {
        if (options.minWidth && img.width && img.width < options.minWidth) return false
        if (options.minHeight && img.height && img.height < options.minHeight) return false
        return true
      })
    : images

  return filtered.slice(0, options.maxResults || 10)
}

/**
 * Find popular posts about AI industry
 */
export async function findPopularAIPosts(
  options: {
    maxResults?: number
    timeRange?: 'day' | 'week' | 'month'
  } = {}
): Promise<{
  items: Array<{
    title: string
    content: string
    url: string
    author?: string
    imageUrl?: string
    publishedAt?: string
    platform: string
    engagement?: number
  }>
}> {
  // Optimized queries for AI industry content discovery
  const queries = [
    'AI artificial intelligence trends 2025',
    'machine learning applications',
    'generative AI use cases',
    'AI automation business',
    'artificial intelligence news',
  ]

  const allItems: Array<{
    title: string
    content: string
    url: string
    author?: string
    imageUrl?: string
    publishedAt?: string
    platform: string
    engagement?: number
  }> = []

  for (const query of queries) {
    try {
      const result = await discoverContent(query, {
        maxResults: Math.ceil((options.maxResults || 20) / queries.length),
        // Use default actor (Google Search Scraper recommended)
      })

      allItems.push(...result.items.map(item => ({
        ...item,
        engagement: 0, // Could be extracted from Apify data if available
      })))
    } catch (error) {
      console.error(`Error discovering content for query "${query}":`, error)
    }
  }

  // Remove duplicates by URL
  const uniqueItems = Array.from(
    new Map(allItems.map(item => [item.url, item])).values()
  )

  // Sort by engagement or published date
  uniqueItems.sort((a, b) => {
    if (a.engagement && b.engagement) {
      return b.engagement - a.engagement
    }
    return new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime()
  })

  return {
    items: uniqueItems.slice(0, options.maxResults || 20),
  }
}

// ============================================================================
// PLATFORM-SPECIFIC SCRAPERS FOR MEDIA EMBEDS
// These scrapers fetch videos/posts that can be embedded in blog content
// ============================================================================

/**
 * Media item type returned by platform scrapers
 */
export interface ScrapedMedia {
  platform: 'youtube' | 'tiktok' | 'twitter' | 'reddit'
  url: string
  title: string
  author?: string
  authorUrl?: string
  thumbnailUrl?: string
  views?: number
  likes?: number
  publishedAt?: string
}

/**
 * Check if Apify is configured
 */
export function isApifyConfigured(): boolean {
  return !!process.env.APIFY_API_TOKEN
}

/**
 * Scrape YouTube videos by search query
 * Actor: streamers/youtube-scraper (FREE, reliable)
 * 
 * @param query - Search keywords
 * @param maxResults - Maximum videos to return (default: 5)
 */
export async function scrapeYouTubeVideos(
  query: string,
  maxResults: number = 5
): Promise<ScrapedMedia[]> {
  if (!isApifyConfigured()) {
    console.log('[Apify] Not configured, skipping YouTube scrape')
    return []
  }

  try {
    const client = getApifyClient()
    console.log(`[Apify] Scraping YouTube for: "${query}"`)

    // Use streamers/youtube-scraper - FREE and reliable
    // Alternative: apify/youtube-scraper (official but may have limits)
    const run = await client.actor('streamers/youtube-scraper').call({
      searchKeywords: query,
      maxResults: maxResults,
      maxResultsShorts: 0, // Skip shorts
    }, { 
      timeout: 180,
      memory: 512, // Lower memory = cheaper
    })

    const { items } = await client.dataset(run.defaultDatasetId).listItems()

    return (items || []).slice(0, maxResults).map((item: any) => ({
      platform: 'youtube' as const,
      url: item.url || item.videoUrl || `https://www.youtube.com/watch?v=${item.id || item.videoId}`,
      title: item.title || item.text || '',
      author: item.channelName || item.channelTitle || item.author || '',
      authorUrl: item.channelUrl || '',
      thumbnailUrl: item.thumbnailUrl || item.thumbnail || '',
      views: item.viewCount || item.views || 0,
      likes: item.likeCount || item.likes || 0,
      publishedAt: item.publishedAt || item.uploadDate || item.date || '',
    }))
  } catch (error) {
    console.error('[Apify] YouTube scrape error:', error)
    return []
  }
}

/**
 * Scrape TikTok videos by search query
 * Actor: clockworks/tiktok-scraper (Official TikTok Scraper)
 * 
 * @param query - Search keywords or hashtag
 * @param maxResults - Maximum videos to return (default: 5)
 */
export async function scrapeTikTokVideos(
  query: string,
  maxResults: number = 5
): Promise<ScrapedMedia[]> {
  if (!isApifyConfigured()) {
    console.log('[Apify] Not configured, skipping TikTok scrape')
    return []
  }

  try {
    const client = getApifyClient()
    console.log(`[Apify] Scraping TikTok for: "${query}"`)

    const run = await client.actor('clockworks/tiktok-scraper').call({
      searchQueries: [query],
      resultsPerPage: maxResults,
      shouldDownloadVideos: false,
      shouldDownloadCovers: false,
    }, {
      timeout: 120,
      memory: 1024,
    })

    const { items } = await client.dataset(run.defaultDatasetId).listItems()

    return (items || []).slice(0, maxResults).map((item: any) => ({
      platform: 'tiktok' as const,
      url: item.webVideoUrl || `https://www.tiktok.com/@${item.authorMeta?.name}/video/${item.id}`,
      title: item.text || item.desc || '',
      author: item.authorMeta?.name || item.author || '',
      authorUrl: item.authorMeta?.url || `https://www.tiktok.com/@${item.authorMeta?.name}`,
      thumbnailUrl: item.covers?.default || item.videoMeta?.cover || '',
      views: item.playCount || item.views || 0,
      likes: item.diggCount || item.likes || 0,
      publishedAt: item.createTime ? new Date(item.createTime * 1000).toISOString() : '',
    }))
  } catch (error) {
    console.error('[Apify] TikTok scrape error:', error)
    return []
  }
}

/**
 * Scrape Twitter/X posts by search query
 * 
 * NOTE: As of June 30, 2023, Twitter requires login to view content.
 * Public scraping is no longer reliable. This function will skip Twitter
 * and let the fallback system try other platforms.
 * 
 * @param query - Search keywords
 * @param maxResults - Maximum tweets to return (default: 5)
 */
export async function scrapeTwitterPosts(
  query: string,
  maxResults: number = 5
): Promise<ScrapedMedia[]> {
  // Twitter/X requires login since June 2023
  // Skip this platform and let fallback handle it
  console.log('[Apify] Twitter/X requires login - skipping (use TikTok/YouTube/Reddit instead)')
  return []
}

/**
 * Scrape Reddit posts by search query
 * Actor: epctex/reddit-scraper (FREE actor)
 * 
 * @param query - Search keywords
 * @param maxResults - Maximum posts to return (default: 5)
 */
export async function scrapeRedditPosts(
  query: string,
  maxResults: number = 5
): Promise<ScrapedMedia[]> {
  if (!isApifyConfigured()) {
    console.log('[Apify] Not configured, skipping Reddit scrape')
    return []
  }

  try {
    const client = getApifyClient()
    console.log(`[Apify] Scraping Reddit for: "${query}"`)

    // Use epctex/reddit-scraper (FREE actor)
    const run = await client.actor('epctex/reddit-scraper').call({
      startUrls: [
        { url: `https://www.reddit.com/search/?q=${encodeURIComponent(query)}&sort=relevance&t=month` }
      ],
      maxItems: maxResults,
      proxy: {
        useApifyProxy: true,
      },
    }, {
      timeout: 180,
      memory: 512,
    })

    const { items } = await client.dataset(run.defaultDatasetId).listItems()

    return (items || []).slice(0, maxResults).map((item: any) => ({
      platform: 'reddit' as const,
      url: item.url || item.postUrl || `https://www.reddit.com${item.permalink}`,
      title: item.title || item.postTitle || '',
      author: item.author || item.username || '',
      authorUrl: item.author ? `https://www.reddit.com/user/${item.author}` : '',
      thumbnailUrl: item.thumbnail || item.image || '',
      views: 0,
      likes: item.score || item.upvotes || item.ups || 0,
      publishedAt: item.created_utc ? new Date(item.created_utc * 1000).toISOString() : item.createdAt || '',
    }))
  } catch (error) {
    console.error('[Apify] Reddit scrape error:', error)
    return []
  }
}

/**
 * Scrape media from multiple platforms for a given topic
 * Returns a mix of YouTube, TikTok, Twitter, and Reddit content
 * 
 * @param topic - The topic to search for
 * @param options - Scraping options
 */
export async function scrapeMultiPlatformMedia(
  topic: string,
  options: {
    platforms?: ('youtube' | 'tiktok' | 'twitter' | 'reddit')[]
    maxPerPlatform?: number
    preferredPlatform?: 'youtube' | 'tiktok' | 'twitter' | 'reddit'
  } = {}
): Promise<ScrapedMedia[]> {
  const platforms = options.platforms || ['youtube', 'tiktok', 'twitter', 'reddit']
  const maxPerPlatform = options.maxPerPlatform || 2
  const results: ScrapedMedia[] = []

  // Create search query from topic
  const searchQuery = topic.toLowerCase().includes('ai') 
    ? topic 
    : `${topic} AI`

  console.log(`[Apify] Scraping multi-platform media for: "${searchQuery}"`)

  // Scrape in parallel for speed
  const scraperPromises: Promise<ScrapedMedia[]>[] = []

  if (platforms.includes('youtube')) {
    scraperPromises.push(scrapeYouTubeVideos(searchQuery, maxPerPlatform))
  }
  if (platforms.includes('tiktok')) {
    scraperPromises.push(scrapeTikTokVideos(searchQuery, maxPerPlatform))
  }
  if (platforms.includes('twitter')) {
    scraperPromises.push(scrapeTwitterPosts(searchQuery, maxPerPlatform))
  }
  if (platforms.includes('reddit')) {
    scraperPromises.push(scrapeRedditPosts(searchQuery, maxPerPlatform))
  }

  // Wait for all scrapers to complete
  const allResults = await Promise.allSettled(scraperPromises)

  for (const result of allResults) {
    if (result.status === 'fulfilled') {
      results.push(...result.value)
    }
  }

  // Sort by preferred platform first, then by likes/views
  if (options.preferredPlatform) {
    results.sort((a, b) => {
      if (a.platform === options.preferredPlatform && b.platform !== options.preferredPlatform) return -1
      if (b.platform === options.preferredPlatform && a.platform !== options.preferredPlatform) return 1
      return (b.likes || 0) - (a.likes || 0)
    })
  } else {
    results.sort((a, b) => (b.likes || 0) - (a.likes || 0))
  }

  console.log(`[Apify] Found ${results.length} media items across platforms`)
  return results
}

