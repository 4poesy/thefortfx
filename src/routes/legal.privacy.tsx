import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/legal-layout";

export const Route = createFileRoute("/legal/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | TheFortFX" },
      { name: "description", content: "How TheFortFX collects, uses and protects your personal data. GDPR-compliant privacy practices for our forex intelligence platform." },
      { property: "og:title", content: "Privacy Policy | TheFortFX" },
      { property: "og:description", content: "How TheFortFX collects, uses and protects your data — GDPR-aligned." },
      { property: "og:url", content: "/legal/privacy" },
    ],
    links: [{ rel: "canonical", href: "/legal/privacy" }],
  }),
  component: () => (
    <LegalLayout eyebrow="Privacy" title="Privacy Policy" description="Your data, what we collect, why, and your rights." updated="June 1, 2026">
      <h2>1. Who we are</h2>
      <p>TheFortFX Ltd ("we", "us") is the data controller responsible for personal data collected via thefortfx.com.</p>
      <h2>2. Data we collect</h2>
      <ul>
        <li><strong className="text-foreground">Account data</strong> — name, email, hashed password.</li>
        <li><strong className="text-foreground">Billing data</strong> — handled by our payment processor; we store last four digits and billing country only.</li>
        <li><strong className="text-foreground">Usage data</strong> — pages viewed, signals opened, calculators used, device and browser info.</li>
        <li><strong className="text-foreground">Communications</strong> — support tickets and email correspondence.</li>
      </ul>
      <h2>3. How we use it</h2>
      <ul>
        <li>Operate and improve the Service.</li>
        <li>Process payments and prevent fraud.</li>
        <li>Send transactional and (with consent) marketing emails.</li>
        <li>Comply with legal obligations.</li>
      </ul>
      <h2>4. Legal bases (GDPR)</h2>
      <p>Contract (to provide the Service), legitimate interests (security, analytics, product improvement), consent (marketing, optional cookies), and legal obligation (tax, accounting).</p>
      <h2>5. Sharing</h2>
      <p>We share data with vetted processors: cloud hosting, analytics, email, payments. We do not sell personal data. We may disclose data when required by law.</p>
      <h2>6. International transfers</h2>
      <p>Where data leaves the UK/EEA, we rely on Standard Contractual Clauses and equivalent safeguards.</p>
      <h2>7. Retention</h2>
      <p>Account data is retained while your account is active and for up to 24 months after closure, except where longer retention is required by law.</p>
      <h2>8. Your rights</h2>
      <p>Access, rectification, erasure, restriction, portability, objection, and the right to withdraw consent. Email <a href="mailto:privacy@thefortfx.com" className="text-primary hover:underline">privacy@thefortfx.com</a> to exercise any right.</p>
      <h2>9. Cookies</h2>
      <p>We use essential cookies and, with consent, analytics cookies. Manage preferences via the in-app cookie banner.</p>
      <h2>10. Security</h2>
      <p>Encryption in transit (TLS 1.3) and at rest (AES-256), role-based access, regular penetration testing.</p>
      <h2>11. Changes</h2>
      <p>We will notify material changes via email or in-app.</p>
      <h2>12. Contact</h2>
      <p>Data Protection Officer: <a href="mailto:dpo@thefortfx.com" className="text-primary hover:underline">dpo@thefortfx.com</a>.</p>
    </LegalLayout>
  ),
});
