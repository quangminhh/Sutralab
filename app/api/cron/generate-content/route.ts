/**
 * Cron Job Endpoint for Daily Content Generation
 * This endpoint is called by Vercel Cron Jobs daily
 */

import { NextRequest, NextResponse } from 'next/server'
import { generateMultiplePosts } from '@/lib/ai/content-generator'

export async function GET(request: NextRequest) {
  // Verify cron secret (optional but recommended)
  const authHeader = request.headers.get('authorization')
  if (process.env.CRON_SECRET) {
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
        },
        { status: 401 }
      )
    }
  }

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

    // Generate 1 post daily by default (optimal for Apify free tier $5/month)
    const count = parseInt(process.env.DAILY_POST_COUNT || '1', 10)
    const result = await generateMultiplePosts({
      count,
      useDeepThink: false, // Use regular model for daily posts (faster, cheaper)
      useApifyImages: true, // Use Apify images to save costs
    })

    return NextResponse.json({
      success: true,
      message: `Cron job hoàn thành: ${result.success} bài viết thành công, ${result.failed} bài viết thất bại`,
      result,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Lỗi khi chạy cron job',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

