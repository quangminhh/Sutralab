import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Cal.com booking validation schema
const bookingSchema = z.object({
  startTime: z.string().datetime('Thời gian không hợp lệ'),
  attendeeEmail: z.string().email('Email không hợp lệ'),
  attendeeName: z.string().min(1, 'Tên là bắt buộc'),
  eventTypeId: z.string().optional(), // Optional, can use default from Cal.com
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
    // Note: Cal.com API v1 endpoint structure
    const calComPayload = {
      eventTypeId: validatedData.eventTypeId || undefined, // Use default if not provided
      start: validatedData.startTime,
      responses: {
        email: validatedData.attendeeEmail,
        name: validatedData.attendeeName,
      },
    }
    
    // Call Cal.com API
    const response = await fetch('https://api.cal.com/v1/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(calComPayload),
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Cal.com API error:', errorData)
      
      return NextResponse.json(
        { 
          success: false, 
          message: 'Không thể đặt lịch. Vui lòng thử lại sau hoặc liên hệ trực tiếp.' 
        },
        { status: response.status }
      )
    }
    
    const bookingData = await response.json()
    
    // Extract Google Meet link from booking response
    // Cal.com automatically includes video conferencing links
    const meetUrl = bookingData.location?.url || 
                   bookingData.metadata?.videoCallUrl || 
                   bookingData.videoCallUrl
    
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

