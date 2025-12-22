/**
 * Google Gemini API Client
 * Supports Gemini 3.0 Pro, 3.0 Deep Think, 2.5 Pro, and 2.0 Flash
 */

import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini client
let genAI: GoogleGenerativeAI | null = null

function getGeminiClient(): GoogleGenerativeAI {
  if (genAI) {
    return genAI
  }

  const apiKey = process.env.GOOGLE_GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('GOOGLE_GEMINI_API_KEY is not set in environment variables')
  }

  genAI = new GoogleGenerativeAI(apiKey)
  return genAI
}

/**
 * Available Gemini models (December 2025)
 * 
 * FLASH models - Ưu tiên cho hầu hết use cases:
 * - gemini-2.5-flash: Best price-performance, 1M context, fast (RECOMMENDED)
 * - gemini-2.5-flash-lite: Even faster, more cost-efficient
 * - gemini-2.0-flash: Previous gen, stable
 * 
 * PRO models - Cho tasks phức tạp:
 * - gemini-2.5-pro: Most advanced, Deep Think mode
 * - gemini-1.5-pro: Stable, 2M context
 */
export const GEMINI_MODELS = {
  // Flash models (recommended for most use cases)
  FLASH_2_5: 'gemini-2.5-flash',           // ⭐ BEST: Price-performance, 1M context
  FLASH_2_5_LITE: 'gemini-2.5-flash-lite', // Faster, cheaper
  FLASH_2_0: 'gemini-2.0-flash',           // Previous gen, stable
  
  // Pro models (for complex tasks)
  PRO_2_5: 'gemini-2.5-pro',               // Most advanced, Deep Think
  PRO_1_5: 'gemini-1.5-pro',               // Stable, 2M context
} as const

/**
 * Default model configuration
 * Using gemini-2.5-flash as default (best price-performance)
 */
const DEFAULT_MODEL = GEMINI_MODELS.FLASH_2_5  // Ignore env var to ensure correct model
const DEEP_THINK_MODEL = GEMINI_MODELS.PRO_2_5 // Deep Think mode

/**
 * Generate content using Gemini API
 */
