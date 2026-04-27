import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About — Daily Quotes by Pastor Mrs. Oluwatosin Afolabi",
  description:
    "Learn about Pastor Mrs. Oluwatosin Afolabi and the heart behind this daily devotional quote generator.",
};

export default function AboutPage() {
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
            Our Story
          </p>
          <h1
            className="font-playfair italic font-bold text-4xl md:text-5xl mb-6 gold-glow"
            style={{
              background: "linear-gradient(135deg,#F5E6A3 0%,#C9A84C 50%,#F5E6A3 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            About This Ministry
          </h1>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-gold/60" />
            <span className="text-gold">✦</span>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-gold/60" />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-3xl mx-auto px-4 pb-20">
        <div className="glass-card rounded-2xl p-8 md:p-12 mb-10">
          {/* Pastor photo */}
          <div className="flex flex-col sm:flex-row items-center gap-8 mb-10">
            <div
              className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full flex-shrink-0 gold-ring-glow"
              style={{ padding: 4 }}
            >
              <div className="relative w-full h-full rounded-full overflow-hidden">
                <Image
                  src="/pastor.jpg.png"
                  alt="Pastor Mrs. Oluwatosin Afolabi"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div>
              <p className="font-lato text-xs uppercase tracking-[0.25em] text-gold/60 mb-1">
                Pastor & Visionary
              </p>
              <h2
                className="font-playfair italic font-bold text-2xl md:text-3xl mb-2"
                style={{
                  background: "linear-gradient(135deg,#F5E6A3,#C9A84C)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Pastor Mrs. Oluwatosin Afolabi
              </h2>
              <p className="font-lato text-white/60 text-sm leading-relaxed">
                A vessel of God's grace, called to bring His word to every heart.
              </p>
            </div>
          </div>

          <div className="space-y-5 font-lato text-white/75 leading-relaxed text-base">
            <p>
              Pastor Mrs. Oluwatosin Afolabi is a woman of deep faith, warmth, and pastoral wisdom.
              For years she has dedicated her life to nurturing the spiritual growth of her congregation,
              her family, and all who encounter her ministry — one word, one prayer, one quote at a time.
            </p>
            <p>
              This platform was born out of a simple but profound desire: to bring a moment of divine
              encouragement to anyone who needs it, wherever they are in the world. Every quote generated
              here is rooted in scripture and shaped by the same pastoral care that Pastor Afolabi carries
              in her daily ministry.
            </p>
            <p>
              Whether you are facing a trial, celebrating a blessing, or simply seeking a word to carry
              through your day — our prayer is that each quote you receive here will speak directly to your
              heart as a love letter from God.
            </p>
          </div>
        </div>

        {/* Mission card */}
        <div
          className="rounded-2xl p-8 md:p-10 text-center mb-10"
          style={{
            background: "linear-gradient(135deg,rgba(201,168,76,0.12) 0%,rgba(201,168,76,0.04) 100%)",
            border: "1px solid rgba(201,168,76,0.3)",
          }}
        >
          <span className="text-gold text-2xl mb-4 block">✦</span>
          <h3 className="font-playfair italic text-xl text-light-gold mb-4">Our Mission</h3>
          <p className="font-lato text-white/65 leading-relaxed">
            To make the wisdom of scripture accessible, beautiful, and personal — delivering a
            fresh word of faith, hope, and grace directly to you each day.
          </p>
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="btn-gold inline-flex"
          >
            ← Back to Daily Quotes
          </Link>
        </div>
      </section>
    </main>
  );
}
