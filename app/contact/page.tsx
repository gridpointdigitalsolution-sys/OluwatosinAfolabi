import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact — Daily Quotes by Pastor Mrs. Oluwatosin Afolabi",
  description: "Get in touch with the Daily Quotes ministry team.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 px-4">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(201,168,76,0.1) 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center text-center">
          <p className="font-lato text-xs uppercase tracking-[0.3em] text-gold/60 mb-3">
            Reach Out
          </p>
          <h1
            className="font-playfair italic font-bold text-4xl md:text-5xl mb-6"
            style={{
              background: "linear-gradient(135deg,#F5E6A3 0%,#C9A84C 50%,#F5E6A3 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Contact Us
          </h1>
          <div className="flex items-center gap-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-gold/60" />
            <span className="text-gold">✦</span>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-gold/60" />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-2xl mx-auto px-4 pb-20">
        {/* Intro */}
        <div className="glass-card rounded-2xl p-8 md:p-10 mb-8 text-center">
          <MessageCircle className="text-gold mx-auto mb-4" size={36} />
          <h2 className="font-playfair italic text-xl text-light-gold mb-4">We&apos;d love to hear from you</h2>
          <p className="font-lato text-white/65 leading-relaxed">
            Whether you have a testimony to share, a prayer request, feedback about the site, or simply
            want to send a word of encouragement — our hearts are open. Please use the email below
            and we will respond as soon as possible.
          </p>
        </div>

        {/* Contact card */}
        <div
          className="rounded-2xl p-8 md:p-10 mb-8 flex flex-col items-center gap-5"
          style={{
            background: "linear-gradient(135deg,rgba(201,168,76,0.12) 0%,rgba(201,168,76,0.04) 100%)",
            border: "1px solid rgba(201,168,76,0.3)",
          }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#F5E6A3,#C9A84C)" }}
          >
            <Mail size={22} className="text-navy" />
          </div>
          <div className="text-center">
            <p className="font-lato text-xs uppercase tracking-[0.2em] text-gold/60 mb-2">
              Email us at
            </p>
            <a
              href="mailto:contact@pastorquotes.com"
              className="font-playfair italic text-xl text-light-gold hover:text-gold transition-colors"
            >
              contact@pastorquotes.com
            </a>
          </div>
        </div>

        {/* Response time note */}
        <div className="text-center mb-10">
          <p className="font-lato text-white/40 text-sm">
            We typically respond within 2–3 business days. Thank you for your patience.
          </p>
        </div>

        {/* Prayer note */}
        <div
          className="rounded-2xl p-6 mb-10 text-center"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(201,168,76,0.15)",
          }}
        >
          <span className="text-gold text-2xl mb-3 block">✦</span>
          <p className="font-playfair italic text-white/50 text-sm leading-relaxed">
            &ldquo;The Lord watch between me and thee, when we are absent one from another.&rdquo;
            <br />
            <span className="font-lato font-bold text-gold/60 not-italic text-xs uppercase tracking-widest mt-2 block">
              Genesis 31:49
            </span>
          </p>
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
