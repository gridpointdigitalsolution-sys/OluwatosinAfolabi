import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Daily Quotes by Pastor Mrs. Oluwatosin Afolabi",
  description: "Privacy policy for the Daily Quotes platform by Pastor Mrs. Oluwatosin Afolabi.",
};

const EFFECTIVE_DATE = "1 May 2025";
const CONTACT_EMAIL = "contact@pastorquotes.com";

export default function PrivacyPage() {
  const sections = [
    {
      title: "1. Information We Collect",
      body: `We do not require you to create an account or provide personal information to use this website.
When you visit, our hosting provider may automatically collect standard server log data such as your IP address,
browser type, referring page, and date/time of visit. This data is used solely for security and performance analysis.`,
    },
    {
      title: "2. Cookies and Analytics",
      body: `This site may use cookies to improve your experience. We may use third-party analytics services
(such as Google Analytics) to understand how visitors interact with the site. These services may set cookies
on your device. You can control cookies through your browser settings. We may also display Google AdSense
advertisements; Google uses cookies to serve relevant ads based on your prior visits to this and other websites.
You can opt out at google.com/settings/ads.`,
    },
    {
      title: "3. Saved Quotes",
      body: `Quotes you save are stored locally on your device using your browser's localStorage feature.
This data never leaves your device and is not transmitted to our servers.`,
    },
    {
      title: "4. Third-Party Services",
      body: `We use Groq's AI API to generate quotes and bible-api.com to retrieve Bible verse text.
Your chosen theme word is sent to these services to generate content. No personally identifiable information is transmitted.`,
    },
    {
      title: "5. Children's Privacy",
      body: `This website is not directed at children under the age of 13. We do not knowingly collect
personal information from children under 13.`,
    },
    {
      title: "6. Changes to This Policy",
      body: `We may update this Privacy Policy from time to time. Changes will be posted on this page
with a revised effective date. Your continued use of the site after changes constitutes acceptance of the updated policy.`,
    },
    {
      title: "7. Contact Us",
      body: `If you have any questions about this Privacy Policy, please contact us at: ${CONTACT_EMAIL}`,
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 px-4">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(201,168,76,0.08) 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center text-center">
          <p className="font-lato text-xs uppercase tracking-[0.3em] text-gold/60 mb-3">Legal</p>
          <h1
            className="font-playfair italic font-bold text-4xl md:text-5xl mb-4"
            style={{
              background: "linear-gradient(135deg,#F5E6A3 0%,#C9A84C 50%,#F5E6A3 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Privacy Policy
          </h1>
          <p className="font-lato text-white/40 text-sm">Effective date: {EFFECTIVE_DATE}</p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-3xl mx-auto px-4 pb-20">
        <div className="glass-card rounded-2xl p-8 md:p-12 mb-8 space-y-8">
          <p className="font-lato text-white/65 leading-relaxed">
            Your privacy is important to us. This Privacy Policy explains how this website
            (&ldquo;Site&rdquo;) operated by Pastor Mrs. Oluwatosin Afolabi collects, uses, and
            protects any information that you provide when using this site.
          </p>

          {sections.map((s) => (
            <div key={s.title}>
              <h2
                className="font-playfair font-bold text-lg mb-3"
                style={{
                  background: "linear-gradient(135deg,#F5E6A3,#C9A84C)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {s.title}
              </h2>
              <p className="font-lato text-white/65 leading-relaxed whitespace-pre-line">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/" className="btn-gold inline-flex">
            ← Back to Daily Quotes
          </Link>
        </div>
      </section>
    </main>
  );
}
