# Environment Variables Setup Guide

## Required Variables

### 1. Cal.com API Key (Required for booking functionality)

**Cách lấy Cal.com API Key:**

1. Đăng nhập vào tài khoản Cal.com của bạn tại [cal.com](https://cal.com)
2. Click vào avatar/profile ở góc trên bên phải
3. Chọn **"Settings"** hoặc **"My Settings"**
4. Cuộn xuống phần **"Developer"** hoặc **"API"**
5. Click vào **"API Keys"** hoặc **"Create API Key"**
6. Đặt tên cho API key (ví dụ: "Sutralab Website")
7. Chọn quyền (permissions) - cần ít nhất quyền tạo booking
8. Click **"Create"** hoặc **"Save"**
9. **QUAN TRỌNG**: Copy API key ngay lập tức vì bạn sẽ không thể xem lại sau này!

**Thêm vào `.env.local`:**
```env
CAL_COM_API_KEY=cal_live_xxxxxxxxxxxxxxxxxxxxx
```

**Lưu ý:**
- API key bắt đầu với `cal_live_` (production) hoặc `cal_test_` (test)
- Không chia sẻ API key trong code hoặc commit lên Git
- Thêm `.env.local` vào `.gitignore` (đã có sẵn)

---

## Optional Variables

### 2. Email Service (Optional - for contact form notifications)

Hiện tại contact form chỉ log ra console. Nếu muốn gửi email thông báo khi có form submission, bạn cần setup một trong các service sau:

#### Option A: Resend (Khuyến nghị - Dễ setup nhất)

1. Đăng ký tại [resend.com](https://resend.com)
2. Tạo API key từ dashboard
3. Thêm vào `.env.local`:
```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
CONTACT_EMAIL=minhtq@aisutralab.com
```

#### Option B: SendGrid

1. Đăng ký tại [sendgrid.com](https://sendgrid.com)
2. Tạo API key từ Settings > API Keys
3. Thêm vào `.env.local`:
```env
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
CONTACT_EMAIL=minhtq@aisutralab.com
```

#### Option C: Nodemailer (SMTP - Gmail, Outlook, etc.)

1. Tạo App Password cho email của bạn
2. Thêm vào `.env.local`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
CONTACT_EMAIL=minhtq@aisutralab.com
```

**Lưu ý:** Sau khi setup email service, cần update code trong `app/api/contact/route.ts` để thực sự gửi email.

---

## Setup Steps

1. **Copy file example:**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Thêm Cal.com API Key:**
   - Lấy API key từ Cal.com (theo hướng dẫn trên)
   - Mở `.env.local` và thay `your_cal_com_api_key_here` bằng API key thực

3. **Optional - Setup Email Service:**
   - Chọn một email service (Resend khuyến nghị)
   - Thêm API key tương ứng vào `.env.local`
   - Uncomment các dòng liên quan

4. **Restart dev server:**
   ```bash
   pnpm dev
   ```

---

## Verification

Sau khi setup, test các tính năng:

1. **Cal.com Booking:**
   - Chọn ngày và giờ trong calendar
   - Điền email và tên trong form
   - Click "Xác nhận đặt lịch"
   - Kiểm tra xem có tạo booking trong Cal.com dashboard không

2. **Contact Form:**
   - Điền và submit form
   - Kiểm tra console log (nếu chưa setup email)
   - Hoặc kiểm tra email inbox (nếu đã setup email service)

---

## Troubleshooting

### Cal.com API không hoạt động:
- Kiểm tra API key có đúng format không (bắt đầu với `cal_live_` hoặc `cal_test_`)
- Kiểm tra API key có quyền tạo booking không
- Kiểm tra Event Type ID trong Cal.com (nếu dùng custom event type)

### Email không gửi được:
- Kiểm tra API key có đúng không
- Kiểm tra domain đã verify chưa (với Resend/SendGrid)
- Kiểm tra spam folder
- Xem logs trong server console

---

## Security Notes

- ⚠️ **KHÔNG** commit `.env.local` lên Git
- ⚠️ **KHÔNG** chia sẻ API keys trong code hoặc public
- ✅ Thêm `.env.local` vào `.gitignore` (đã có sẵn)
- ✅ Sử dụng environment variables trong production (Vercel, Netlify, etc.)

