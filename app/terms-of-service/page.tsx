import type { Metadata } from "next"

import { OauthPublicPage, PolicyLinks } from "@/components/oauth-public-page"

export const metadata: Metadata = {
  title: "Terms of Service | Jarvis by SutraLab",
  description: "Terms governing the use of Jarvis by SutraLab and its Google Workspace features.",
}

export default function TermsOfServicePage() {
  return (
    <OauthPublicPage eyebrow="Effective 17 July 2026" title="Terms of Service for Jarvis by SutraLab" summary="These terms govern the use of Jarvis and its supported Google Workspace features.">
      <section>
        <h2 className="text-3xl font-semibold text-slate-950">1. Service description</h2>
        <p className="mt-4">Jarvis is an AI productivity assistant that helps users organize work and perform user-requested actions across supported services, including Google Workspace. Features may vary by deployment, plan, account type, and administrator policy.</p>
      </section>
      <section>
        <h2 className="text-3xl font-semibold text-slate-950">2. Account authorization</h2>
        <p className="mt-4">You must use an account you are authorized to control. You decide which permissions to grant through Google's consent screen and may revoke access at any time through Google Account security settings.</p>
        <p className="mt-4">You are responsible for reviewing important actions before submission, including emails, calendar invitations, file sharing, purchases, legal filings, and actions that may affect third parties.</p>
      </section>
      <section>
        <h2 className="text-3xl font-semibold text-slate-950">3. Acceptable use</h2>
        <p className="mt-4">You must not use Jarvis to violate laws or rights, access another person's data without authorization, distribute malware or spam, bypass security controls, or make high-impact decisions about a person without appropriate human review.</p>
      </section>
      <section>
        <h2 className="text-3xl font-semibold text-slate-950">4. Google services</h2>
        <p className="mt-4">Google services are provided by Google and are subject to Google's terms, policies, availability, quotas, and administrator controls. SutraLab does not control Google service interruptions, token revocations, organization allowlists, or changes to Google APIs.</p>
      </section>
      <section>
        <h2 className="text-3xl font-semibold text-slate-950">5. AI output and user review</h2>
        <p className="mt-4">AI-generated suggestions can be incomplete or incorrect. Users must review outputs and destination details before authorizing consequential actions. Jarvis is not a substitute for professional legal, medical, accounting, financial, or security advice.</p>
      </section>
      <section>
        <h2 className="text-3xl font-semibold text-slate-950">6. Security</h2>
        <p className="mt-4">You must protect your device, account credentials, and recovery methods. Notify us promptly if you believe your Jarvis connection or Google authorization has been compromised. We may suspend a connection to protect users or the Service.</p>
      </section>
      <section>
        <h2 className="text-3xl font-semibold text-slate-950">7. Availability and changes</h2>
        <p className="mt-4">We aim to provide a reliable service but do not guarantee uninterrupted or error-free operation. We may update, limit, or discontinue features to improve security, comply with policy, or maintain the Service.</p>
      </section>
      <section>
        <h2 className="text-3xl font-semibold text-slate-950">8. Suspension and termination</h2>
        <p className="mt-4">You may stop using Jarvis and revoke Google access at any time. We may suspend or terminate access for abuse, security risk, non-payment, legal requirements, or material breach of these Terms.</p>
      </section>
      <section>
        <h2 className="text-3xl font-semibold text-slate-950">9. Disclaimers and liability</h2>
        <p className="mt-4">To the extent permitted by law, the Service is provided without guarantees that it will meet every requirement or prevent every loss. SutraLab is not responsible for indirect or consequential losses caused by user-approved actions, third-party services, or events outside our reasonable control.</p>
      </section>
      <section>
        <h2 className="text-3xl font-semibold text-slate-950">10. Privacy and contact</h2>
        <p className="mt-4">Our Privacy Policy explains how Jarvis handles personal information and Google user data. For questions, email <a href="mailto:minhtq@aisutralab.com" className="font-semibold text-blue-700 hover:text-blue-900">minhtq@aisutralab.com</a>.</p>
      </section>
      <PolicyLinks />
    </OauthPublicPage>
  )
}
