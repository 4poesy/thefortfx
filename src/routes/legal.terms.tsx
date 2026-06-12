import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/legal-layout";

export const Route = createFileRoute("/legal/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service | TheFortFX" },
      { name: "description", content: "TheFortFX Terms of Service — the rules that govern your use of our forex intelligence platform, signals, forecasts, and tools." },
      { property: "og:title", content: "Terms of Service | TheFortFX" },
      { property: "og:description", content: "Rules governing use of TheFortFX intelligence platform, signals and tools." },
      { property: "og:url", content: "/legal/terms" },
    ],
    links: [{ rel: "canonical", href: "/legal/terms" }],
  }),
  component: () => (
    <LegalLayout eyebrow="Terms" title="Terms of Service" description="Please read these terms carefully before using TheFortFX." updated="June 1, 2026">
      <h2>1. Acceptance of terms</h2>
      <p>By accessing or using TheFortFX (the "Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.</p>
      <h2>2. The Service</h2>
      <p>TheFortFX is an AI-powered research and intelligence platform for foreign exchange traders. We provide signals, forecasts, sentiment analytics, calculators and educational content. <strong className="text-foreground">We are not a broker, do not hold client funds, and do not execute trades on your behalf.</strong></p>
      <h2>3. Not financial advice</h2>
      <p>All content on TheFortFX is for informational and educational purposes only. Nothing on the Service constitutes investment, financial, tax or legal advice. You are solely responsible for your trading decisions.</p>
      <h2>4. Eligibility</h2>
      <p>You must be at least 18 years old and legally able to enter into a binding contract in your jurisdiction. The Service is not available where prohibited by law.</p>
      <h2>5. Accounts</h2>
      <ul>
        <li>You must provide accurate registration information.</li>
        <li>You are responsible for safeguarding your credentials.</li>
        <li>You may not share your account or resell access.</li>
      </ul>
      <h2>6. Subscriptions and billing</h2>
      <p>Paid plans are billed in advance on a recurring basis. You can cancel any time; cancellations take effect at the end of the current billing period. Refunds are issued at our discretion and as required by applicable consumer law.</p>
      <h2>7. Acceptable use</h2>
      <p>You agree not to scrape, reverse engineer, redistribute or resell the Service or its data without prior written consent.</p>
      <h2>8. Intellectual property</h2>
      <p>All software, models, content and brand assets are owned by TheFortFX or its licensors. We grant you a limited, non-transferable, revocable license to use the Service for personal, non-commercial trading research.</p>
      <h2>9. Disclaimers</h2>
      <p>The Service is provided "as is" without warranties of any kind. We do not guarantee accuracy, completeness, profitability or uninterrupted availability.</p>
      <h2>10. Limitation of liability</h2>
      <p>To the maximum extent permitted by law, TheFortFX shall not be liable for any indirect, incidental, special or consequential damages, including trading losses, arising from your use of the Service.</p>
      <h2>11. Termination</h2>
      <p>We may suspend or terminate access for breach of these Terms. You may terminate your account at any time from the dashboard.</p>
      <h2>12. Changes</h2>
      <p>We may update these Terms; material changes will be notified via email or in-app. Continued use after notice constitutes acceptance.</p>
      <h2>13. Governing law</h2>
      <p>These Terms are governed by the laws of England and Wales, without regard to conflict of law principles.</p>
      <h2>14. Contact</h2>
      <p>Questions? Email <a href="mailto:legal@thefortfx.com" className="text-primary hover:underline">legal@thefortfx.com</a>.</p>
    </LegalLayout>
  ),
});
