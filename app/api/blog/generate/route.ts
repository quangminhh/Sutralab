/**
 * Manual Blog Post Generation API Route
 * POST: Trigger content generation manually
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { generatePostFromContent, generateMultiplePosts } from '@/lib/ai/content-generator'

const generateSchema = z.object({
  topic: z.string().optional(),
  count: z.number().min(1).max(10).optional(),
  useDeepThink: z.boolean().optional(),
  useApifyImages: z.boolean().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = generateSchema.parse(body)

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

    // Generate single post or multiple posts
    if (validatedData.topic) {
      // Generate single post
      const result = await generatePostFromContent(validatedData.topic, {
        useDeepThink: validatedData.useDeepThink,
        useApifyImages: validatedData.useApifyImages,
      })

      if (result.success) {
        return NextResponse.json({
          success: true,
          message: 'Tạo bài viết thành công',
          post: result.post,
        })
      } else {
        return NextResponse.json(
          {
            success: false,
            message: 'Không thể tạo bài viết',
            error: result.error,
          },
          { status: 500 }
        )
      }
    } else {
      // Generate multiple posts
      const result = await generateMultiplePosts({
        count: validatedData.count || 3,
        useDeepThink: validatedData.useDeepThink,
        useApifyImages: validatedData.useApifyImages,
      })

      return NextResponse.json({
        success: true,
        message: `Đã tạo ${result.success} bài viết thành công, ${result.failed} bài viết thất bại`,
        result,
      })
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Dữ liệu không hợp lệ',
          errors: error.errors,
        },
        { status: 400 }
      )
    }

    console.error('Error generating post:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Không thể tạo bài viết',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

