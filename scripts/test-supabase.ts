/**
 * Test Supabase Connection Script
 * Tests database connection, timeout, and retry logic
 */

import { createClient } from '@supabase/supabase-js'

async function testSupabaseConnection() {
  console.log('\n🔍 Testing Supabase Connection...\n')
  
  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = 
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  console.log('📋 Configuration:')
  console.log(`   URL: ${supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : '❌ NOT SET'}`)
  console.log(`   Key: ${supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : '❌ NOT SET'}`)
  console.log('')

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase environment variables!')
    console.error('   Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY')
    process.exit(1)
  }

  // Test 1: Basic connection with default timeout
  console.log('🧪 Test 1: Basic connection (default timeout)...')
  try {
    const client1 = createClient(supabaseUrl, supabaseAnonKey)
    const start1 = Date.now()
    
    const { data, error } = await client1
      .from('posts')
      .select('id')
      .limit(1)
    
    const duration1 = Date.now() - start1
    
    if (error) {
      console.log(`   ❌ Failed after ${duration1}ms:`, error.message)
    } else {
      console.log(`   ✅ Success! Connected in ${duration1}ms`)
      console.log(`   Data: ${data ? 'Received' : 'No data'}`)
    }
  } catch (error: any) {
    console.log(`   ❌ Exception:`, error.message)
    if (error.cause) {
      console.log(`   Cause:`, error.cause)
    }
  }

  console.log('')

  // Test 2: Connection with increased timeout (30s)
  console.log('🧪 Test 2: Connection with 30s timeout...')
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)
    
    const client2 = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        fetch: (url, options = {}) => {
          return fetch(url, {
            ...options,
            signal: controller.signal,
          }).finally(() => {
            clearTimeout(timeoutId)
          })
        },
      },
    })
    
    const start2 = Date.now()
    const { data, error } = await client2
      .from('posts')
      .select('id')
      .limit(1)
    
    const duration2 = Date.now() - start2
    
    if (error) {
      console.log(`   ❌ Failed after ${duration2}ms:`, error.message)
      if (error.details) {
        console.log(`   Details:`, error.details)
      }
    } else {
      console.log(`   ✅ Success! Connected in ${duration2}ms`)
    }
  } catch (error: any) {
    console.log(`   ❌ Exception:`, error.message)
    if (error.cause) {
      console.log(`   Cause:`, error.cause)
    }
    if (error.stack) {
      console.log(`   Stack:`, error.stack.split('\n').slice(0, 3).join('\n'))
    }
  }

  console.log('')

  // Test 3: Test insert operation (what we actually need)
  console.log('🧪 Test 3: Insert operation (simulated)...')
  try {
    const client3 = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        fetch: (url, options = {}) => {
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 30000)
          
          return fetch(url, {
            ...options,
            signal: controller.signal,
          }).finally(() => {
            clearTimeout(timeoutId)
          })
        },
      },
    })
    
    const start3 = Date.now()
    
    // Try to insert a test post (will fail if slug exists, but that's OK)
    const { data, error } = await client3
      .from('posts')
      .insert({
        slug: `test-connection-${Date.now()}`,
        title: 'Test Connection',
        content: 'This is a test',
        excerpt: 'Test',
        author: 'Test Script',
        source: 'manual',
        published: false,
      })
      .select()
      .single()
    
    const duration3 = Date.now() - start3
    
    if (error) {
      console.log(`   ⚠️  Operation completed in ${duration3}ms`)
      console.log(`   Error (expected if slug exists):`, error.message)
      if (error.code === '23505') {
        console.log(`   ✅ Connection works! (Duplicate key error is OK)`)
      } else {
        console.log(`   Error code:`, error.code)
        console.log(`   Error details:`, error.details)
      }
    } else {
      console.log(`   ✅ Success! Inserted in ${duration3}ms`)
      console.log(`   Post ID:`, data?.id)
    }
  } catch (error: any) {
    console.log(`   ❌ Exception:`, error.message)
    if (error.cause) {
      console.log(`   Cause:`, error.cause)
    }
    if (error.name === 'AbortError') {
      console.log(`   ⚠️  Request timed out after 30 seconds`)
    }
  }

  console.log('')

  // Test 4: Network connectivity check
  console.log('🧪 Test 4: Network connectivity check...')
  try {
    const url = new URL(supabaseUrl)
    const hostname = url.hostname
    
    console.log(`   Checking DNS resolution for: ${hostname}`)
    
    // Try to resolve DNS
    const dns = await import('dns/promises')
    try {
      const addresses = await dns.resolve4(hostname)
      console.log(`   ✅ DNS resolved: ${addresses.join(', ')}`)
    } catch (dnsError: any) {
      console.log(`   ❌ DNS resolution failed:`, dnsError.message)
    }
    
    // Try basic HTTP connection
    console.log(`   Testing HTTP connection to ${hostname}...`)
    const start4 = Date.now()
    
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': supabaseAnonKey,
      },
      signal: AbortSignal.timeout(10000),
    })
    
    const duration4 = Date.now() - start4
    console.log(`   ✅ HTTP connection successful! Status: ${response.status} (${duration4}ms)`)
    
  } catch (error: any) {
    console.log(`   ❌ Network test failed:`, error.message)
    if (error.cause) {
      console.log(`   Cause:`, error.cause)
    }
    if (error.name === 'AbortError') {
      console.log(`   ⚠️  Connection timed out`)
    }
  }

  console.log('\n✅ Testing complete!\n')
}

// Run the test
testSupabaseConnection().catch(console.error)

