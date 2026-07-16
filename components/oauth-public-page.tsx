import Link from "next/link"
import type { ReactNode } from "react"

import Footer from "@/components/footer"
import Header from "@/components/header"

type OauthPublicPageProps = {
  eyebrow: string
  title: string
  summary: string
  children: ReactNode
}

export function OauthPublicPage({ eyebrow, title, summary, children }: OauthPublicPageProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Header />
      <main className="pt-28 pb-20">
        <div className="mx-auto max-w-5xl px-5 md:px-8">
          <nav aria-label="Breadcrumb" className="mb-8 text-sm text-slate-600">
            <Link href="/" className="hover:text-blue-700">SutraLab</Link>
            <span aria-hidden="true" className="mx-2">/</span>
            <Link href="/jarvis" className="hover:text-blue-700">Jarvis</Link>
          </nav>
          <header className="border-b border-slate-200 pb-10">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">{eyebrow}</p>
            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">{title}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700 md:text-xl">{summary}</p>
          </header>
          <article className="mt-12 max-w-4xl space-y-10 text-base leading-8 text-slate-700 md:text-lg">{children}</article>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export function PolicyLinks() {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-3 border-t border-slate-200 pt-8 text-sm font-semibold">
      <Link href="/jarvis" className="text-blue-700 hover:text-blue-900">Jarvis overview</Link>
      <Link href="/privacy-policy" className="text-blue-700 hover:text-blue-900">Privacy Policy</Link>
      <Link href="/terms-of-service" className="text-blue-700 hover:text-blue-900">Terms of Service</Link>
      <a href="mailto:minhtq@aisutralab.com" className="text-blue-700 hover:text-blue-900">Contact SutraLab</a>
    </div>
  )
}
