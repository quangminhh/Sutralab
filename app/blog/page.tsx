/**
 * Blog Listing Page
 * Displays all published blog posts
 */

import { getAllPosts } from '@/lib/blog/posts'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import Header from '@/components/header'
import Footer from '@/components/footer'

export const metadata = {
  title: 'Blog - Sutralab',
  description: 'Các bài viết về AI, tự động hóa và công nghệ từ Sutralab',
}

export default async function BlogPage() {
  const posts = await getAllPosts(true) // Only published posts

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-1 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Blog Sutralab
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Khám phá các bài viết về AI, tự động hóa và công nghệ mới nhất
            </p>
          </div>

          {/* Posts Grid */}
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Chưa có bài viết nào.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative w-full h-48 bg-gray-200">
                    <Image
                      src={post.imageUrl || '/blog/images/placeholder.jpg'}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      {post.publishedAt && (
                        <span className="text-xs text-gray-500">
                          {format(new Date(post.publishedAt), 'dd MMMM, yyyy', { locale: vi })}
                        </span>
                      )}
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
                      {post.title}
                    </h2>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>

                    {/* Hidden tags on list view to avoid noisy tiny labels */}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

