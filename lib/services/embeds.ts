/**
 * Social Media Embed Service
 * Generates responsive embed HTML for YouTube, TikTok, Twitter/X, and Reddit
 * 
 * @module lib/services/embeds
 */

// Types for media items from scrapers
export interface MediaItem {
  platform: 'youtube' | 'tiktok' | 'twitter' | 'reddit'
  url: string
  title?: string
  author?: string
  authorUrl?: string
  thumbnailUrl?: string
  videoId?: string
  postId?: string
}

/**
 * Extract YouTube video ID from various URL formats
 * Supports: youtube.com/watch?v=, youtu.be/, youtube.com/embed/
 */
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

/**
 * Extract TikTok video ID from URL
 * Supports: tiktok.com/@user/video/{id}
 */
function extractTikTokId(url: string): { username: string; videoId: string } | null {
  const match = url.match(/tiktok\.com\/@([^/]+)\/video\/(\d+)/)
  if (match) {
    return { username: match[1], videoId: match[2] }
  }
  return null
}

/**
 * Extract Twitter/X post ID from URL
 * Supports: twitter.com/user/status/{id}, x.com/user/status/{id}, x.com/i/status/{id}
 */
function extractTwitterId(url: string): { username: string; tweetId: string } | null {
  // Check for undefined in URL (invalid data)
  if (url.includes('undefined')) {
    return null
  }
  
  // Pattern for normal URLs with username
  const normalMatch = url.match(/(?:twitter|x)\.com\/([^/]+)\/status\/(\d+)/)
  if (normalMatch) {
    return { username: normalMatch[1], tweetId: normalMatch[2] }
  }
  
  // Pattern for status-only URLs (x.com/i/status/{id} or just status ID)
  const statusOnlyMatch = url.match(/status\/(\d+)/)
  if (statusOnlyMatch) {
    return { username: 'i', tweetId: statusOnlyMatch[1] } // 'i' is Twitter's internal redirect
  }
  
  return null
}

/**
 * Generate responsive YouTube embed HTML
 * Uses privacy-enhanced mode (youtube-nocookie.com)
 */
export function generateYouTubeEmbed(url: string, title?: string): string {
  const videoId = extractYouTubeId(url)
  if (!videoId) {
    console.warn(`[Embeds] Invalid YouTube URL: ${url}`)
    return ''
  }

  return `
<div class="video-embed youtube-embed" style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;max-width:100%;margin:2rem 0;">
  <iframe 
    src="https://www.youtube-nocookie.com/embed/${videoId}" 
    title="${title || 'YouTube video'}"
    style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
    allowfullscreen
    loading="lazy"
  ></iframe>
</div>
`.trim()
}

/**
 * Generate TikTok embed HTML
 * Uses iframe embed (more reliable than blockquote + widget.js in Next.js SSR)
 */
export function generateTikTokEmbed(url: string, author?: string): string {
  const data = extractTikTokId(url)
  if (!data) {
    console.warn(`[Embeds] Invalid TikTok URL: ${url}`)
    return ''
  }

  // Use TikTok's iframe embed v2 - more reliable than widget.js
  // Fixed height 700px to match TikTok embed v2 actual dimensions (video + UI)
  return `
<div class="video-embed tiktok-embed" style="max-width:325px;margin:2rem auto;">
  <iframe 
    src="https://www.tiktok.com/embed/v2/${data.videoId}"
    title="TikTok video by @${author || data.username}"
    style="width:100%;height:700px;border:0;"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
    loading="lazy"
  ></iframe>
</div>
`.trim()
}

/**
 * Generate Twitter/X embed HTML
 * Uses Twitter's official widget script
 */
export function generateTwitterEmbed(url: string): string {
  const data = extractTwitterId(url)
  if (!data) {
    console.warn(`[Embeds] Invalid Twitter/X URL: ${url}`)
    return ''
  }

  // Normalize URL to x.com
  const normalizedUrl = `https://x.com/${data.username}/status/${data.tweetId}`

  return `
<div class="social-embed twitter-embed" style="margin:2rem 0;max-width:550px;">
  <blockquote class="twitter-tweet" data-dnt="true">
    <a href="${normalizedUrl}"></a>
  </blockquote>
  <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</div>
`.trim()
}

/**
 * Generate Reddit embed HTML
 * Uses Reddit's official embed widget
 */
export function generateRedditEmbed(url: string, title?: string): string {
  // Ensure URL is properly formatted
  const cleanUrl = url.replace(/\/$/, '') // Remove trailing slash
  
  return `
<div class="social-embed reddit-embed" style="margin:2rem 0;">
  <blockquote class="reddit-embed-bq" data-embed-height="500">
    <a href="${cleanUrl}">${title || 'View on Reddit'}</a>
  </blockquote>
  <script async src="https://embed.reddit.com/widgets.js" charset="utf-8"></script>
</div>
`.trim()
}

/**
 * Generate embed HTML based on platform type
 */
export function generateEmbed(media: MediaItem): string {
  switch (media.platform) {
    case 'youtube':
      return generateYouTubeEmbed(media.url, media.title)
    case 'tiktok':
      return generateTikTokEmbed(media.url, media.author)
    case 'twitter':
      return generateTwitterEmbed(media.url)
    case 'reddit':
      return generateRedditEmbed(media.url, media.title)
    default:
      console.warn(`[Embeds] Unknown platform: ${(media as MediaItem).platform}`)
      return ''
  }
}

/**
 * Detect platform from URL and generate appropriate embed
 */
export function generateEmbedFromUrl(url: string, title?: string): string {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return generateYouTubeEmbed(url, title)
  }
  if (url.includes('tiktok.com')) {
    return generateTikTokEmbed(url)
  }
  if (url.includes('twitter.com') || url.includes('x.com')) {
    return generateTwitterEmbed(url)
  }
  if (url.includes('reddit.com')) {
    return generateRedditEmbed(url, title)
  }
  
  console.warn(`[Embeds] Unable to detect platform for URL: ${url}`)
  return ''
}

/**
 * Generate a simple image embed with optional caption
 */
export function generateImageEmbed(imageUrl: string, alt: string, caption?: string): string {
  return `
<figure style="margin:2rem 0;text-align:center;">
  <img 
    src="${imageUrl}" 
    alt="${alt}"
    style="max-width:100%;height:auto;border-radius:8px;"
    loading="lazy"
  />
  ${caption ? `<figcaption style="margin-top:0.5rem;font-size:0.9rem;color:#666;">${caption}</figcaption>` : ''}
</figure>
`.trim()
}

/**
 * Create placeholder text when no media is available
 */
export function generateMediaPlaceholder(topic: string): string {
  return `
<div class="media-placeholder" style="margin:2rem 0;padding:2rem;background:#f5f5f5;border-radius:8px;text-align:center;">
  <p style="color:#666;margin:0;">📹 Nội dung video về "${topic}" sẽ được cập nhật sớm.</p>
</div>
`.trim()
}

