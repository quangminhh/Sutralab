/**
 * Seed Initial Blog Posts API Route
 * POST: Generate 3 initial blog posts using the existing AI generation pipeline
 * This is a one-time seeding endpoint to populate the blog with initial content
 * 
 * Returns immediately and runs generation in background to avoid timeout
 */

import { NextRequest, NextResponse } from 'next/server'
import { generateMultiplePosts } from '@/lib/ai/content-generator'

export async function POST(request: NextRequest) {
  try {
    // Check API keys
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          message: 'GOOGLE_GEMINI_API_KEY chưa được cấu hình',
        },
        { status: 500 }
      )
    }

    // Parse optional count from request body
    const body = await request.json().catch(() => ({}))
    const count = body.count || 3

    console.log(`🌱 Starting initial blog post seeding (${count} posts)...`)
    
    // Run generation in background (don't await)
    // This prevents timeout for long-running operations
    generateMultiplePosts({
      count,
      useDeepThink: false, // Use regular model for faster generation
      useApifyImages: true, // Use Apify images to save costs
    }).then((result) => {
      console.log(`✅ Seeding completed: ${result.success} success, ${result.failed} failed`)
      result.posts.forEach((post, i) => {
        if (post.success) {
          console.log(`   ${i + 1}. ✅ ${post.title}`)
        } else {
          console.log(`   ${i + 1}. ❌ ${post.title}: ${post.error}`)
        }
      })
    }).catch((error) => {
      console.error('❌ Seeding error:', error)
    })

    // Return immediately
    return NextResponse.json({
      success: true,
      message: `Đang tạo ${count} bài viết trong background. Kiểm tra logs hoặc /blog sau vài phút.`,
      status: 'processing',
      count,
      timestamp: new Date().toISOString(),
      note: 'Generation đang chạy trong background. Mỗi bài mất ~3-5 phút. Tổng cộng ~10-15 phút cho 3 bài.',
    })
  } catch (error) {
    console.error('Error starting blog post seeding:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Không thể bắt đầu tạo bài viết seed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

