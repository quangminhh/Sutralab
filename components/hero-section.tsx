"use client"

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Pacifico } from "next/font/google"
import { cn } from "@/lib/utils"
import { IsometricOfficeVisual } from "@/components/isometric-office-visual"

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pacifico",
})

/**
 * Hero Section - Tuyên ngôn giá trị mới
 * Định vị: Đối tác chiến lược về Tối ưu hóa Vận hành & Chuyển đổi số
 */
export function HeroSection() {
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 })
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const devicePixelRatio = window.devicePixelRatio || 1
      
      // Responsive sizing based on viewport and zoom
      const responsiveWidth = Math.max(width * 1.2, 1200) // 20% buffer, min 1200px
      const responsiveHeight = Math.max(height * 1.2, 800) // 20% buffer, min 800px
      
      setDimensions({
        width: responsiveWidth,
        height: responsiveHeight,
      })
      
      // Check if mobile for background attachment optimization
      setIsMobile(width < 1024)
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    window.addEventListener("orientationchange", updateDimensions)
    
    return () => {
      window.removeEventListener("resize", updateDimensions)
      window.removeEventListener("orientationchange", updateDimensions)
    }
  }, [])

  return (
    <section className="w-full min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        minHeight: '100dvh', // Dynamic viewport height for mobile
        background: `
          radial-gradient(circle at 20% 50%, rgba(34, 211, 238, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(14, 165, 233, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 40% 80%, rgba(6, 182, 212, 0.3) 0%, transparent 50%),
          linear-gradient(135deg, #06b6d4 0%, #0ea5e9 25%, #22d3ee 50%, #38bdf8 75%, #0284c7 100%)
        `,
        backgroundSize: '100% 100%',
        // Use 'scroll' on mobile for better performance, 'fixed' on desktop
        backgroundAttachment: isMobile ? 'scroll' : 'fixed',
      }}>
      
      {/* Additional animated overlay for depth */}
      <div className="absolute inset-0 w-full h-full opacity-30"
        style={{
          background: `
            radial-gradient(circle at 60% 30%, rgba(56, 189, 248, 0.4) 0%, transparent 40%),
            radial-gradient(circle at 30% 70%, rgba(34, 211, 238, 0.4) 0%, transparent 40%)
          `,
          animation: 'float 6s ease-in-out infinite',
        }}>
      </div>
      
      {/* Text contrast overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-cyan-900/10"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full relative z-10 py-12 sm:py-16 md:py-20">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 xl:gap-20 items-center">
          {/* Left: Text Content */}
          <div className="text-left space-y-6 sm:space-y-8 flex flex-col justify-center lg:-translate-x-6 xl:-translate-x-8">
            {/* Headline */}
            <h1 className="font-bold text-balance text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[1.1] tracking-tight drop-shadow-lg">
              <span className="text-white drop-shadow-2xl">Xây Dựng Hệ Thống</span>
              <br />
              <span className={cn(
                "text-white",
                pacifico.className,
              )}
              style={{
                // Simple, clean text shadow
                textShadow: `
                  0 0 8px rgba(34, 211, 238, 0.4),
                  0 2px 4px rgba(0, 0, 0, 0.3)
                `,
                // Clean text stroke
                WebkitTextStroke: '1px rgba(34, 211, 238, 0.3)',
                letterSpacing: '0.08em',
                wordSpacing: '0.15em',
                lineHeight: '1.2',
                fontFeatureSettings: '"kern" 1',
                textRendering: 'optimizeLegibility',
              }}>
                AI Cho Doanh Nghiệp
              </span>
            </h1>
            
            {/* Sub-headline */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed font-medium tracking-wide max-w-2xl drop-shadow-lg">
              Cắt Giảm Chi Phí Nhân Sự, Tối Ưu Hóa Lợi Nhuận Và Thời Gian.
            </p>

            {/* Strategic Introduction - Glassmorphism */}
            <div className="bg-white/95 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-white/50 shadow-2xl ring-1 ring-white/20">
              <p className="text-sm sm:text-base md:text-lg text-[#1a1a1a] leading-relaxed font-medium">
                Chúng tôi rà soát và xây dựng hệ thống AI để thay thế các điểm nghẽn thủ công. Ví dụ: tự động hóa luồng giấy tờ, báo cáo, marketing, CSKH hay đối soát công nợ. Mục tiêu của chúng tôi là giúp các doanh nghiệp tối ưu hóa thời gian xử lý từ vài ngày xuống vài phút, và quan trọng nhất là loại bỏ lỗi con người.{" "}
                <span className="font-bold text-teal-700 bg-teal-50 px-2 py-1 rounded-md inline-block mt-2 sm:mt-0">
                  Chúng tôi không bán phần mềm, chúng tôi bán một dây chuyền vận hành tự động.
                </span>
              </p>
            </div>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2 sm:pt-4">
              <Button
                size="lg"
                className="px-6 sm:px-8 md:px-10 py-5 sm:py-6 md:py-7 rounded-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:from-teal-700 hover:to-cyan-700 hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-teal-500/50 text-sm sm:text-base md:text-lg font-bold tracking-wide ring-2 ring-white/20 w-full sm:w-auto"
              >
                <span className="text-center">Đặt Lịch Khảo Sát Doanh Nghiệp</span>
                <span className="block sm:inline sm:ml-1 text-xs sm:text-base">(Miễn Phí)</span>
              </Button>
            </div>
          </div>

          {/* Right: Isometric video with glass frame */}
          <div className="hidden lg:flex items-center justify-center w-full translate-x-48 lg:translate-x-52 xl:translate-x-56 2xl:translate-x-60">
            <div className="w-full flex items-center justify-center">
                <IsometricOfficeVisual />
            </div>
          </div>
        </div>

        {/* Mobile: video below content */}
        <div className="lg:hidden mt-8 sm:mt-12">
          <IsometricOfficeVisual />
        </div>
      </div>
    </section>
  )
}
