import Header from "@/components/header"
import Footer from "@/components/footer"
import { FloatingChatButtons } from "@/components/floating-chat-buttons"
import { ContactSection } from "@/components/contact-section"
import { CalendarBooking } from "@/components/calendar-booking"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Phone, MessageSquare } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-400">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Liên Hệ Với Chúng Tôi
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              Sẵn sàng chuyển đổi doanh nghiệp của bạn? Hãy để chúng tôi giúp bạn bắt đầu ngay hôm nay.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section - Using ContactSection Component */}
      <div className="mb-16">
        <ContactSection
          title="Chúng tôi có thể biến dự án mơ ước của bạn thành hiện thực"
          mainMessage="Hãy trò chuyện với chúng tôi! 👋"
          contactEmail="minhtq@aisutralab.com"
        />
      </div>

      {/* Calendar Booking Section */}
      <div className="max-w-4xl mx-auto mb-16 px-4">
        <CalendarBooking />
      </div>

      {/* Contact Information */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 hover:shadow-xl transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-6">
                    <Phone className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">Điện Thoại</h3>
                  <a href="tel:+84923370804" className="text-blue-600 hover:text-blue-700 text-lg font-semibold block mb-2">
                    +84 923 370 804
                  </a>
                  <a href="tel:+84386602022" className="text-blue-600 hover:text-blue-700 text-lg font-semibold block">
                    +84 386 602 022
                  </a>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200 hover:shadow-xl transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-cyan-600 flex items-center justify-center mx-auto mb-6">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">Email</h3>
                  <a href="mailto:minhtq@aisutralab.com" className="text-cyan-600 hover:text-cyan-700 text-lg font-semibold">
                    minhtq@aisutralab.com
                  </a>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-sky-50 border-sky-200 hover:shadow-xl transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-sky-600 flex items-center justify-center mx-auto mb-6">
                    <MessageSquare className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">Nhắn Tin</h3>
                  <div className="flex gap-4 justify-center">
                    <a href="https://zalo.me/0923370804" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:text-sky-700 font-semibold">
                      Zalo
                    </a>
                    <span className="text-gray-300">|</span>
                    <a href="https://wa.me/84923370804" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:text-sky-700 font-semibold">
                      WhatsApp
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      
      {/* Floating Contact Buttons */}
      <FloatingChatButtons />
    </div>
  )
}

