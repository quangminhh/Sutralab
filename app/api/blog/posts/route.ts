/**
 * Blog Posts API Route
 * GET: List all posts
 * POST: Create a new post
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getAllPosts, createPost } from '@/lib/blog/posts'

const createPostSchema = z.object({
  title: z.string().min(1, 'Tiêu đề là bắt buộc'),
  content: z.string().min(1, 'Nội dung là bắt buộc'),
  excerpt: z.string().optional(),
  author: z.string().optional(),
  source: z.enum(['gemini', 'apify', 'manual']).optional(),
  tags: z.array(z.string()).optional(),
  imageUrl: z.string().optional(),
  imageSource: z.enum(['apify', 'gemini', 'manual']).optional(),
  published: z.boolean().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const publishedOnly = searchParams.get('published') !== 'false'

    const posts = await getAllPosts(publishedOnly)

    return NextResponse.json({
      success: true,
      posts,
      count: posts.length,
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Không thể lấy danh sách bài viết',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createPostSchema.parse(body)

    const post = await createPost(validatedData)

    return NextResponse.json(
      {
        success: true,
        message: 'Tạo bài viết thành công',
        post,
      },
      { status: 201 }
    )
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

    console.error('Error creating post:', error)
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

