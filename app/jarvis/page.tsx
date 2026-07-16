import type { Metadata } from "next"
import Link from "next/link"

import { OauthPublicPage, PolicyLinks } from "@/components/oauth-public-page"

export const metadata: Metadata = {
  title: "Jarvis by SutraLab | Google Workspace AI Assistant",
  description: "Jarvis by SutraLab helps users organize work and perform approved actions across Google Tasks, Calendar, Gmail, and Drive.",
}

const capabilities = [
  ["Plan work", "Review and organize Google Tasks, priorities, and due dates at the user's request."],
  ["Manage time", "Read availability and create or update Google Calendar events with user approval."],
  ["Handle communication", "Prepare or send email only when the user activates the related Gmail feature."],
  ["Work with files", "Search, preview, summarize, or download existing Google Drive files only in workflows explicitly started by the user; read-only access cannot edit, share, move, or delete files."],
]

export default function JarvisPage() {
  return (
    <OauthPublicPage
      eyebrow="Product overview"
      title="Jarvis by SutraLab"
      summary="An AI productivity assistant that turns user instructions into controlled, reviewable actions across supported Google Workspace services."
    >
      <section>
        <h2 className="text-3xl font-semibold text-slate-950">What Jarvis does</h2>
        <p className="mt-4">Jarvis helps individuals and teams review workloads, plan schedules, prepare communication, and work with relevant documents. Google Workspace access is optional and starts only after the user grants the permissions displayed by Google.</p>
      </section>
      <section className="grid gap-6 md:grid-cols-2">
        {capabilities.map(([title, description]) => (
          <div key={title} className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
            <p className="mt-3 text-base leading-7 text-slate-700">{description}</p>
          </div>
        ))}
      </section>
      <section>
        <h2 className="text-3xl font-semibold text-slate-950">How Google data is handled</h2>
        <div className="mt-5 space-y-4">
          <p>Jarvis uses Google user data only for features the user enables and actions the user requests. Permissions are kept to the narrowest level needed for each feature.</p>
          <p>The current desktop release keeps each user's OAuth refresh token in encrypted credential storage. SutraLab does not sell Google user data or use private Google Workspace content for advertising.</p>
          <p>Read the complete <Link href="/privacy-policy" className="font-semibold text-blue-700 hover:text-blue-900">Privacy Policy</Link> for details about access, storage, sharing, retention, deletion, and user controls.</p>
        </div>
      </section>
      <section className="rounded-2xl bg-slate-900 p-7 text-slate-100 md:p-9">
        <h2 className="text-2xl font-semibold text-white">User control comes first</h2>
        <p className="mt-4 text-base leading-7 text-slate-300 md:text-lg">Users choose which Google account to connect, review every requested permission, and can revoke Jarvis access from Google Account security settings at any time.</p>
      </section>
      <section>
        <h2 className="text-3xl font-semibold text-slate-950">Support</h2>
        <p className="mt-4">For privacy questions, disconnection, or deletion requests, contact <a href="mailto:minhtq@aisutralab.com" className="font-semibold text-blue-700 hover:text-blue-900">minhtq@aisutralab.com</a>.</p>
      </section>
      <PolicyLinks />
    </OauthPublicPage>
  )
}
