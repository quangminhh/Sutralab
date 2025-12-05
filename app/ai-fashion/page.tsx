import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Check, Clock, DollarSign, Sparkles, Users } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"
import HeroGeometric from "@/components/hero-geometric"
import AIFashion3DViewer from "@/components/ai-fashion-3d-viewer-wrapper"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { FloatingChatButtons } from "@/components/floating-chat-buttons"

export default function AIFashionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-400 pt-20">
      <Header />
      {/* Hero Section */}
      <HeroGeometric
        title1="AI FASHION"
        title2="Tạo Sinh Hình Ảnh"
        description="Hệ Thống Tạo Sinh Hình Ảnh"
      />

      {/* Benefits Section - Before & After */}
      <section className="py-20 bg-gradient-to-b from-blue-500 to-blue-600">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
            TRƯỚC VÀ SAU DÙNG AI FASHION
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Speed */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-8 text-white">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-6 mx-auto">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center">TĂNG TỐC ĐỘ (Time-to-Market)</h3>
              <p className="text-lg leading-relaxed">
                Từ ý <span className="font-bold">tưởng đến chiến dịch marketing</span> chỉ trong{" "}
                <span className="font-bold">VÀI GIỜ</span>, không phải{" "}
                <span className="font-bold">VÀI TUẦN</span>.
              </p>
            </Card>

            {/* Cost */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-8 text-white">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-6 mx-auto">
                <DollarSign className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center">TỐI ƯU CHI PHÍ (Cost Efficiency)</h3>
              <p className="text-lg leading-relaxed">
                <span className="font-bold">Giảm đến 90% chi phí</span> sản xuất hình ảnh truyền thống (studio, hậu kỳ, người mẫu).
              </p>
            </Card>

            {/* Personalization */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-8 text-white">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-6 mx-auto">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center">CÁ NHÂN HÓA VÔ HẠN (Infinite Personalization)</h3>
              <p className="text-lg leading-relaxed">
                Tạo <span className="font-bold">1.000 phiên bản</span> quảng cáo{" "}
                <span className="font-bold">cho 1.000 khách hàng</span> mà{" "}
                <span className="font-bold">không tốn thêm chi phí</span>.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-16">
            "NỖI ĐAU" CỦA QUY TRÌNH CŨ
          </h2>

          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  CHI PHÍ "NGỐN" NGÂN SÁCH:
                </h3>
                <p className="text-lg text-gray-700">
                  Chi phí không lồ cho studio, người mẫu, và hậu kỳ cho mỗi chiến dịch.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Ý TƯỞNG "CHỜ" QUY TRÌNH:
                </h3>
                <p className="text-lg text-gray-700">
                  Mất hàng tuần, thậm chí hàng tháng, để đưa một ý tưởng từ thiết kế đến hình ảnh marketing cuối cùng.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">150tr-1 tỷ 5</div>
                  <div className="text-sm text-gray-600">CHI PHÍ RA MẮT MỖI SẢN PHẨM</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">3 - 6 tháng</div>
                  <div className="text-sm text-gray-600">THỜI GIAN RA MẮT THỊ TRƯỜNG</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">15% - 25%</div>
                  <div className="text-sm text-gray-600">TỶ LỆ ĐỔI TRẢ HÀNG</div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Pain Point Image - Larger */}
              <div className="relative">
                <Image
                  src="/AI FASHION/Pain point AIFASHION.png"
                  alt="Pain points of traditional workflow"
                  width={700}
                  height={500}
                  className="rounded-2xl shadow-2xl w-full"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl max-w-[280px]">
                  <p className="text-sm font-bold text-gray-900">CHI PHÍ & THỜI GIAN:</p>
                  <p className="text-sm text-gray-600 mt-2">
                    Quy trình truyền thống tốn kém và mất nhiều thời gian, từ studio đến hậu kỳ
                  </p>
                </div>
              </div>
              
              {/* Mannequin Image - Smaller */}
              <div className="relative max-w-[500px] mx-auto">
                <Image
                  src="/AI FASHION/mannequin.png"
                  alt="Traditional studio workflow - Mannequin"
                  width={500}
                  height={350}
                  className="rounded-2xl shadow-2xl w-full"
                />
                <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-xl max-w-[280px]">
                  <p className="text-sm font-bold text-gray-900">NỘI DUNG "VÔ HÌNH":</p>
                  <p className="text-sm text-gray-600 mt-2">
                    Hình ảnh mẫu sản phẩm chung chung, thất bại trong việc cá nhân hóa
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-16">
            ĐỪNG THUÊ. HÃY SỞ HỮU
          </h2>

          <div className="grid md:grid-cols-3 gap-20 max-w-[4000px] mx-auto items-center">
            <div className="order-2 md:order-1 md:col-span-2">
              <Image
                src="/AI FASHION/Đừng thuê hãy sở hữu.png"
                alt="Đừng thuê hãy sở hữu - AI Fashion"
                width={3200}
                height={4400}
                className="rounded-2xl shadow-2xl mx-auto w-full"
              />
            </div>

            <div className="order-1 md:order-2 md:col-span-1 space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
                  01
                </div>
                <div>
                  <p className="text-lg text-gray-700">
                    Giới thiệu AI FASHION - "Dây Chuyền Sáng Tạo Hình Ảnh" dành riêng cho thương hiệu.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
                  02
                </div>
                <div>
                  <p className="text-lg text-gray-700">
                    Mở ra kỷ nguyên mới của hiệu suất sáng tạo và cá nhân hóa vô hạn.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
                  03
                </div>
                <div>
                  <p className="text-lg text-gray-700">
                    Khắc phục những hạn chế về chi phí, thời gian và sự phụ thuộc vào các quy trình thủ công, đắt đỏ.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-cyan-500">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
            THE FEATURES
          </h2>
          <p className="text-xl text-white/90 text-center mb-16">
            AI FASHION: Các Tính năng Cốt lõi
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 p-8 text-white">
              <div className="text-6xl font-bold mb-6">01</div>
              <h3 className="text-2xl font-bold mb-4">AI PHOTOSHOOT (Studio ảo)</h3>
              <ul className="space-y-3 text-white/90">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 flex-shrink-0 mt-1" />
                  <span>
                    Tự động tạo hình ảnh sản phẩm hoặc lifestyle chuyên nghiệp từ ảnh gốc hoặc file thiết kế 3D.{" "}
                    <span className="font-bold">Không cần studio, không cần người mẫu</span>, chỉ cần khuôn mặt hoặc có thể tạo sinh người mẫu ảo với độ chi tiết cao.
                  </span>
                </li>
              </ul>
            </Card>

            {/* Feature 2 */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 p-8 text-white">
              <div className="text-6xl font-bold mb-6">02</div>
              <h3 className="text-2xl font-bold mb-4">VIRTUAL TRY-ON (Thử đồ ảo)</h3>
              <ul className="space-y-3 text-white/90">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 flex-shrink-0 mt-1" />
                  <span>
                    Cho phép <span className="font-bold">khách hàng "thử"</span> sản phẩm ngay lập tức trên người mẫu ảo hoặc{" "}
                    <span className="font-bold">hình ảnh của chính họ</span>.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 flex-shrink-0 mt-1" />
                  <span>
                    AI <span className="font-bold">tự động tư vấn size</span>, màu khác phù hợp giúp{" "}
                    <span className="font-bold">tăng tỷ lệ chốt hàng</span>
                  </span>
                </li>
              </ul>
            </Card>

            {/* Feature 3 */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 p-8 text-white">
              <div className="text-6xl font-bold mb-6">03</div>
              <h3 className="text-2xl font-bold mb-4">RA MẮT BST MỚI NGAY LẬP TỨC</h3>
              <ul className="space-y-3 text-white/90">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 flex-shrink-0 mt-1" />
                  <span>
                    Từ <span className="font-bold">ảnh sketch sản phẩm, tự động tạo</span> mẫu{" "}
                    <span className="font-bold">2D</span> và <span className="font-bold">3D</span>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 flex-shrink-0 mt-1" />
                  <span>
                    <span className="font-bold">Có thể thay vào mẫu để bán hàng</span> mà không cần đợi sản phẩm hoàn thiện
                  </span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* AI Photoshoot Detail - Enhanced with multiple product examples */}
      <section className="py-20 bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              AI PHOTOSHOOT (Studio ảo)
            </h2>
            <p className="text-xl text-white/90 mb-16">
              Tối ưu tài nguyên (chi phí, thời gian) cho các quy trình studio thủ công, lặp lại.
            </p>

            <div className="mb-16">
              <div className="max-w-5xl mx-auto mb-12">
                <div className="space-y-8 text-white">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-6">
                      Đây là "Nhà Máy Tạo Ảnh" của riêng doanh nghiệp:
                    </h3>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <Sparkles className="w-7 h-7 flex-shrink-0 mt-1 text-yellow-300" />
                      <p className="text-lg md:text-xl leading-relaxed">
                        <span className="font-bold">Sao chép người mẫu ảo</span>, khuôn mặt, và dáng sản phẩm với{" "}
                        <span className="font-bold text-yellow-300">độ chính xác {'>'}98%</span>.{" "}
                        <span className="font-bold">Tạo hàng ngàn biến thể cho mọi kênh</span>
                      </p>
                    </div>

                    <div className="flex items-start gap-4">
                      <Sparkles className="w-7 h-7 flex-shrink-0 mt-1 text-yellow-300" />
                      <p className="text-lg md:text-xl leading-relaxed">
                        <span className="font-bold">Thay đổi chi tiết</span> (hoa văn) hoặc mở rộng{" "}
                        <span className="font-bold text-yellow-300">vô hạn</span> bối cảnh (lifestyle) từ 1 ảnh gốc.
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-400/20 to-yellow-300/20 backdrop-blur-sm rounded-xl p-8 mt-10 border border-yellow-300/30">
                    <p className="text-lg md:text-xl font-bold text-white leading-relaxed">
                      Xây dựng <span className="text-yellow-300">"Lợi thế không công bằng" (Unfair Advantage)</span> bằng cách{" "}
                      <span className="text-yellow-300">sản xuất nội dung ở quy mô</span> mà đối thủ không thể sao chép.
                    </p>
                  </div>
                </div>
              </div>

              {/* Product showcase grid - Studio + Model 2 - Very Large */}
              <div className="grid lg:grid-cols-2 gap-12">
                <div className="space-y-5">
                  <Image
                    src="/AI FASHION/Studio.png"
                    alt="AI Photoshoot - Studio ảo"
                    width={900}
                    height={1200}
                    className="rounded-2xl shadow-2xl w-full h-auto object-cover"
                  />
                  <div className="text-center">
                    <p className="text-white text-xl font-bold mb-2">Studio ảo AI Fashion</p>
                    <p className="text-white/80 text-base">Môi trường studio ảo chuyên nghiệp</p>
                  </div>
                </div>
                <div className="space-y-5">
                  <Image
                    src="/AI FASHION/Model 2.png"
                    alt="AI Photoshoot - Model 2 - Độ chính xác cao"
                    width={900}
                    height={1200}
                    className="rounded-2xl shadow-2xl w-full h-auto object-cover"
                  />
                  <div className="text-center">
                    <p className="text-white text-xl font-bold mb-2">Độ Chính Xác {'>'}98%</p>
                    <p className="text-white/80 text-base">Studio ảo tạo hình ảnh với độ chính xác tuyệt đối, sao chép mọi chi tiết từ người mẫu đến sản phẩm</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Virtual Try-On Detail - Enhanced with gallery of 3 images */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              VIRTUAL TRY-ON – "Trợ Lý Bán Hàng" Cá Nhân 1:1
            </h2>
            <p className="text-xl text-gray-700 mb-12">
              <span className="font-bold">Giải quyết triệt để</span> điểm ma sát lớn nhất trong hành trình khách hàng:{" "}
              <span className="font-bold">sự do dự và tỷ lệ trả hàng</span>.
            </p>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Gallery of 2 large try-on examples */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Khách hàng chỉ cần upload ảnh - Hệ thống tự động ướm thử
                </h3>
                <div className="grid grid-cols-1 gap-8">
                  {/* Ảnh 1: Ướm thử trang phục - Extra Large */}
                  <div className="group relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300">
                    <Image
                      src="/AI FASHION/Khách hàng chỉ cần up mặt lên là hệ thống tự động ướm thử.jpg"
                      alt="Virtual try-on - Ướm thử trang phục"
                      width={800}
                      height={900}
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
                      <p className="text-white text-2xl font-bold">Ướm thử trang phục</p>
                      <p className="text-white/90 text-base mt-2">Upload ảnh và xem kết quả ngay lập tức</p>
                    </div>
                  </div>
                  
                  {/* Ảnh 2: Kết quả chính xác - Extra Large */}
                  <div className="group relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300">
                    <Image
                      src="/AI FASHION/Khách hàng chỉ cần up mặt lên là hệ thống tự động ướm thử 3.png"
                      alt="Virtual try-on - Kết quả chính xác"
                      width={800}
                      height={900}
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
                      <p className="text-white text-2xl font-bold">Kết quả chính xác</p>
                      <p className="text-white/90 text-base mt-2">Độ chính xác cao, tự nhiên như thật</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <ul className="space-y-4 text-gray-700">
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 mt-1 text-sm font-bold">
                      ✓
                    </div>
                    <span className="text-lg">
                      Khách hàng <span className="font-bold">thử sản phẩm</span> ngay{" "}
                      <span className="font-bold">bằng ảnh của chính họ</span>.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 mt-1 text-sm font-bold">
                      ✓
                    </div>
                    <span className="text-lg">
                      AI <span className="font-bold">tự động phân tích</span> và{" "}
                      <span className="font-bold">tư vấn</span> chính xác, loại bỏ phỏng đoán.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 mt-1 text-sm font-bold">
                      ✓
                    </div>
                    <span className="text-lg">
                      <span className="font-bold">Tự động gợi ý phối đồ và phụ kiện</span> tăng giá trị đơn hàng.
                    </span>
                  </li>
                </ul>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 mt-8 border border-blue-100">
                  <p className="text-gray-900 font-bold mb-2 text-lg">
                    Tối đa Tỷ lệ Chuyển đổi, giảm chi phí vận hành, và tăng Giá trị Vòng đời Khách hàng bằng trải nghiệm vượt trội.
                  </p>
                </div>

                {/* Stats highlight */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-white border-2 border-blue-200 rounded-xl p-4 text-center shadow-sm">
                    <div className="text-3xl font-bold text-blue-600 mb-1">-40%</div>
                    <div className="text-sm text-gray-600">Giảm tỷ lệ trả hàng</div>
                  </div>
                  <div className="bg-white border-2 border-blue-200 rounded-xl p-4 text-center shadow-sm">
                    <div className="text-3xl font-bold text-blue-600 mb-1">+25%</div>
                    <div className="text-sm text-gray-600">Tăng tỷ lệ chuyển đổi</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sketch to 3D Detail */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-500">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-12">
              SKETCH - 2D - 3D
            </h2>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 text-white">
                <p className="text-xl">
                  Chấm dứt kỷ nguyên ra quyết định dựa trên phỏng đoán.{" "}
                  <span className="font-bold">Rút ngắn còn 1 tuần kiểm nghiệm thị trường.</span>
                </p>

                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Sparkles className="w-6 h-6 flex-shrink-0 mt-1" />
                    <span className="text-lg">
                      AI <span className="font-bold">chuyển hóa bản phác thảo</span> (sketch){" "}
                      <span className="font-bold">thành mô hình 2D/3D</span> và{" "}
                      <span className="font-bold">hình ảnh quảng cáo hoàn chỉnh</span>.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Sparkles className="w-6 h-6 flex-shrink-0 mt-1" />
                    <span className="text-lg">
                      Tự động mở bán các mẫu "thắng cuộc" để{" "}
                      <span className="font-bold">khách hàng đặt cọc trước</span> khi sản xuất.
                    </span>
                  </li>
                </ul>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mt-8">
                  <p className="font-bold text-lg">
                    Giải phóng 100% dòng tiền, loại bỏ rủi ro sản xuất, và giải phóng nguồn nhân lực khỏi các quy trình lãng phí để tập trung vào các nhiệm vụ chiến lược.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Image
                  src="/AI FASHION/Multiview Dior 1 sketch.png"
                  alt="Sketch to 3D process"
                  width={300}
                  height={400}
                  className="rounded-xl shadow-xl"
                />
                <Image
                  src="/AI FASHION/Multiview Dior 1.png"
                  alt="3D model output"
                  width={300}
                  height={400}
                  className="rounded-xl shadow-xl"
                />
              </div>
            </div>

            {/* 3D Interactive Model - Moved here from separate section */}
            <div className="mt-16">
              <div className="text-center mb-8">
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  TRẢI NGHIỆM MÔ HÌNH 3D TƯƠNG TÁC
                </h3>
                <p className="text-lg text-white/90 max-w-2xl mx-auto">
                  Khám phá sản phẩm từ mọi góc độ với mô hình 3D tương tác. Xoay, phóng to, và tương tác trực tiếp với sản phẩm.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <AIFashion3DViewer />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                DỊCH VỤ THAY THẾ SẢN PHẨM CHO KHÁCH HÀNG
              </h2>
              <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed">
                AI Fashion cung cấp <span className="font-bold text-cyan-400">dịch vụ tạo hình ảnh sản phẩm chuyên nghiệp</span> cho mọi ngành hàng: 
                thời trang, phụ kiện, đồng hồ, túi xách, trang sức, nội thất... 
                <span className="font-bold text-yellow-300">Thay thế hoàn toàn quy trình photoshoot truyền thống</span> với chi phí thấp hơn 90% và thời gian nhanh hơn hàng trăm lần.
              </p>
            </div>

            <div className="mb-12 max-w-4xl mx-auto">
              <div className="group">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 bg-gradient-to-br from-amber-900/30 to-yellow-900/30">
                  <Image
                    src="/AI FASHION/Frederique Constant Manufacture Classic Perpetual Calendar FC-776N3H6.png"
                    alt="Dịch vụ tạo hình ảnh đồng hồ cao cấp - AI Fashion"
                    width={800}
                    height={900}
                    className="w-full h-auto object-contain p-12 group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="mt-6 text-center">
                  <h3 className="text-3xl font-bold text-white mb-3">Dịch Vụ Tạo Hình Ảnh Sản Phẩm</h3>
                  <p className="text-white/90 text-lg max-w-2xl mx-auto">
                    Tạo hình ảnh sản phẩm với độ chi tiết tuyệt đối, không cần studio, không cần sản phẩm thật
                  </p>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-10">
              <div className="group">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 bg-black">
                  <video
                    className="w-full aspect-video object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  >
                    <source src="/AI FASHION/Galle video test 1.mp4" type="video/mp4" />
                    Trình duyệt của bạn không hỗ trợ video.
                  </video>
                </div>
                <div className="mt-6">
                  <h3 className="text-2xl font-bold text-white mb-3">Dịch Vụ Tạo Hình Ảnh Tự Động</h3>
                  <p className="text-white/80 text-base">
                    Xem cách AI Fashion tự động tạo hình ảnh sản phẩm chuyên nghiệp cho khách hàng, thay thế hoàn toàn photoshoot truyền thống
                  </p>
                </div>
              </div>

              <div className="group">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 bg-black">
                  <video
                    className="w-full aspect-video object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  >
                    <source src="/AI FASHION/Watch testing.mp4" type="video/mp4" />
                    Trình duyệt của bạn không hỗ trợ video.
                  </video>
                </div>
                <div className="mt-6">
                  <h3 className="text-2xl font-bold text-white mb-3">Dịch Vụ Cho Sản Phẩm Cao Cấp</h3>
                  <p className="text-white/80 text-base">
                    Khám phá khả năng tạo hình ảnh cho các sản phẩm cao cấp như đồng hồ, trang sức với độ chi tiết và chân thực tuyệt đối
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      <Footer />
      
      {/* Floating Contact Buttons */}
      <FloatingChatButtons />
    </div>
  )
}
