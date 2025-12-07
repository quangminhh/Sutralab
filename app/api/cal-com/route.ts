import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Cal.com booking validation schema
const bookingSchema = z.object({
  startTime: z.string().datetime('Thời gian không hợp lệ'),
  attendeeEmail: z.string().email('Email không hợp lệ'),
  attendeeName: z.string().min(1, 'Tên là bắt buộc'),
  eventTypeId: z.string().optional(), // Optional, can use default from Cal.com
  timeZone: z.string().optional(), // Optional, defaults to UTC
  language: z.string().optional(), // Optional, defaults to 'en'
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = bookingSchema.parse(body)
    
    const apiKey = process.env.CAL_COM_API_KEY
    
    if (!apiKey) {
      console.error('CAL_COM_API_KEY is not set')
      return NextResponse.json(
        { 
          success: false, 
          message: 'Cấu hình hệ thống chưa hoàn tất. Vui lòng liên hệ trực tiếp.' 
        },
        { status: 500 }
      )
    }
    
    // Prepare Cal.com API request
    // Note: Cal.com API v1 requires eventTypeId
    // First, try to get eventTypeId from request, then from env variable
    const eventTypeId = validatedData.eventTypeId || process.env.CAL_COM_EVENT_TYPE_ID
    
    // If no eventTypeId provided, try to fetch available event types first
    if (!eventTypeId) {
      console.log('No eventTypeId provided, attempting to fetch event types...')
      
      // Try to get first available event type
      try {
        // Cal.com API v1 can use apiKey in query param or Authorization header
        // Try both methods for compatibility
        const eventTypesResponse = await fetch(`https://api.cal.com/v1/event-types?apiKey=${apiKey}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
        })
        
        if (eventTypesResponse.ok) {
          const eventTypesData = await eventTypesResponse.json()
          console.log('Event types response structure:', JSON.stringify(eventTypesData, null, 2))
          
          // Try different response structures
          let firstEventType = null
          if (Array.isArray(eventTypesData.event_types)) {
            firstEventType = eventTypesData.event_types[0]
          } else if (Array.isArray(eventTypesData)) {
            firstEventType = eventTypesData[0]
          } else if (eventTypesData.event_types && Array.isArray(eventTypesData.event_types)) {
            firstEventType = eventTypesData.event_types[0]
          } else if (eventTypesData.data && Array.isArray(eventTypesData.data)) {
            firstEventType = eventTypesData.data[0]
          }
          
          if (firstEventType?.id) {
            console.log('✅ Found event type:', {
              id: firstEventType.id,
              title: firstEventType.title,
              slug: firstEventType.slug,
            })
            // Use the first event type found
            const calComPayload = {
              eventTypeId: firstEventType.id,
              start: validatedData.startTime,
              responses: {
                email: validatedData.attendeeEmail,
                name: validatedData.attendeeName,
              },
              timeZone: validatedData.timeZone || 'Asia/Ho_Chi_Minh', // Vietnam timezone (GMT+7)
              language: validatedData.language || 'vi', // Vietnamese language
              metadata: {}, // Required by Cal.com API v1 - can be empty object
            }
            
            return await createBooking(apiKey, calComPayload)
          } else {
            console.error('❌ No event type found in response. Response structure:', {
              hasEventTypes: !!eventTypesData.event_types,
              eventTypesLength: eventTypesData.event_types?.length,
              isArray: Array.isArray(eventTypesData),
              firstItem: eventTypesData[0],
            })
          }
        } else {
          const errorText = await eventTypesResponse.text().catch(() => '')
          console.error('Failed to fetch event types:', {
            status: eventTypesResponse.status,
            statusText: eventTypesResponse.statusText,
            errorText,
          })
        }
      } catch (fetchError) {
        console.error('Error fetching event types:', fetchError)
      }
      
      // If we couldn't get event types, return error with helpful message
      return NextResponse.json(
        { 
          success: false, 
          message: 'Cần cấu hình eventTypeId. Vui lòng thêm CAL_COM_EVENT_TYPE_ID vào .env.local hoặc liên hệ quản trị viên.',
          hint: 'Để lấy eventTypeId: 1) Vào Cal.com dashboard > Event Types, hoặc 2) Gọi API GET /v1/event-types với API key của bạn. Xem ENV_SETUP.md để biết thêm chi tiết.'
        },
        { status: 400 }
      )
    }
    
    const calComPayload = {
      eventTypeId: eventTypeId,
      start: validatedData.startTime,
      responses: {
        email: validatedData.attendeeEmail,
        name: validatedData.attendeeName,
      },
      timeZone: validatedData.timeZone || 'Asia/Ho_Chi_Minh', // Vietnam timezone (GMT+7)
      language: validatedData.language || 'vi', // Vietnamese language
      metadata: {}, // Required by Cal.com API v1 - can be empty object
    }
    
    return await createBooking(apiKey, calComPayload)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Dữ liệu không hợp lệ', 
          errors: error.errors 
        },
        { status: 400 }
      )
    }
    
    console.error('Cal.com booking error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Đã có lỗi xảy ra. Vui lòng thử lại sau.' 
      },
      { status: 500 }
    )
  }
}

/**
 * Helper function to create a booking with Cal.com API
 * @param apiKey - Cal.com API key
 * @param payload - Booking payload with eventTypeId, start time, and attendee info
 */
async function createBooking(apiKey: string, payload: {
  eventTypeId: string | number
  start: string
  responses: {
    email: string
    name: string
  }
  timeZone?: string
  language?: string
  metadata?: Record<string, unknown> // Required by Cal.com API v1
}) {
  // Cal.com API v1 requires apiKey in query parameter for all requests (GET and POST)
  const response = await fetch(`https://api.cal.com/v1/bookings?apiKey=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  })
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    const errorText = await response.text().catch(() => '')
    console.error('Cal.com API error:', {
      status: response.status,
      statusText: response.statusText,
      errorData,
      errorText,
    })
    
    // Provide more detailed error message
    let errorMessage = 'Không thể đặt lịch. Vui lòng thử lại sau hoặc liên hệ trực tiếp.'
    if (errorData?.message) {
      errorMessage = errorData.message
    } else if (errorText && typeof errorText === 'string') {
      errorMessage = errorText
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: errorMessage,
        error: errorData,
      },
      { status: response.status }
    )
  }
  
  const responseData = await response.json()
  
  // Cal.com API v1 returns booking data in a 'booking' object
  const bookingData = responseData.booking || responseData
  
  // Extract Google Meet link from booking response
  // Cal.com automatically includes video conferencing links
  const meetUrl = bookingData.location?.url || 
                 bookingData.metadata?.videoCallUrl || 
                 bookingData.videoCallUrl ||
                 (bookingData.responses?.location?.value && bookingData.responses.location.value.startsWith('http') ? bookingData.responses.location.value : null)
  
  return NextResponse.json(
    { 
      success: true, 
      message: 'Đặt lịch thành công!',
      booking: {
        id: bookingData.id,
        startTime: bookingData.startTime,
        meetUrl: meetUrl,
      }
    },
    { status: 200 }
  )
}

