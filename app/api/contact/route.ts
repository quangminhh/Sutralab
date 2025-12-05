import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Contact form validation schema
const contactSchema = z.object({
  name: z.string().min(1, 'Tên là bắt buộc'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().optional(),
  message: z.string().min(1, 'Tin nhắn là bắt buộc'),
  projectType: z.array(z.string()).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = contactSchema.parse(body)
    
    // TODO: Send email notification using Resend or similar service
    // For now, just log the submission
    console.log('Contact form submission:', validatedData)
    
    // TODO: In production, send email here
    // Example with Resend:
    // await resend.emails.send({
    //   from: 'contact@aisutralab.com',
    //   to: 'minhtq@aisutralab.com',
    //   subject: `New Contact Form Submission from ${validatedData.name}`,
    //   html: formatContactEmail(validatedData),
    // })
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Cảm ơn bạn! Chúng tôi sẽ liên hệ lại sớm.' 
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
    
    console.error('Contact form error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Đã có lỗi xảy ra. Vui lòng thử lại sau.' 
      },
      { status: 500 }
    )
  }
}

