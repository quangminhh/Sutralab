import type { Metadata } from "next"

import { OauthPublicPage, PolicyLinks } from "@/components/oauth-public-page"

export const metadata: Metadata = {
  title: "Privacy Policy | Jarvis by SutraLab",
  description: "How Jarvis by SutraLab accesses, uses, stores, shares, retains, and deletes Google user data.",
}

export default function PrivacyPolicyPage() {
  return (
    <OauthPublicPage
      eyebrow="Effective 17 July 2026"
      title="Privacy Policy for Jarvis by SutraLab"
      summary="This policy explains how Jarvis accesses, uses, stores, shares, retains, and deletes Google user data."
    >
      <section>
        <h2 className="text-3xl font-semibold text-slate-950">1. Google data Jarvis may access</h2>
        <p className="mt-4">The exact permissions depend on the features a user enables. They may include:</p>
        <ul className="mt-4 list-disc space-y-2 pl-6">
          <li>Google Tasks data needed to list, create, update, organize, or complete tasks requested by the user.</li>
          <li>Google Calendar data needed to list availability and create, update, or organize events requested by the user.</li>
          <li>Gmail data needed for enabled email features, such as preparing, sending, reading, or organizing messages requested by the user.</li>
          <li>Google Drive files the user explicitly selects or that are required for an enabled Drive workflow.</li>
          <li>Basic account information, such as name and email address, used to connect the correct Google account.</li>
        </ul>
        <p className="mt-4">Jarvis requests the narrowest permissions reasonably required for enabled features.</p>
      </section>
      <section>
        <h2 className="text-3xl font-semibold text-slate-950">2. How Google user data is used</h2>
        <p className="mt-4">We use Google user data only to perform actions the user requests, display relevant information, maintain the authorized connection, prevent duplicate actions, diagnose failures, protect the service, and provide requested support.</p>
        <p className="mt-4 font-semibold text-slate-950">We do not sell Google user data. We do not use Google user data for advertising. We do not use private Google Workspace content to train general-purpose advertising models or sell user profiles.</p>
      </section>
      <section>
        <h2 className="text-3xl font-semibold text-slate-950">3. Storage and security</h2>
        <p className="mt-4">The current desktop release stores each user's OAuth refresh token in encrypted local credential storage. Access tokens are short-lived and refreshed automatically when needed. Tokens are not stored in plaintext project files.</p>
        <p className="mt-4">Any hosted deployment that processes Google user data must apply encryption in transit, access controls, least-privilege permissions, logging minimization, and documented retention controls. We will update this policy before materially changing how Google user data is handled.</p>
      </section>
      <section>
        <h2 className="text-3xl font-semibold text-slate-950">4. Sharing and disclosure</h2>
        <p className="mt-4">We do not share Google user data except with service providers acting on our instructions and bound by security obligations, when the user directs Jarvis to share information with a specified recipient, or when required by law or security needs.</p>
        <p className="mt-4">Any transfer or use of information received from Google APIs will comply with the Google API Services User Data Policy, including its Limited Use requirements.</p>
      </section>
      <section>
        <h2 className="text-3xl font-semibold text-slate-950">5. Retention and deletion</h2>
        <p className="mt-4">OAuth tokens are retained while the user keeps the Google connection active. Operational logs are limited to information needed for reliability and security and should not contain complete message or file bodies unless required for a user-requested workflow.</p>
        <p className="mt-4">Users may disconnect Google Workspace at any time. After a verified deletion request, we will delete or render inaccessible stored OAuth tokens and associated service data, except information that must be retained for legal, security, or fraud-prevention purposes.</p>
      </section>
      <section>
        <h2 className="text-3xl font-semibold text-slate-950">6. User controls</h2>
        <ul className="mt-4 list-disc space-y-2 pl-6">
          <li>Review and revoke Jarvis access from Google Account security settings.</li>
          <li>Disable individual Google Workspace features where supported.</li>
          <li>Request access, correction, export, or deletion of data associated with Jarvis.</li>
          <li>Contact us at <a className="font-semibold text-blue-700 hover:text-blue-900" href="mailto:minhtq@aisutralab.com">minhtq@aisutralab.com</a>.</li>
        </ul>
      </section>
      <section>
        <h2 className="text-3xl font-semibold text-slate-950">7. Children's privacy</h2>
        <p className="mt-4">Jarvis is not directed to children under the minimum age required to consent to online services in their jurisdiction. We do not knowingly collect Google Workspace data from children without appropriate authorization.</p>
      </section>
      <section>
        <h2 className="text-3xl font-semibold text-slate-950">8. Changes and contact</h2>
        <p className="mt-4">We may update this policy when features, laws, or data practices change. We will update the effective date and provide additional notice when a change materially affects Google user data.</p>
        <address className="mt-5 not-italic">SutraLab<br /><a href="mailto:minhtq@aisutralab.com" className="font-semibold text-blue-700 hover:text-blue-900">minhtq@aisutralab.com</a><br /><a href="https://www.aisutralab.com/" className="font-semibold text-blue-700 hover:text-blue-900">https://www.aisutralab.com/</a></address>
      </section>
      <PolicyLinks />
    </OauthPublicPage>
  )
}
