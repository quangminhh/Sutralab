"use client"

import Link from "next/link"
import Image from "next/image"
import { contactInfo } from "@/lib/contact-info"

/**
 * Floating Chat Buttons Component
 * Fixed position contact bubbles for Zalo, WhatsApp, Phone, and Gmail
 * All bubbles are always visible, positioned at bottom right corner
 */
export function FloatingChatButtons() {
  const contactOptions = [
    {
      name: "Zalo",
      href: contactInfo.zalo.url,
      image: "/Contact us/Zalo.webp",
      label: "Nhắn tin Zalo"
    },
    {
      name: "WhatsApp",
      href: contactInfo.whatsapp.url,
      image: "/Contact us/whatsapp-png.webp",
      label: "Nhắn tin WhatsApp"
    },
    {
      name: "Phone",
      href: `tel:${contactInfo.phone.primary}`,
      image: "/Contact us/telephone-call-support-png.webp",
      label: `Gọi điện: ${contactInfo.phone.display.primary}`
    },
    {
      name: "Gmail",
      href: `mailto:${contactInfo.email.primary}`,
      image: "/Contact us/Gmail.webp",
      label: "Gửi email"
    }
  ]

  return (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end gap-3">
      {/* Contact Options - Always visible */}
      {contactOptions.map((option, index) => (
        <Link
          key={option.name}
          href={option.href}
          target={option.name === "Phone" || option.name === "Gmail" ? undefined : "_blank"}
          rel={option.name === "Phone" || option.name === "Gmail" ? undefined : "noopener noreferrer"}
          className="
            relative
            w-16 h-16
            rounded-full
            bg-white
            flex items-center justify-center
            shadow-xl
            transition-all duration-300
            hover:scale-110
            hover:shadow-2xl
            group
            overflow-hidden
            border-2 border-gray-100
          "
          title={option.label}
        >
          <Image
            src={option.image}
            alt={option.label}
            width={64}
            height={64}
            className="w-full h-full object-cover rounded-full"
            priority
          />
          {/* Tooltip */}
          <span className="absolute right-full mr-3 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg z-50">
            {option.label}
            <span className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-900"></span>
          </span>
        </Link>
      ))}
    </div>
  )
}

