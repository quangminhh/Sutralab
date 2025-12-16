/**
 * Single Blog Post API Route
 * GET: Get post by slug
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPostBySlug } from '@/lib/blog/posts'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const post = await getPostBySlug(params.slug)

    if (!post) {
      return NextResponse.json(
        {
          success: false,
          message: 'Không tìm thấy bài viết',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      post,
    })
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Không thể lấy bài viết',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

