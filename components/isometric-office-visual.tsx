"use client"

import { useCallback, useRef, useState } from "react"

interface IsometricOfficeVisualProps {
  videoSrc?: string
}

/**
 * IsometricOfficeVisual
 * Renders the hero video inside a glassy frame so the media blends with the gradient background.
 * Enhanced with 3D card hover effect.
 */
export function IsometricOfficeVisual({
  videoSrc = "/isometric-office-rooms-video.mp4",
}: IsometricOfficeVisualProps) {
  const [isHovering, setIsHovering] = useState(false)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const prevRotateRef = useRef({ x: 0, y: 0 })
  const frameRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = useCallback(() => setIsHovering(true), [])
  const handleMouseLeave = useCallback(() => {
    setIsHovering(false)
    setRotateX(0)
    setRotateY(0)
    prevRotateRef.current = { x: 0, y: 0 }
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!frameRef.current) return
    
    const rect = frameRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY
    
    // Calculate rotation based on mouse position (max 8 degrees for subtle effect)
    const maxRotation = 8
    const rotateXValue = -(mouseY / (rect.height / 2)) * maxRotation
    const rotateYValue = (mouseX / (rect.width / 2)) * maxRotation
    
    // Smooth the rotation values to prevent jittery movement (lerp)
    const smoothFactor = 0.3
    const smoothX = prevRotateRef.current.x * (1 - smoothFactor) + rotateXValue * smoothFactor
    const smoothY = prevRotateRef.current.y * (1 - smoothFactor) + rotateYValue * smoothFactor
    
    prevRotateRef.current = { x: smoothX, y: smoothY }
    setRotateX(smoothX)
    setRotateY(smoothY)
  }, [])

  return (
    <div
      ref={frameRef}
      className="relative mx-auto flex items-center justify-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Glass frame with 3D effect */}
      <div
        className="relative rounded-[32px] backdrop-blur-md transition-all duration-500"
        style={{
          background: "rgba(255,255,255,0.08)",
          border: "2px solid rgba(255,255,255,0.35)",
          boxShadow: isHovering
            ? `
                0 35px 80px rgba(14, 165, 233, 0.4),
                0 15px 40px rgba(34, 211, 238, 0.3),
                inset 0 1px 0 rgba(255,255,255,0.6),
                inset 0 -1px 0 rgba(255,255,255,0.2)
              `
            : `
            0 25px 60px rgba(14, 165, 233, 0.25),
            inset 0 1px 0 rgba(255,255,255,0.6),
            inset 0 -1px 0 rgba(255,255,255,0.2)
          `,
          padding: "1.5rem",
          transform: isHovering
            ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.015) translateZ(15px)`
            : "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1) translateZ(0px)",
          transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Glow accent */}
        <div className="pointer-events-none absolute inset-0 rounded-[32px] opacity-50 blur-3xl" style={{
          background: "linear-gradient(135deg, rgba(34,211,238,0.35), rgba(59,130,246,0.25))",
        }}></div>

        {/* Video */}
        <div
          className="relative rounded-3xl overflow-hidden"
          style={{
            // Increased size for better prominence
            maxWidth: "1100px",
            width: "min(70vw, 1100px)",
          }}
        >
          <video
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="w-full h-auto object-contain"
            style={{
              display: "block",
              backgroundColor: "transparent",
            }}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  )
}

