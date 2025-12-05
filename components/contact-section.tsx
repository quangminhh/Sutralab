"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { contactInfo } from '@/lib/contact-info'

interface ContactSectionProps {
  title?: string
  mainMessage?: string
  contactEmail?: string
  socialLinks?: Array<{ id: string; name: string; iconSrc: string; href: string }>
  backgroundImageSrc?: string
  onSubmit?: (data: any) => void
}

const defaultSocialLinks = [
  { id: '1', name: 'LinkedIn', iconSrc: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/linkedin.svg', href: contactInfo.social.linkedin },
  { id: '2', name: 'Facebook', iconSrc: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/facebook.svg', href: contactInfo.social.facebook },
  { id: '3', name: 'Twitter', iconSrc: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/x.svg', href: contactInfo.social.twitter },
]

export const ContactSection: React.FC<ContactSectionProps> = ({
  title = "Chúng tôi có thể biến dự án mơ ước của bạn thành hiện thực",
  mainMessage = "Hãy trò chuyện với chúng tôi! 👋",
  contactEmail = contactInfo.email.primary,
  socialLinks = defaultSocialLinks,
  backgroundImageSrc = "https://images.unsplash.com/photo-1742273330004-ef9c9d228530?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDY0fENEd3V3WEpBYkV3fHxlbnwwfHx8fHw%3D&auto=format&fit=crop&q=60&w=900",
  onSubmit,
}) => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    message: '',
    projectType: [] as string[],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (type: string, checked: boolean) => {
    setFormData((prev) => {
      const currentTypes = prev.projectType
      if (checked) {
        return { ...prev, projectType: [...currentTypes, type] }
      } else {
        return { ...prev, projectType: currentTypes.filter((t) => t !== type) }
      }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(formData)
    console.log("Form submitted:", formData)
    // Reset form after submission
    setFormData({
      name: '',
      email: '',
      message: '',
      projectType: [],
    })
  }

  const projectTypeOptions = [
    'Website', 'Mobile App', 'Web App', 'E-Commerce',
    'Brand Identity', '3D & Animation', 'Social Media Marketing',
    'Brand Strategy & Consulting', 'Other'
  ]

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Background Image and Animated Bubbles */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-500 ease-in-out"
        style={{ backgroundImage: `url(${backgroundImageSrc})` }}
      >
        {/* Animated Bubbles */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="absolute bg-white/20 rounded-full animate-bubble opacity-0"
              style={{
                width: `${Math.random() * 20 + 10}px`,
                height: `${Math.random() * 20 + 10}px`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${Math.random() * 20 + 10}s`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-between w-full h-full p-4 md:p-8 lg:p-12">
        {/* Main Section - Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-7xl p-4 md:p-8 rounded-xl flex-grow">
          {/* Left Side: Title */}
          <div className="flex flex-col justify-end p-4 lg:p-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight drop-shadow-lg max-w-lg">
              {title}
            </h1>
          </div>

          {/* Right Side: Contact Form */}
          <div className="bg-background/90 p-6 md:p-8 rounded-lg shadow-xl border border-border">
            <h2 className="text-2xl font-bold text-foreground mb-6">{mainMessage}</h2>
            
            {/* Email & Socials */}
            <div className="mb-6">
              <p className="text-muted-foreground mb-2">Gửi email cho chúng tôi tại</p>
              <a href={`mailto:${contactEmail}`} className="text-primary hover:underline font-medium">
                {contactEmail}
              </a>
              <div className="flex items-center space-x-3 mt-4">
                <span className="text-muted-foreground">HOẶC</span>
                {socialLinks.map((link) => (
                  <Button key={link.id} variant="outline" size="icon" asChild>
                    <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.name}>
                      <img src={link.iconSrc} alt={link.name} className="h-4 w-4 dark:invert" />
                    </a>
                  </Button>
                ))}
              </div>
            </div>

            <hr className="my-6 border-border" />

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <p className="text-muted-foreground">Để lại tin nhắn ngắn gọn cho chúng tôi</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên của bạn</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    placeholder="Tên của bạn" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="Email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Mô tả ngắn gọn về ý tưởng dự án của bạn...</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Mô tả ngắn gọn về ý tưởng dự án của bạn..."
                  className="min-h-[80px]"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-4">
                <p className="text-muted-foreground">Tôi đang tìm kiếm...</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {projectTypeOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={option.replace(/\s/g, '-').toLowerCase()}
                        checked={formData.projectType.includes(option)}
                        onCheckedChange={(checked) => handleCheckboxChange(option, checked as boolean)}
                      />
                      <Label htmlFor={option.replace(/\s/g, '-').toLowerCase()} className="text-sm font-normal">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full">
                Gửi tin nhắn
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* CSS for bubble animation */}
      <style jsx global>{`
        @keyframes bubble {
          0% {
            transform: translateY(0) translateX(0) scale(0.5);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) translateX(calc(var(--rand-x-offset) * 10vw)) scale(1.2);
            opacity: 0;
          }
        }
        .animate-bubble {
          animation: bubble var(--animation-duration, 15s) ease-in-out infinite;
          animation-fill-mode: forwards;
          --rand-x-offset: ${Math.random() > 0.5 ? 1 : -1};
        }
      `}</style>
    </section>
  )
}

