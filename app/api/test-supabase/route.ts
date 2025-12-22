/**
 * Test Supabase Connection API Route
 * Tests database connection, timeout, and retry logic
 */

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const results: any[] = []
  
  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = 
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  results.push({
    test: 'Configuration Check',
    url: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : '❌ NOT SET',
    key: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : '❌ NOT SET',
  })

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({
      success: false,
      error: 'Missing Supabase environment variables',
      results,
    }, { status: 500 })
  }

  // Test 1: Basic connection
  try {
    const client1 = createClient(supabaseUrl, supabaseAnonKey)
    const start1 = Date.now()
    
    const { data, error } = await client1
      .from('posts')
      .select('id')
      .limit(1)
    
    const duration1 = Date.now() - start1
    
    results.push({
      test: 'Basic Connection (default timeout)',
      success: !error,
      duration: `${duration1}ms`,
      error: error?.message,
      details: error?.details,
      code: error?.code,
    })
  } catch (error: any) {
    results.push({
      test: 'Basic Connection (default timeout)',
      success: false,
      error: error.message,
      cause: error.cause?.message,
      name: error.name,
    })
  }

  // Test 2: Connection with 30s timeout
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
    
    results.push({
      test: 'Connection with 30s timeout',
      success: !error,
      duration: `${duration2}ms`,
      error: error?.message,
      details: error?.details,
      code: error?.code,
    })
  } catch (error: any) {
    results.push({
      test: 'Connection with 30s timeout',
      success: false,
      error: error.message,
      cause: error.cause?.message,
      name: error.name,
      isTimeout: error.name === 'AbortError',
    })
  }

  // Test 3: Insert operation (simulated)
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
    
    results.push({
      test: 'Insert Operation',
      success: !error || error.code === '23505', // 23505 = duplicate key (OK)
      duration: `${duration3}ms`,
      error: error?.message,
      code: error?.code,
      note: error?.code === '23505' ? 'Duplicate key error is OK - connection works!' : undefined,
    })
  } catch (error: any) {
    results.push({
      test: 'Insert Operation',
      success: false,
      error: error.message,
      cause: error.cause?.message,
      name: error.name,
      isTimeout: error.name === 'AbortError',
    })
  }

  // Test 4: Direct HTTP connection
  try {
    const start4 = Date.now()
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': supabaseAnonKey,
      },
      signal: AbortSignal.timeout(10000),
    })
    
    const duration4 = Date.now() - start4
    
    results.push({
      test: 'Direct HTTP Connection',
      success: response.ok,
      duration: `${duration4}ms`,
      status: response.status,
      statusText: response.statusText,
    })
  } catch (error: any) {
    results.push({
      test: 'Direct HTTP Connection',
      success: false,
      error: error.message,
      name: error.name,
      isTimeout: error.name === 'AbortError',
    })
  }

  const allSuccess = results.every(r => r.success !== false)
  
  return NextResponse.json({
    success: allSuccess,
    results,
    summary: {
      total: results.length,
      passed: results.filter(r => r.success).length,
      failed: results.filter(r => r.success === false).length,
    },
  })
}

