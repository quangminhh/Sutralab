/**
 * Seed Initial Blog Posts API Route
 * POST: Generate 3 initial blog posts using the existing AI generation pipeline
 * This is a one-time seeding endpoint to populate the blog with initial content
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

    console.log('🌱 Starting initial blog post seeding...')
    
    const result = await generateMultiplePosts({
      count: 3,
      useDeepThink: false, // Use regular model for faster generation
      useApifyImages: true, // Use Apify images to save costs
    })

    return NextResponse.json({
      success: result.failed === 0,
      message: `Đã tạo ${result.success} bài viết thành công, ${result.failed} bài viết thất bại`,
      result,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error seeding blog posts:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Không thể tạo bài viết seed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

