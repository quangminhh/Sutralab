import { createClient } from '@supabase/supabase-js'

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase envs')
    process.exit(1)
  }

  const titlesToDelete = new Set<string>([
    'AI Automation Trends 2025',
    'Nâng Tầm Dự Án Học Máy Của Bạn: Những Thực Tiễn Tốt Nhất Không Thể Bỏ Qua',
    'AI Tạo Sinh: Đòn Bẩy Chuyển Đổi Doanh Nghiệp Thời Đại Mới',
    'AI Automation in Business',
    'Computer Vision AI 2025',
    'Deep Learning for Natural Language Processing',
    'AI Automation Testing',
    'Robotics AI 2025',
    'Machine Learning 2025',
    'Quantum Computing AI Future',
    'Neural Networks Healthcare 2025',
    'Autonomous Vehicles Safety Tech',
    'GPT-5 AI Predictions 2025',
    'Edge Computing AI Systems',
    'Generative AI Applications 2025',
    'AI Ethics và Responsible AI',
    'AI trong Healthcare và Medical Imaging',
    'Tự Động Hóa AI Trong Doanh Nghiệp: Chìa Khóa Mở Khóa Hiệu Suất Vượt Trội',
    'Test Post - 2025-12-13T05:17:52.387Z',
  ])

  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  const { data, error } = await supabase
    .from('posts')
    .select('id,title,slug')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching posts:', error)
    process.exit(1)
  }

  const toDelete = (data || []).filter(p => titlesToDelete.has(p.title))

  if (!toDelete.length) {
    console.log('No matching posts to delete.')
    return
  }

  console.log('Deleting posts:', toDelete.map(p => p.title))

  const { error: delError } = await supabase
    .from('posts')
    .delete()
    .in('id', toDelete.map(p => p.id))

  if (delError) {
    console.error('Delete error:', delError)
    process.exit(1)
  }

  console.log(`Deleted ${toDelete.length} posts successfully.`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
