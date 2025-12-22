/**
 * Seed Initial Blog Posts Script
 * Generates 3 initial blog posts using the existing AI generation pipeline
 * Run once after deployment to populate the blog with initial content
 */

import { generateMultiplePosts } from '../lib/ai/content-generator'

async function seedInitialPosts() {
  console.log('\n🌱 Starting initial blog post seeding...\n')
  
  try {
    // Check API keys
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      console.error('❌ ERROR: GOOGLE_GEMINI_API_KEY is not set')
      process.exit(1)
    }

    console.log('📝 Generating 3 initial blog posts...\n')
    
    const result = await generateMultiplePosts({
      count: 3,
      useDeepThink: false, // Use regular model for faster generation
      useApifyImages: true, // Use Apify images to save costs
    })

    console.log('\n' + '='.repeat(60))
    console.log('✅ Seeding completed!')
    console.log('='.repeat(60))
    console.log(`📊 Results:`)
    console.log(`   - Success: ${result.success} posts`)
    console.log(`   - Failed: ${result.failed} posts`)
    console.log('\n📋 Generated posts:')
    
    result.posts.forEach((post, index) => {
      if (post.success) {
        console.log(`   ${index + 1}. ✅ ${post.title} (${post.slug})`)
      } else {
        console.log(`   ${index + 1}. ❌ Failed: ${post.error || 'Unknown error'}`)
      }
    })
    
    console.log('\n🎉 Initial blog posts seeded successfully!')
    console.log('   Visit /blog to see the posts.\n')
    
    process.exit(result.failed > 0 ? 1 : 0)
  } catch (error) {
    console.error('\n❌ Error seeding blog posts:', error)
    process.exit(1)
  }
}

// Run the seeding
seedInitialPosts()