export async function generateContent(
  prompt: string,
  options: {
    model?: string
    useDeepThink?: boolean
    temperature?: number
    maxTokens?: number
  } = {}
): Promise<string> {
  const client = getGeminiClient()
  
  const modelName = options.useDeepThink 
    ? DEEP_THINK_MODEL 
    : (options.model || DEFAULT_MODEL)

  const model = client.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: options.temperature ?? 0.7,
      maxOutputTokens: options.maxTokens ?? 8192,
    },
  })

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error('Gemini API error:', error)
    throw new Error(`Failed to generate content: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Generate content with multi-step reasoning (Deep Think)
 */
export async function generateContentWithDeepThink(
  prompt: string,
  options: {
    temperature?: number
    maxTokens?: number
  } = {}
): Promise<{
  content: string
  model: string
}> {
  const content = await generateContent(prompt, {
    useDeepThink: true,
    ...options,
  })

  return {
    content,
    model: DEEP_THINK_MODEL,
  }
}

/**
 * Analyze content and extract insights
 */
export async function analyzeContent(
  content: string,
  analysisType: 'summary' | 'key-points' | 'sentiment' | 'topics' = 'summary'
): Promise<string> {
  const prompts = {
    summary: `Summarize the following content in 2-3 sentences:\n\n${content}`,
    'key-points': `Extract the key points from the following content as a bulleted list:\n\n${content}`,
    sentiment: `Analyze the sentiment of the following content (positive, negative, or neutral) and explain why:\n\n${content}`,
    topics: `Identify the main topics and themes in the following content:\n\n${content}`,
  }

  return await generateContent(prompts[analysisType], {
    model: GEMINI_MODELS.FLASH_2_0,
    temperature: 0.3,
  })
}

/**
 * Generate blog post content
 * 
 * @param topic - The main topic of the blog post
 * @param context - Additional context (e.g., from scraped content)
 * @param options - Generation options including length and media placeholders
 */
export async function generateBlogPost(
  topic: string,
  context?: string,
  options: {
    useDeepThink?: boolean
    length?: 'short' | 'medium' | 'long' | 'extended'
    includeMediaPlaceholders?: boolean
    mediaCount?: number
    useNewPlaceholderFormat?: boolean // Use [IMAGE_PLACEHOLDER] + [VIDEO_PLACEHOLDER]
  } = {}
): Promise<{
  title: string
  content: string
  excerpt: string
  tags: string[]
  model: string
}> {
  // Length instructions (reduced by ~35% from original for better readability)
  const lengthInstructions = {
    short: 'Write a concise blog post (400-600 words)',
    medium: 'Write a comprehensive blog post (800-1200 words)',
    long: 'Write an in-depth blog post (1400-1800 words)',
    extended: 'Write a detailed, comprehensive blog post (1600-2000 words)', // Reduced from 2500-3000
  }

  // Media placeholder instructions - NEW FORMAT: 1 image + 1 video
  const mediaInstructions = options.includeMediaPlaceholders ? (
    options.useNewPlaceholderFormat ? `
QUAN TRỌNG - Media Placeholders (1 ảnh + 1 video):
- Chèn CHÍNH XÁC 2 placeholders theo format sau:
- [IMAGE_PLACEHOLDER] - Đặt sau phần giới thiệu hoặc section 1 (sẽ được thay bằng ảnh minh họa)
- [VIDEO_PLACEHOLDER] - Đặt sau phần phân tích chính hoặc trước kết luận (sẽ được thay bằng video)
- HAI placeholders này PHẢI xuất hiện trong bài, KHÔNG đặt liên tiếp nhau
- Đặt mỗi placeholder trên 1 dòng riêng biệt` : `
QUAN TRỌNG - Media Placeholders:
- Chèn CHÍNH XÁC ${options.mediaCount || 2} placeholder(s) để đặt video/nội dung liên quan
- Sử dụng format: [MEDIA_PLACEHOLDER_1], [MEDIA_PLACEHOLDER_2], etc.
- Đặt placeholders sau các phần quan trọng, KHÔNG đặt liên tiếp
- Placeholder 1: Sau phần giới thiệu hoặc section 1
- Placeholder 2: Sau phần phân tích chính hoặc trước kết luận
- PHẢI có CHÍNH XÁC ${options.mediaCount || 2} placeholders trong bài!`
  ) : ''

  const prompt = `You are an expert AI blogger writing about the AI industry and technology trends.

Topic: ${topic}
${context ? `\nContext và thông tin tham khảo:\n${context}` : ''}

${lengthInstructions[options.length || 'extended']} about this topic.

REQUIREMENTS:
1. LANGUAGE: Write ENTIRELY in Vietnamese (tiếng Việt)
2. TONE: Engaging, professional, authoritative but accessible
3. STRUCTURE:
   - Strong opening hook (2-3 sentences)
   - 4-5 main sections với ## headings (súc tích, không lan man)
   - Each section: 200-350 words, đi thẳng vào trọng tâm
   - Include real examples, statistics khi cần
   - Brief conclusion với 2-3 takeaways
4. SEO:
   - Include keywords naturally
   - Use bullet points và numbered lists
   - Add bold cho key terms
5. FOCUS:
   - Explain concepts clearly và ngắn gọn
   - Ưu tiên chất lượng hơn số lượng
   - Mỗi paragraph phải có value rõ ràng
${mediaInstructions}

OUTPUT FORMAT: Valid Markdown with proper headings hierarchy.
DO NOT include the title as # heading - just start with the content.`

  // Token limits adjusted for reduced content length (-35%)
  const maxTokens = {
    short: 1500,
    medium: 3000,
    long: 4500,
    extended: 5500, // Reduced from 8192 for ~1600-2000 words
  }

  const content = await generateContent(prompt, {
    useDeepThink: options.useDeepThink,
    temperature: 0.75, // Slightly lower for more coherent long-form
    maxTokens: maxTokens[options.length || 'extended'],
  })

  // Clean and extract title
  let title = topic
  let blogContent = content

  // Try to extract title from first heading if present
  const titleMatch = content.match(/^#\s+(.+)$/m)
  if (titleMatch) {
    title = titleMatch[1].trim()
    blogContent = content.replace(/^#\s+.+$/m, '').trim()
  }

  // Generate concise excerpt using same model (faster)
  const excerptPrompt = `Tạo excerpt ngắn gọn (2 câu, tối đa 150 ký tự) cho bài viết này. Chỉ trả về excerpt, không có dấu ngoặc kép:\n\n${content.substring(0, 800)}`
  const excerpt = await generateContent(excerptPrompt, {
    temperature: 0.5,
    maxTokens: 100,
  })

  // Extract tags using same model
  const tagsPrompt = `Trích xuất 4-6 tags liên quan (từ đơn hoặc cụm từ ngắn) cho bài viết này. Trả về danh sách phân cách bằng dấu phẩy, không có dấu ngoặc:\n\n${content.substring(0, 800)}`
  const tagsResponse = await generateContent(tagsPrompt, {
    temperature: 0.3,
    maxTokens: 80,
  })
  const tags = tagsResponse
    .split(',')
    .map(tag => tag.trim().toLowerCase().replace(/['"]/g, ''))
    // Loại bỏ tag quá ngắn (1 ký tự như "h", "t"...) và quá dài
    .filter(tag => tag.length > 1 && tag.length < 30)
    .slice(0, 6)

  return {
    title: title.trim(),
    content: blogContent.trim(),
    excerpt: excerpt.trim().replace(/^["']|["']$/g, '').substring(0, 160),
    tags,
    model: options.useDeepThink ? DEEP_THINK_MODEL : DEFAULT_MODEL,
  }
}

