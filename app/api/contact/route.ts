import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Resend } from 'resend'

// Contact form validation schema
const contactSchema = z.object({
  name: z.string().min(1, 'Tên là bắt buộc'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().optional(),
  message: z.string().min(1, 'Tin nhắn là bắt buộc'),
  projectType: z.array(z.string()).optional(),
})

// Format contact email HTML
function formatContactEmail(data: z.infer<typeof contactSchema>): string {
  const projectTypes = data.projectType && data.projectType.length > 0
    ? data.projectType.join(', ')
    : 'Không có'
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #667eea; }
          .value { margin-top: 5px; padding: 10px; background: white; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>📧 New Contact Form Submission</h2>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Tên:</div>
              <div class="value">${data.name}</div>
            </div>
            <div class="field">
              <div class="label">Email:</div>
              <div class="value">${data.email}</div>
            </div>
            ${data.phone ? `
            <div class="field">
              <div class="label">Số điện thoại:</div>
              <div class="value">${data.phone}</div>
            </div>
            ` : ''}
            <div class="field">
              <div class="label">Loại dự án quan tâm:</div>
              <div class="value">${projectTypes}</div>
            </div>
            <div class="field">
              <div class="label">Tin nhắn:</div>
              <div class="value">${data.message.replace(/\n/g, '<br>')}</div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = contactSchema.parse(body)
    
    // Log submission
    console.log('Contact form submission:', validatedData)
    
    // Send email using Resend if API key is configured
    const resendApiKey = process.env.RESEND_API_KEY
    const contactEmail = process.env.CONTACT_EMAIL || 'minhtq@aisutralab.com'
    
    if (resendApiKey && resendApiKey !== 'your_resend_api_key_here') {
      try {
        const resend = new Resend(resendApiKey)
        
        // Get sender email from Resend domain or use default
        // Note: You need to verify a domain in Resend or use their test domain
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
        
        const emailResult = await resend.emails.send({
          from: fromEmail,
          to: contactEmail,
          replyTo: validatedData.email,
          subject: `New Contact Form Submission from ${validatedData.name}`,
          html: formatContactEmail(validatedData),
        })
        
        console.log('Email sent successfully:', emailResult)
      } catch (emailError) {
        // Log email error but don't fail the request
        console.error('Failed to send email:', emailError)
        // Continue to return success to user
      }
    } else {
      console.log('Resend API key not configured, skipping email send')
    }
    
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

