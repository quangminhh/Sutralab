"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'

export default function SeedBlogPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    result?: any
  } | null>(null)

  const handleSeed = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/blog/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Lỗi không xác định',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Seed Blog Posts</CardTitle>
            <CardDescription>
              Tạo 3 bài blog ban đầu sử dụng hệ thống AI generation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleSeed}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang tạo blog posts... (có thể mất 10-15 phút)
                </>
              ) : (
                'Tạo 3 Bài Blog'
              )}
            </Button>

            {result && (
              <div
                className={`p-4 rounded-lg ${
                  result.success
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  {result.success ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p
                      className={`font-medium ${
                        result.success ? 'text-green-900' : 'text-red-900'
                      }`}
                    >
                      {result.message}
                    </p>
                    {result.result && (
                      <div className="mt-2 text-sm text-gray-700">
                        <p>
                          ✅ Thành công: {result.result.success} bài
                        </p>
                        <p>
                          ❌ Thất bại: {result.result.failed} bài
                        </p>
                        {result.result.posts && result.result.posts.length > 0 && (
                          <div className="mt-2">
                            <p className="font-medium">Chi tiết:</p>
                            <ul className="list-disc list-inside space-y-1">
                              {result.result.posts.map((post: any, idx: number) => (
                                <li key={idx}>
                                  {post.success ? (
                                    <span className="text-green-700">
                                      ✅ {post.title} ({post.slug})
                                    </span>
                                  ) : (
                                    <span className="text-red-700">
                                      ❌ {post.title || 'Unknown'}: {post.error}
                                    </span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="text-sm text-gray-500 space-y-1 pt-4 border-t">
              <p>📝 Lưu ý:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Quá trình này có thể mất 10-15 phút</li>
                <li>Mỗi bài blog sẽ được generate với AI (Gemini), ảnh từ Unsplash, và video từ Apify</li>
                <li>Bạn có thể đóng tab này và quay lại sau để kiểm tra kết quả</li>
                <li>Sau khi tạo xong, kiểm tra tại <a href="/blog" className="text-blue-600 hover:underline">/blog</a></li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

