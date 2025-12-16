/**
 * Individual Blog Post Page
 * Displays a single blog post with full content
 */

import { getPostBySlug } from '@/lib/blog/posts'
import { markdownToHtml } from '@/lib/blog/markdown'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import Header from '@/components/header'
import Footer from '@/components/footer'
import Link from 'next/link'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {
      title: 'Post Not Found - Sutralab',
    }
  }

  return {
    title: `${post.title} - Blog Sutralab`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.imageUrl],
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const htmlContent = await markdownToHtml(post.content)

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-1 pt-20">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back Button */}
          <Link
            href="/blog"
            className="inline-flex items-center text-teal-600 hover:text-teal-700 mb-8"
          >
            ← Quay lại Blog
          </Link>

          {/* Header Image */}
          <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
            <Image
              src={post.imageUrl || '/blog/images/placeholder.jpg'}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Post Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              {post.publishedAt && (
                <span className="text-sm text-gray-500">
                  {format(new Date(post.publishedAt), 'dd MMMM, yyyy', { locale: vi })}
                </span>
              )}
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">{post.author}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-xl text-gray-600 mb-6">{post.excerpt}</p>
            )}

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-sm bg-teal-100 text-teal-700 px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Post Content */}
          <div
            className="prose prose-lg max-w-none
              prose-headings:text-gray-900
              prose-p:text-gray-700
              prose-a:text-teal-600
              prose-strong:text-gray-900
              prose-code:text-teal-700
              prose-pre:bg-gray-900
              prose-pre:text-gray-100
              prose-img:rounded-lg
              prose-img:shadow-md"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          {/* Source Attribution */}
          {post.apifySourceUrl && (
            <div className="mt-12 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Nguồn tham khảo:</strong>{' '}
                <a
                  href={post.apifySourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:underline"
                >
                  {post.apifySourceUrl}
                </a>
              </p>
            </div>
          )}
        </article>
      </main>
      <Footer />
    </div>
  )
}

