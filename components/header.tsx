"use client"

import { Menu } from 'lucide-react';
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState, useEffect } from "react"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Trang Chủ" },
    { href: "/execumate", label: "ExecuMate" },
    { href: "/flowhub", label: "Flowhub" },
    { href: "/ai-fashion", label: "AI Fashion" },
    { href: "/markify", label: "Markify" },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-[100] w-full transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/98 backdrop-blur-md shadow-lg border-b border-gray-200/50' 
        : 'bg-white/95 backdrop-blur-sm border-b border-gray-100'
    }`}>
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center group">
          <Image 
            src="/Logo.png" 
            alt="Sutra Lab Logo" 
            width={200} 
            height={60}
            className="h-16 w-auto transition-transform duration-300 group-hover:scale-105"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200 relative group"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <Link 
            href="/blog" 
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors px-4 py-2 rounded-lg hover:bg-gray-50"
          >
            Blog
          </Link>
          <Link href="#contact">
            <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 rounded-lg px-6 py-2.5 text-sm font-semibold transition-all shadow-md hover:shadow-lg hover:scale-105">
              Đặt Lịch Demo
            </Button>
          </Link>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-700">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Mở/đóng menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-2 mt-8">
                {navLinks.map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href} 
                    className="text-lg font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-3 rounded-lg transition-all"
                  >
                    {link.label}
                  </Link>
                ))}
                <hr className="my-4 border-gray-200" />
                <Link 
                  href="/blog" 
                  className="text-lg font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-3 rounded-lg transition-all"
                >
                  Blog
                </Link>
                <Link href="#contact" className="w-full mt-4">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600">
                    Đặt Lịch Demo
                  </Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
